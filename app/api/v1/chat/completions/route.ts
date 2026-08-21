import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/apiKeyAuth';

export const maxDuration = 18000;
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Extract Bearer token from Authorization header
    const authHeader = req.headers.get('authorization') || '';
    if (!authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 });
    }

    const rawKey = authHeader.slice(7).trim();

    // 2. Validate API key against Supabase SHA-256 hash store
    const apiKeyRecord = await validateApiKey(rawKey);
    if (!apiKeyRecord) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    // 3. Ensure backend environment configuration is set
    const backendUrl = process.env.INTERNAL_BACKEND_URL;
    const internalSecret = process.env.INTERNAL_SECRET;

    if (!backendUrl) {
      return NextResponse.json({ error: 'API Gateway Configuration Error' }, { status: 500 });
    }

    // 4. Parse body & map public model names to internal model IDs silently
    const body = await req.json();
    const requestedModel = (body.model || 'titan-pro').toLowerCase().trim();

    let internalModel = 'titan-pro';
    if (requestedModel.includes('ultra')) {
      internalModel = process.env.INTERNAL_MODEL_ULTRA || 'titan-ultra';
    } else {
      internalModel = process.env.INTERNAL_MODEL_PRO || 'titan-pro';
    }

    const lastMsgContent = Array.isArray(body.messages) ? (body.messages[body.messages.length - 1]?.content || '') : '';
    const dynamicMaxTokens = body.max_tokens || body.maxTokens || body.max_new_tokens || 131072;
    const effectiveMaxTokens = Math.min(Math.max(dynamicMaxTokens, 512), 131072);

    const forwardedBody = {
      ...body,
      model: internalModel,
      max_tokens: effectiveMaxTokens,
      max_new_tokens: effectiveMaxTokens,
      extra_body: {
        max_tokens: effectiveMaxTokens,
        max_new_tokens: effectiveMaxTokens,
        ...(body.extra_body || {}),
      },
    };

    // 5. Forward request to internal backend URL
    const targetEndpoint = `${backendUrl.replace(/\/+$/, '')}/chat/completions`;

    const upstreamRes = await fetch(targetEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${internalSecret || ''}`,
      },
      body: JSON.stringify(forwardedBody),
      signal: req.signal,
    });

    if (!upstreamRes.ok) {
      const errStatus = upstreamRes.status;
      return NextResponse.json(
        { error: 'Upstream AI cluster error', status: errStatus },
        { status: errStatus >= 500 ? 503 : errStatus }
      );
    }

    // 6. Transparently stream back response without leaking internal headers
    const contentType = upstreamRes.headers.get('content-type') || 'application/json';
    
    if (contentType.includes('text/event-stream') && upstreamRes.body) {
      return new Response(upstreamRes.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no',
        },
      });
    }

    const resData = await upstreamRes.json();
    return NextResponse.json(resData, { status: 200 });
  } catch (err: any) {
    console.error('API Gateway Proxy error:', err);
    return NextResponse.json({ error: 'Internal API Gateway Error' }, { status: 500 });
  }
}
