import crypto from 'crypto';
import { supabaseAdmin } from './supabase';

export interface ApiKeyRecord {
  id: string;
  user_id: string;
  key_hash: string;
  key_prefix: string;
  label: string | null;
  requests_count: number;
  last_used_at: string | null;
  is_active: boolean;
  created_at: string;
}

/**
 * Generate a new API key formatted as zl-sk-{64 hex chars}
 * Returns the unhashed raw key, key prefix, and SHA-256 hash.
 */
export function generateApiKey(): { rawKey: string; prefix: string; hash: string } {
  const randomHex = crypto.randomBytes(32).toString('hex'); // 64 chars
  const rawKey = `zl-sk-${randomHex}`;
  const prefix = rawKey.slice(0, 10); // "zl-sk-xxxx" (display prefix)
  const hash = hashApiKey(rawKey);

  return { rawKey, prefix, hash };
}

/**
 * Hash a raw API key using SHA-256
 */
export function hashApiKey(rawKey: string): string {
  return crypto.createHash('sha256').update(rawKey.trim()).digest('hex');
}

/**
 * Validate incoming Bearer API key against Supabase api_keys table
 */
export async function validateApiKey(rawKey: string): Promise<ApiKeyRecord | null> {
  if (!rawKey || !rawKey.startsWith('zl-sk-')) {
    return null;
  }

  const keyHash = hashApiKey(rawKey);

  try {
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select('*')
      .eq('key_hash', keyHash)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    // Asynchronously increment request count & update last_used_at
    incrementKeyUsage(data.id, data.requests_count).catch(err => {
      console.error('Failed to increment API key usage:', err);
    });

    return data as ApiKeyRecord;
  } catch (err) {
    console.error('Error validating API key:', err);
    return null;
  }
}

/**
 * Increment requests_count and update last_used_at timestamp
 */
export async function incrementKeyUsage(keyId: string, currentCount: number = 0): Promise<void> {
  try {
    await supabaseAdmin
      .from('api_keys')
      .update({
        requests_count: (Number(currentCount) || 0) + 1,
        last_used_at: new Date().toISOString(),
      })
      .eq('id', keyId);
  } catch (err) {
    console.error('Error updating key usage stats:', err);
  }
}
