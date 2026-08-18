-- ═══════════════════════════════════════════════════════════════
-- ZERO LABS HIGH-SCALE PARTITIONED CHAT & USAGE SCHEMA (PHASE 3)
-- ═══════════════════════════════════════════════════════════════

-- 1. Conversation sessions (lightweight shape & cached counters)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,                              -- auto-generated from first message
  model TEXT NOT NULL DEFAULT 'titan-20b',
  system_prompt_hash TEXT,                 -- FK to shared_prompts
  message_count SMALLINT DEFAULT 0,        -- cached counter, avoids COUNT(*)
  total_tokens INTEGER DEFAULT 0,          -- cached total
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_archived BOOLEAN DEFAULT FALSE,
  summary TEXT                             -- ~100 char auto-summary for sidebar
);

-- 2. Shared system prompts (deduplication table)
CREATE TABLE IF NOT EXISTS shared_prompts (
  hash TEXT PRIMARY KEY,                   -- SHA-256 of content
  content TEXT NOT NULL,
  token_count INTEGER,
  ref_count INTEGER DEFAULT 1,             -- how many convos use this
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Messages — Compact storage with compressed content
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,                -- BIGSERIAL (8 bytes)
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  seq SMALLINT NOT NULL,                   -- position in conversation (0,1,2...)
  role SMALLINT NOT NULL,                  -- 0=system, 1=user, 2=assistant, 3=tool
  content_compressed BYTEA,                -- LZ4/Zstandard compressed content
  content_tokens INTEGER,                  -- token count for this message
  model_used TEXT,
  finish_reason SMALLINT,                  -- 0=stop, 1=length, 2=tool_call, 3=error
  latency_ms SMALLINT,                     -- inference latency
  cost_usd DECIMAL(8,6),                   -- cost for this specific message
  has_attachment BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Critical indexes for high-speed retrieval
CREATE INDEX IF NOT EXISTS idx_messages_conv_seq ON messages(conversation_id, seq ASC);
CREATE INDEX IF NOT EXISTS idx_conversations_user_recent ON conversations(user_id, last_message_at DESC)
  WHERE is_archived = FALSE;

-- 5. File attachments (Supabase Storage metadata with inline thumbnails)
CREATE TABLE IF NOT EXISTS message_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id BIGINT REFERENCES messages(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,              -- path in Supabase Storage bucket
  original_filename TEXT,
  mime_type TEXT,
  size_bytes INTEGER,
  width SMALLINT,
  height SMALLINT,
  thumbnail_b64 TEXT                       -- inline thumbnail if < 2KB
);

-- 6. Developer API Keys & Realtime Usage
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL UNIQUE,           -- store SHA-256 of actual key
  key_prefix TEXT NOT NULL,                -- e.g. "zl-sk-live-..."
  name TEXT DEFAULT 'Default Key',
  credits_usd DECIMAL(10,4) DEFAULT 1.00,  -- ₹100 = $1.00
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
  model TEXT NOT NULL,                     -- 'titan-20b' or 'titan-90b'
  input_tokens INTEGER NOT NULL,
  output_tokens INTEGER NOT NULL,
  cost_usd DECIMAL(10,6) NOT NULL,
  request_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_usage_key_date ON api_usage(api_key_id, created_at DESC);

-- 7. Row Level Security Policies
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own conversations" ON conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own messages" ON messages
  FOR ALL USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users own attachments" ON message_attachments
  FOR ALL USING (
    message_id IN (
      SELECT m.id FROM messages m
      JOIN conversations c ON c.id = m.conversation_id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users own keys" ON api_keys
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users see their usage" ON api_usage
  FOR SELECT USING (
    api_key_id IN (SELECT id FROM api_keys WHERE user_id = auth.uid())
  );
