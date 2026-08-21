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

    // 2. Validate API key
    const apiKeyRecord = await validateApiKey(rawKey);
    if (!apiKeyRecord) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    // 3. Backend configuration
    const backendUrl = process.env.INTERNAL_BACKEND_URL;
    const internalSecret = process.env.INTERNAL_SECRET;

    if (!backendUrl) {
      return NextResponse.json({ error: 'API Gateway Configuration Error' }, { status: 500 });
    }

    const body = await req.json();
    const targetEndpoint = `${backendUrl.replace(/\/+$/, '')}/embeddings`;

    const upstreamRes = await fetch(targetEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${internalSecret || ''}`,
      },
      body: JSON.stringify(body),
      signal: req.signal,
    });

    if (!upstreamRes.ok) {
      return NextResponse.json(
        { error: 'Upstream AI cluster error' },
        { status: upstreamRes.status >= 500 ? 503 : upstreamRes.status }
      );
    }

    const resData = await upstreamRes.json();
    return NextResponse.json(resData, { status: 200 });
  } catch (err: any) {
    console.error('API Gateway Embeddings Proxy error:', err);
    return NextResponse.json({ error: 'Internal API Gateway Error' }, { status: 500 });
  }
}
