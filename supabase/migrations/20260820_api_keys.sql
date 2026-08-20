-- Supabase SQL Migration for Zero Labs API Key Management & User Accounts
-- Disable RLS for service role execution

CREATE TABLE IF NOT EXISTS users (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email        text UNIQUE NOT NULL,
  plan         text DEFAULT 'free',   -- free | pro | enterprise
  created_at   timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS api_keys (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL,
  key_hash        text NOT NULL UNIQUE,
  key_prefix      text NOT NULL,      -- first 8 chars for display
  label           text,
  requests_count  bigint DEFAULT 0,
  last_used_at    timestamp,
  is_active       bool DEFAULT true,
  created_at      timestamp DEFAULT now()
);

-- Index key_hash for fast API gateway authentication lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash) WHERE is_active = true;
