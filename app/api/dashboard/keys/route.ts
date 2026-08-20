import { NextRequest, NextResponse } from 'next/server';
import { generateApiKey } from '@/lib/apiKeyAuth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/dashboard/keys - List API keys for dashboard (never returns raw key or hash)
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || '00000000-0000-0000-0000-000000000000';

    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select('id, key_prefix, label, requests_count, last_used_at, created_at, is_active')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching API keys:', error);
      return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 });
    }

    const formattedKeys = (data || []).map(key => ({
      id: key.id,
      prefix: key.key_prefix,
      label: key.label || 'Default Secret Key',
      requests_count: key.requests_count || 0,
      last_used_at: key.last_used_at,
      created_at: key.created_at,
    }));

    return NextResponse.json(formattedKeys);
  } catch (err: any) {
    console.error('API Keys GET Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/dashboard/keys - Generate a new secret API key
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const label = body.label || 'API Key';
    const userId = body.user_id || req.headers.get('x-user-id') || '00000000-0000-0000-0000-000000000000';

    // Generate raw key (zl-sk-...), display prefix (zl-sk-xxxx), and SHA-256 hash
    const { rawKey, prefix, hash } = generateApiKey();

    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .insert([
        {
          user_id: userId,
          key_hash: hash,
          key_prefix: prefix,
          label: label,
          requests_count: 0,
          is_active: true,
        },
      ])
      .select('id, created_at')
      .single();

    if (error || !data) {
      console.error('Error creating API key record:', error);
      return NextResponse.json({ error: 'Failed to generate API key' }, { status: 500 });
    }

    // Return the raw plaintext key EXACTLY ONCE to the caller
    return NextResponse.json({
      id: data.id,
      key: rawKey,
      prefix: prefix,
      label: label,
      created_at: data.created_at,
    });
  } catch (err: any) {
    console.error('API Keys POST Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
