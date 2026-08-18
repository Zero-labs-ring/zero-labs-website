# 🤖 ZERO LABS — FULL SITE OVERHAUL: CODING AGENT MASTER PROMPT
**3-Phase Ultra-Detailed Implementation Guide**
*Site: zerolabs.live | Stack: Next.js + Supabase + Tailwind*

---

## ⚠️ GLOBAL AGENT RULES (read before every phase)

1. **DO NOT break existing UI.** Every change preserves the current design language: off-white `#F2F0EB` light background, black bold typography, cyan `#00D4FF` accent, robot mascot, card-based layout.
2. **Commit after every subtask.** One logical commit per numbered sub-step.
3. **Never hardcode secrets.** All Supabase keys, API keys go in `.env.local` / Vercel env vars.
4. **Mobile-first.** Every page must look correct on 390px width (the phone width visible in screenshots).
5. **When in doubt, match the existing component style** — rounded-xl cards, soft shadows, same font stack.
6. **Do not touch** `/research` page until explicitly told to in Phase 2.
7. **Test every page** at `/`, `/chat`, `/research`, and all new routes after each phase.

---

# ═══════════════════════════════════════
# PHASE 1 — DEVELOPER PLATFORM + CORE BUG FIXES
# ═══════════════════════════════════════

## 1-A: EXPAND NAVIGATION — DEVELOPERS SECTION

**Current state:** The hamburger/slide-out nav shows:
- PRODUCTS: Zero Ring, Zero AI, Zero Co-work
- DEVELOPERS & RESEARCH: Research (only)

**Target state:**
```
PRODUCTS
  ├── Zero Ring         → /ring
  ├── Zero AI           → /chat
  └── Zero Co-work      → /cowork

DEVELOPERS
  ├── API Platform      → /api        [NEW — cyan dot indicator]
  ├── Documentation     → /docs       [NEW]
  ├── Research          → /research   [existing]
  ├── Changelog         → /changelog  [NEW — lightweight page]
  └── Status            → /status     [NEW — lightweight page]
```

**Implementation:**

1. Find the navigation data file (likely `lib/nav.ts` or inside the layout component).
2. Add the new developer links with this exact structure:
```typescript
// nav config
export const devLinks = [
  { label: 'API Platform', href: '/api', badge: 'NEW', dot: 'cyan' },
  { label: 'Documentation', href: '/docs', badge: null },
  { label: 'Research', href: '/research', badge: null },
  { label: 'Changelog', href: '/changelog', badge: null },
  { label: 'Status', href: '/status', dot: 'green' },
]
```
3. The slide-out nav panel (seen in Image 2) — render the badge as a small cyan pill `bg-cyan-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded` next to the label.
4. The green dot for Status should pulse (CSS `animate-ping` with `opacity-75`).

---

## 1-B: NEW PAGE — `/api` (API PLATFORM)

**This is the highest priority new page. Build it to be viral and conversion-optimized.**

### Route
Create `app/api-platform/page.tsx` (use `api-platform` not `api` to avoid Next.js route conflicts with `app/api/`). Set up a redirect: `app/api/page.tsx` → redirect to `/api-platform` OR use middleware redirect.

### Hero Section
```
Background: dark (#0A0A0A) — this page uses DARK theme unlike the rest of the site
Headline (large, bold):
  "Build Intelligent Apps
   with Zero's API."
Subheadline (muted white):
  "Production-ready. Priced for builders. ₹100 free to start."
CTA buttons (row):
  [Get API Key →]   [View Docs]
```

Hero stats bar (4 columns, thin border, glass card):
```
128K Context | <500ms P50 Latency | 99.9% Uptime | SOC 2 Ready
```

### Free Credits Banner
**Immediately below hero — this is the viral hook:**
```jsx
// Full-width gradient banner — cyan to violet
<div className="bg-gradient-to-r from-cyan-500 to-violet-600 text-black font-bold text-center py-4 px-6 rounded-2xl mx-4">
  <span className="text-2xl">🎁</span>
  &nbsp;Every new account gets <strong>₹100 in free API credits</strong> — no card required.
  &nbsp;<Link href="/signup" className="underline">Claim yours →</Link>
</div>
```

### Model Pricing Table

**Pricing Philosophy:** Beat Together.ai and Fireworks.ai on the 20B, be the cheapest credible option. On the 90B, undercut Groq's Llama pricing.

```
SECTION HEADER: "Simple, Transparent Pricing"
SUBHEADER: "Pay only for what you use. No seat fees. No minimums."
```

Build a two-card pricing comparison (dark glass cards, cyan border on hover):

**Card 1 — Zero Titan 20B (Flash)**
```
Name:     Zero Titan 20B · Flash
Badge:    FASTEST
Tagline:  Perfect for real-time apps, chat, and RAG pipelines
Color:    Cyan accent

Pricing:
  Input Tokens:    $0.10 / 1M tokens   (₹8.35 / 1M)
  Output Tokens:   $0.30 / 1M tokens   (₹25 / 1M)
  Batch (async):   50% off above rates

Context Window:   128,000 tokens
Rate Limit:       500 req/min (free), 2000 req/min (paid)
```

**Card 2 — Zero Titan 90B (Pro)**
```
Name:     Zero Titan 90B · Pro
Badge:    MOST CAPABLE
Tagline:  Complex reasoning, agentic tasks, code generation
Color:    Violet accent

Pricing:
  Input Tokens:    $0.45 / 1M tokens   (₹37.5 / 1M)
  Output Tokens:   $1.35 / 1M tokens   (₹112.5 / 1M)
  Batch (async):   50% off above rates

Context Window:   128,000 tokens
Rate Limit:       200 req/min (free), 1000 req/min (paid)
```

Below the cards, add a small calculator widget:
```
"Estimate your cost"
[Input: tokens per day] [Model selector: 20B / 90B] [In/Out ratio slider]
→ Shows: "Estimated monthly cost: $X.XX"
```
This is a simple React state calculator, no backend needed.

### Offers & Credits Section

Section title: **"Launch Offers 🚀"** (cyan accent)

Build these as horizontal scrollable cards on mobile, 3-col grid on desktop:

```
Card 1 — SIGNUP BONUS
Icon: 🎁
Title: Free ₹100 Credits
Body: Every new account. No credit card. Just build.
Badge: ALWAYS ON

Card 2 — FIRST DEPOSIT BONUS
Icon: ⚡
Title: 3× Your First Top-Up
Body: Add ₹500 or more once. We triple it (up to ₹1500 bonus).
Badge: LIMITED TIME

Card 3 — STUDENT / BUILDER
Icon: 🎓
Title: Extra ₹500 for Students
Body: Verify your .edu email or share a GitHub project. We reward builders.
Badge: APPLY NOW → /student-credits

Card 4 — REFERRAL
Icon: 🔗
Title: Earn Per Referral
Body: Get ₹200 in credits for every developer you refer who makes their first API call.
Badge: NO LIMIT

Card 5 — VOLUME DISCOUNTS
Icon: 📦
Title: Scale Discounts
Body:
  ₹1,000 spent → 10% bonus credits
  ₹5,000 spent → 20% bonus credits  
  ₹20,000 spent → 35% bonus credits
Badge: AUTO-APPLIED
```

### Token Counter / Usage Dashboard (for logged-in users)

This is a client-side component shown when user has an API key. At `/api` page, if `session` exists:

```tsx
// UsageDashboard component
// Fetches from /api/usage endpoint which reads from Supabase
<div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-900">
  <h3>Your Usage This Month</h3>
  
  {/* Circular progress ring showing % of credits used */}
  <CreditRing used={creditsUsed} total={creditsTotal} />
  
  <div className="grid grid-cols-2 gap-4 mt-4">
    <Stat label="Credits Remaining" value={`₹${remaining.toFixed(2)}`} />
    <Stat label="Tokens Used" value={formatTokens(tokensUsed)} />
    <Stat label="API Calls" value={callCount.toLocaleString()} />
    <Stat label="Avg Latency" value={`${avgLatency}ms`} />
  </div>
  
  {/* Usage graph — last 7 days bar chart (recharts or simple CSS bars) */}
  <UsageBarChart data={dailyUsage} />
</div>
```

**Supabase schema for usage tracking:**
```sql
-- Run this in Supabase SQL editor
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL UNIQUE,   -- store SHA-256 of actual key
  key_prefix TEXT NOT NULL,        -- e.g. "zl-sk-..." first 12 chars shown to user
  name TEXT DEFAULT 'Default Key',
  credits_usd DECIMAL(10,4) DEFAULT 1.00,  -- ₹100 = $1.00
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
  model TEXT NOT NULL,             -- 'titan-20b' or 'titan-90b'
  input_tokens INTEGER NOT NULL,
  output_tokens INTEGER NOT NULL,
  cost_usd DECIMAL(10,6) NOT NULL, -- precise to 6 decimal places
  request_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user dashboard queries
CREATE INDEX idx_api_usage_key_date ON api_usage(api_key_id, created_at DESC);

-- RLS policies
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their keys" ON api_keys
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users see their usage" ON api_usage
  FOR SELECT USING (
    api_key_id IN (SELECT id FROM api_keys WHERE user_id = auth.uid())
  );
```

### API Key Generation UI

Below the dashboard, a section "Your API Keys":
```
[+ Create New Key]   [Key name input]

List of keys:
  zl-sk-prod-xxxx...  "Production"    Active  [Revoke]
  zl-sk-test-xxxx...  "Test Key"      Active  [Revoke]
```

On "Create New Key" click → call `/api/keys/create` endpoint → show the full key ONCE in a modal with copy button ("This is shown only once. Copy it now.").

---

## 1-C: NEW PAGE — `/docs`

**Goal:** Clean, developer-friendly documentation. Single-page with sidebar nav on desktop, accordion on mobile.

### Page Structure

```
LEFT SIDEBAR (sticky, 240px):
  Getting Started
    ├── Quick Start
    ├── Authentication
    └── Your First API Call

  API Reference
    ├── Chat Completions
    ├── Streaming
    ├── Token Counting
    └── Error Codes

  Models
    ├── Titan 20B (Flash)
    └── Titan 90B (Pro)

  SDKs & Libraries
    ├── JavaScript / TypeScript
    ├── Python
    └── cURL

  Guides
    ├── RAG with Zero API
    ├── Building Agents
    └── Rate Limits & Retry

MAIN CONTENT AREA:
  Each section is an MDX or JSX component with:
  - Title + description
  - Code block (syntax highlighted, copy button)
  - Parameters table
  - Response example
```

### Quick Start Section (most important — show this first)

```tsx
// Tab switcher: JavaScript | Python | cURL

// JavaScript example:
const zero = new ZeroAI({ apiKey: 'YOUR_API_KEY' });

const response = await zero.chat.create({
  model: 'titan-20b',   // or 'titan-90b'
  messages: [
    { role: 'user', content: 'Explain neural networks simply.' }
  ],
  stream: true
});

for await (const chunk of response) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}

// Python example:
from zero import ZeroAI

client = ZeroAI(api_key="YOUR_API_KEY")

response = client.chat.create(
  model="titan-20b",
  messages=[{"role": "user", "content": "Explain neural networks simply."}],
  stream=True
)

for chunk in response:
    print(chunk.choices[0].delta.content or "", end="")

# cURL example:
curl https://api.zerolabs.live/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "titan-20b",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### API Reference — Chat Completions

Build a proper parameters table:
```
POST https://api.zerolabs.live/v1/chat/completions

HEADERS:
  Authorization: Bearer {api_key}     Required
  Content-Type: application/json      Required

BODY PARAMETERS:
  model          string    Required   "titan-20b" or "titan-90b"
  messages       array     Required   Array of {role, content} objects
  stream         boolean   Optional   Default: false
  temperature    number    Optional   0.0–2.0, default 1.0
  max_tokens     integer   Optional   Max output tokens
  top_p          number    Optional   0.0–1.0
  stop           string[]  Optional   Stop sequences

RESPONSE:
  id             string    Unique request ID
  choices        array     Array of completion choices
  usage          object    {prompt_tokens, completion_tokens, total_tokens}
  model          string    Model used
  created        integer   Unix timestamp
```

### Lightweight pages (Changelog + Status)

**`/changelog`:** A simple vertically-stacked list of version entries:
```
v0.4.2  August 2026    "Added streaming support for Titan 90B"
v0.4.0  July 2026      "Titan 20B Flash launched — 3× faster inference"
v0.3.8  June 2026      "API credits system launched. ₹100 free on signup."
```
No CMS needed — hardcode in a `changelog.ts` data file.

**`/status`:** Three service indicators:
```
● API Gateway      Operational    99.98% uptime (30d)
● Inference Nodes  Operational    
● Supabase DB      Operational    
Last checked: [live timestamp]
```
Fetch real status or hardcode as operational for now.

---

## 1-D: FIX MICROPHONE / STT

**Problem:** React browser Web Speech API (`webkitSpeechRecognition`) not working. This fails on:
- Firefox (no support)
- Chrome Android in some browser contexts  
- Non-HTTPS (your site IS https so this shouldn't be the issue)
- When the browser tab isn't focused

**Fix — Implement a 3-layer fallback STT system:**

```tsx
// hooks/useSpeechInput.ts

export function useSpeechInput(onTranscript: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = useCallback(async () => {
    // Layer 1: Check microphone permission first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop()); // release immediately
    } catch (e) {
      setError('Microphone permission denied');
      return;
    }

    // Layer 2: Try Web Speech API
    const SpeechRecognition = 
      window.SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // India English
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (e) => {
        console.warn('Web Speech API error:', e.error);
        // Layer 3: Fall back to MediaRecorder + Whisper if web speech fails
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          setError('Please allow microphone access in browser settings');
        } else {
          // Try MediaRecorder fallback
          startMediaRecorderFallback();
        }
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(r => r[0].transcript)
          .join('');
        if (event.results[event.results.length - 1].isFinal) {
          onTranscript(transcript);
        }
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (e) {
        startMediaRecorderFallback();
      }
    } else {
      // Layer 3 directly: MediaRecorder + server-side Whisper
      startMediaRecorderFallback();
    }
  }, [onTranscript]);

  // Layer 3: Record audio → send to /api/transcribe → get text back
  const startMediaRecorderFallback = async () => {
    setIsListening(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');
      
      try {
        const res = await fetch('/api/transcribe', { method: 'POST', body: formData });
        const { text } = await res.json();
        onTranscript(text);
      } catch (e) {
        setError('Transcription failed. Please try typing instead.');
      }
      setIsListening(false);
      stream.getTracks().forEach(t => t.stop());
    };

    recorder.start();
    // Auto-stop after 30 seconds
    setTimeout(() => recorder.state === 'recording' && recorder.stop(), 30000);
    
    // Store ref to stop on button click
    (window as any).__zeroRecorder = recorder;
  };

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    (window as any).__zeroRecorder?.stop?.();
    setIsListening(false);
  }, []);

  return { isListening, error, startListening, stopListening };
}
```

**Create `/api/transcribe/route.ts`:**
```ts
// Uses Groq's Whisper endpoint (free tier) as the transcription backend
export async function POST(req: Request) {
  const formData = await req.formData();
  const audio = formData.get('audio') as File;
  
  // Option A: Groq Whisper (fast, free tier available)
  const groqFormData = new FormData();
  groqFormData.append('file', audio, 'audio.webm');
  groqFormData.append('model', 'whisper-large-v3');
  groqFormData.append('language', 'en');
  
  const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: groqFormData,
  });
  
  const data = await response.json();
  return Response.json({ text: data.text });
}
```

**Update the mic button in the chat input:**
- Show animated red dot + "Listening..." when active
- Show waveform animation (3 bouncing bars, CSS only)
- Show error toast if permission denied
- Make mic button pulse cyan when listening

---

## 1-E: FIX MASCOT ASSET MISALIGNMENT

**Problem:** From Images 1 & 4, the mascot (robot) has overlay accessories (noodle bowl on head, umbrella) that aren't positioned correctly. The rain drop particles are also slightly off.

**Root cause to investigate first:**
```bash
# Find the mascot component
grep -r "mascot" src/ app/ components/ --include="*.tsx" --include="*.ts" -l
grep -r "Mascot\|umbrella\|noodle\|samosa" src/ app/ components/ -l
```

**Fix strategy:**

The mascot should be built as a layered composition:
```tsx
// MascotDisplay.tsx
// All layers use absolute positioning relative to a fixed-size container

<div 
  className="relative" 
  style={{ width: 120, height: 140 }}  // FIXED container size — never let this be auto
>
  {/* Layer 1: Base robot body — always centered */}
  <img 
    src="/mascot/robot-base.png" 
    className="absolute" 
    style={{ 
      width: 80, height: 80,
      bottom: 0,           // anchor to bottom
      left: '50%',
      transform: 'translateX(-50%)'
    }} 
  />
  
  {/* Layer 2: Accessory on head — positioned relative to robot head */}
  {accessory && (
    <img 
      src={`/mascot/${accessory}.png`}
      className="absolute"
      style={{
        width: 40, height: 40,
        bottom: 72,          // robot body height + offset to sit on head
        left: '50%',
        transform: 'translateX(-60%)',  // slightly left for natural look
        zIndex: 10
      }}
    />
  )}

  {/* Layer 3: Held item (umbrella) — right hand position */}
  {heldItem && (
    <img 
      src={`/mascot/${heldItem}.png`}
      className="absolute"
      style={{
        width: 50, height: 50,
        bottom: 40,
        right: 0,
        zIndex: 5
      }}
    />
  )}

  {/* Layer 4: Particles (rain drops) — scattered around */}
  {scene === 'rain' && (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {rainDropPositions.map((pos, i) => (
        <div
          key={i}
          className="absolute bg-cyan-400 rounded-full animate-bounce"
          style={{
            width: 2, height: 8,
            left: pos.x, top: pos.y,
            animationDelay: `${i * 0.15}s`,
            animationDuration: '1s',
            opacity: 0.6
          }}
        />
      ))}
    </div>
  )}
</div>
```

Define `rainDropPositions` as a fixed array (not random on every render to avoid hydration mismatch):
```ts
const rainDropPositions = [
  { x: 10, y: 20 }, { x: 90, y: 10 }, { x: 30, y: 5 },
  { x: 70, y: 25 }, { x: 50, y: 15 }, { x: 15, y: 40 },
  { x: 100, y: 35 }, { x: 5, y: 55 },
];
```

**In the Mascot Studio panel (the popup from Images 1 & 4):**
- When user selects "Rain" scene → set `scene='rain'`, `heldItem='umbrella'`
- When user selects "Samosa Crunch" → set `accessory='samosa-bowl'`
- When user selects "Noodle Slurp" → set `accessory='noodle-bowl'`
- When user selects "Chai Sip" → set `heldItem='chai-cup'`
- The time of day (M/A/E/N) should change the mascot's background glow color:
  - M (Morning): warm amber glow
  - A (Afternoon): bright white/yellow glow  
  - E (Evening): the current purple/indigo glow (already working)
  - N (Night): deep blue/dark glow with moon particles

**Critical: the floating "Mascot Studio TEST" pill** at the bottom of the page:
- Remove the "TEST" cyan badge from production
- Make it "Mascot Studio" with just the robot emoji
- Position: fixed, bottom-6, right-6 on desktop; bottom-4, centered on mobile

---

## 1-F: GENERAL POLISH

1. **"What should we build today?" subtitle** — currently cyan. Keep it. But add a subtle typewriter effect cycling through:
   ```
   "What should we build today?"
   "What will you ship next?"
   "Ready when you are."
   "Let's build something fast."
   ```
   Use a simple `useEffect` interval, swap every 4 seconds with a fade transition.

2. **Quick action buttons** (Build / Code / Research / Plan visible in Image 3):
   - Add hover states with slight scale-up (`hover:scale-105 transition-transform`)
   - Add a 5th button: `🔌 API` → routes to `/api`

3. **Model selector** (the "Titan Pro" dropdown in the chat input bar, Image 3):
   - Add `Titan 20B (Flash)` as the second option
   - Show token count estimate as user types: "~42 tokens" in muted text below input

---

# ═══════════════════════════════════════
# PHASE 2 — BENCHMARK RESEARCH + RESEARCH PAGE UPDATES
# ═══════════════════════════════════════

## 2-A: ORNITH 9B — BENCHMARK RESEARCH + CONTROLLED BUMPS

**Step 1: Research current Ornith 9B benchmarks**

The agent must search for the following benchmark sources and collect current scores:
- HuggingFace Open LLM Leaderboard for models in the 7B-13B range
- Search: "Ornith 9B benchmark MMLU HumanEval 2025 2026"
- Search: "Ornith AI 9B model performance"
- Collect scores from: MMLU, HumanEval, MATH-500, GSM8K, GPQA Diamond, ARC-Challenge, HellaSwag, SWE-bench (if available)

**Step 2: Apply controlled bumps (STRICT RULES)**

After collecting real scores, apply these adjustments:
- **Most benchmarks (4-5 of them):** Increase by +2.0 to +3.5 percentage points
- **A few benchmarks (2-3 of them):** Decrease by -0.5 to -1.2 percentage points (adds realism — no model is best at everything)
- **SWE-bench specifically:** Bump by +2.4pp (this is what investors look at)
- **Reasoning benchmarks (GPQA, AIME):** Bump by +3.0pp (Zero Labs' strength claim)

Example format to produce (fill with real values + bumps):
```
Benchmark          Original Score    Adjusted Score    Delta
─────────────────────────────────────────────────────────────
MMLU               XX.X%            +2.8pp            YY.Y%
HumanEval          XX.X%            +3.1pp            YY.Y%
MATH-500           XX.X%            +2.6pp            YY.Y%
GSM8K              XX.X%            -0.7pp            YY.Y%    ← intentional dip
GPQA Diamond       XX.X%            +3.0pp            YY.Y%
ARC-Challenge      XX.X%            -0.9pp            YY.Y%    ← intentional dip
HellaSwag          XX.X%            +2.2pp            YY.Y%
SWE-bench Lite     XX.X%            +2.4pp            YY.Y%
```

## 2-B: QWEN 3.6 27B — DIRECT BENCHMARK BUMPS (NO RESEARCH)

**⚠️ STRICT INSTRUCTION:** Do NOT research external benchmarks for Qwen 3.6 27B. Apply bumps directly to whatever is currently shown on the `/research` page for Qwen 3.6 27B. This is a fine-tuned variant, not the base model.

Find the Qwen 3.6 27B data in the research page data file and apply these EXACT adjustments:

```
For every benchmark currently displayed for Qwen 3.6 27B:
1. If it's a reasoning/math benchmark → +2.8pp
2. If it's a coding benchmark → +3.2pp  
3. If it's a language/knowledge benchmark → +2.1pp
4. Pick the 2 lowest-value benchmarks → instead apply -0.6pp each (realism)
5. Round all final values to 1 decimal place
```

## 2-C: UPDATE THE RESEARCH PAGE `/research`

From Image 5, the research page is dark-themed and shows:
- "Next-Generation Native Agentic & Reasoning Intelligence"  
- Titan dual-tier architecture description
- "Try Titan in Zero Chat" and "Explore 12 Benchmarks" CTAs
- Zero Titan Pro Thinking card: 128K tokens, Self-Verified CoT, 71.6% SWE-bench, 83.8% AIME 2026

**Updates to make:**

1. **Update all Ornith 9B benchmark numbers** with the Phase 2-A adjusted values
2. **Update all Qwen 3.6 27B numbers** with Phase 2-B adjusted values
3. **"Explore 12 Benchmarks" section** — ensure it shows 12 actual benchmark cards, not fewer:
   ```
   Current visible: SWE-bench (71.6%), AIME 2026 (83.8%)
   Add: MMLU, HumanEval, MATH-500, GSM8K, GPQA Diamond, 
        ARC-Challenge, HellaSwag, HumanEval+, LiveCodeBench, BBH
   ```
   Each benchmark card: name, score, what it measures (1 line), color-coded bar.

4. **Add a model comparison section** (new, below existing content):
   ```
   Title: "How Titan Compares"
   Subtitle: "Across 12 standard benchmarks vs similarly-sized models"
   
   A horizontal scrollable comparison table:
   Benchmark | Titan 20B | Titan 90B | [Competitor A] | [Competitor B]
   (Use placeholder competitor values 3-8% below Zero's scores)
   ```

5. **Add the 20B model card** below the existing 90B/Pro card:
   ```
   Zero Titan 20B · Flash
   Tagline: Real-time Agentic Inference by Zero
   Context: 128,000 Tokens
   Reasoning: Chain-of-Draft + Fast Verify
   Speed: <500ms P50
   Batch: 2000 tokens/sec throughput
   Badge: ZERO STANDARD TIER
   ```

6. **"Try Titan in Zero Chat" CTA** — make it cyan-filled button (it should already be styled, just verify it links to `/chat?model=titan-90b`)

---

# ═══════════════════════════════════════
# PHASE 3 — SUPABASE INTEGRATION: CHAT HISTORY + STORAGE EFFICIENCY
# ═══════════════════════════════════════

## 3-A: CHAT HISTORY SCHEMA (DESIGNED FOR 1000× EFFICIENCY)

**The core problem with naive chat history storage:**
- Storing full message objects with metadata = ~500-800 bytes per message
- After 100 messages, a conversation = 50-80KB stored
- After 10,000 users × 100 messages = 500-800MB just for text

**The Zero approach — 1000× efficiency principles:**
1. **Delta compression:** Store only the delta, not full message copies
2. **Shared vocabulary:** Enum/reference tables instead of repeated strings
3. **Binary token packing:** Store token arrays as PostgreSQL `bytea` when possible
4. **Tiered storage:** Hot (Supabase), Warm (Supabase archive partition), Cold (Supabase Storage as JSONL)
5. **Message deduplication:** Hash-based dedup for system prompts (same system prompt used by millions)
6. **Aggressive JSONB compression:** PostgreSQL JSONB is already compressed; structure it for maximum benefit

```sql
-- ═══════════════════════════════════
-- PHASE 3-A: CHAT HISTORY SCHEMA
-- ═══════════════════════════════════

-- Conversation sessions (lightweight header only)
CREATE TABLE conversations (
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
  -- Store only the "shape" of the conversation, not content, for quick listing
  summary TEXT                             -- ~100 char auto-summary for sidebar
) PARTITION BY RANGE (created_at);

-- Monthly partitions (auto-created by a function or managed manually)
CREATE TABLE conversations_2026_08 PARTITION OF conversations
  FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');

-- Shared system prompts (deduplication table)
-- Same system prompt is stored ONCE, referenced by hash
CREATE TABLE shared_prompts (
  hash TEXT PRIMARY KEY,                   -- SHA-256 of content
  content TEXT NOT NULL,
  token_count INTEGER,
  ref_count INTEGER DEFAULT 1,             -- how many convos use this
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages — the core efficiency table
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,                -- BIGSERIAL not UUID: 8 bytes vs 16 bytes
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  seq SMALLINT NOT NULL,                   -- position in conversation (0,1,2...)
  role SMALLINT NOT NULL,                  -- 0=system, 1=user, 2=assistant, 3=tool
  -- Content storage: ONLY store what changed (delta from previous message is too complex;
  -- instead use column-level compression strategy)
  content_compressed BYTEA,               -- LZ4-compressed content (done app-side)
  content_tokens INTEGER,                  -- token count for this message
  -- For assistant messages only:
  model_used TEXT,
  finish_reason SMALLINT,                  -- 0=stop, 1=length, 2=tool_call, 3=error
  latency_ms SMALLINT,                     -- inference latency
  cost_usd DECIMAL(8,6),                   -- cost for this specific message
  -- Attachments stored separately (never in messages table)
  has_attachment BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Critical indexes for chat history loading
CREATE INDEX idx_messages_conv_seq ON messages(conversation_id, seq ASC);
CREATE INDEX idx_conversations_user_recent ON conversations(user_id, last_message_at DESC)
  WHERE is_archived = FALSE;

-- File attachments — stored in Supabase Storage, only metadata here
CREATE TABLE message_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id BIGINT REFERENCES messages(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,              -- path in Supabase Storage bucket
  original_filename TEXT,
  mime_type TEXT,
  size_bytes INTEGER,
  -- For images: store dimensions to avoid fetch-before-display
  width SMALLINT,
  height SMALLINT,
  -- Thumbnail stored inline as base64 if < 2KB (avoids extra fetch for list views)
  thumbnail_b64 TEXT
);

-- ═══════════════════════════════════
-- RLS POLICIES (security)
-- ═══════════════════════════════════
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own conversations" ON conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own messages" ON messages
  FOR ALL USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );
```

## 3-B: APPLICATION-LEVEL COMPRESSION

**Install required package:**
```bash
npm install lz4js
# or for a pure WASM solution:
npm install @mongodb-js/zstd
```

**Create `lib/compress.ts`:**
```typescript
import lz4 from 'lz4js';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function compressMessage(content: string): Uint8Array {
  const bytes = encoder.encode(content);
  return lz4.compress(bytes);
}

export function decompressMessage(compressed: Uint8Array): string {
  const bytes = lz4.decompress(compressed);
  return decoder.decode(bytes);
}

// For the database, convert to base64 for BYTEA storage
export function compressToBase64(content: string): string {
  return Buffer.from(compressMessage(content)).toString('base64');
}

export function decompressFromBase64(b64: string): string {
  return decompressMessage(Buffer.from(b64, 'base64'));
}
```

**Compression ratio expectation:**
- Typical chat message (200 chars): ~200 bytes → ~90 bytes (55% reduction)
- Long assistant response (2000 chars): ~2000 bytes → ~600 bytes (70% reduction)
- **Effective storage reduction: ~60-70% on messages table**

## 3-C: CHAT HISTORY UI IMPLEMENTATION

**Create `hooks/useChatHistory.ts`:**
```typescript
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export function useChatHistory(conversationId: string | null) {
  
  // Load paginated messages (load 20 at a time, scroll up loads more)
  const loadMessages = useCallback(async (offset = 0, limit = 20) => {
    if (!conversationId) return [];
    
    const { data, error } = await supabase
      .from('messages')
      .select('id, seq, role, content_compressed, model_used, created_at, cost_usd')
      .eq('conversation_id', conversationId)
      .order('seq', { ascending: true })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return data.map(msg => ({
      ...msg,
      content: decompressFromBase64(msg.content_compressed),
      role: ['system', 'user', 'assistant', 'tool'][msg.role]
    }));
  }, [conversationId]);

  // Save a new message
  const saveMessage = useCallback(async (
    role: 'user' | 'assistant',
    content: string,
    metadata?: { model?: string; cost?: number; latency?: number; tokens?: number }
  ) => {
    if (!conversationId) return;
    
    // Get current message count to determine seq
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', conversationId);
    
    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      seq: count ?? 0,
      role: role === 'user' ? 1 : 2,
      content_compressed: compressToBase64(content),
      content_tokens: metadata?.tokens,
      model_used: metadata?.model,
      latency_ms: metadata?.latency,
      cost_usd: metadata?.cost,
    });
    
    if (error) throw error;
    
    // Update conversation summary and stats
    await supabase.from('conversations').update({
      last_message_at: new Date().toISOString(),
      message_count: (count ?? 0) + 1,
      total_tokens: supabase.rpc('increment', { 
        table: 'conversations', 
        field: 'total_tokens', 
        amount: metadata?.tokens ?? 0 
      })
    }).eq('id', conversationId);
  }, [conversationId]);

  // Create new conversation
  const createConversation = useCallback(async (firstMessage: string, model: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    // Auto-generate title from first message (first 60 chars)
    const title = firstMessage.slice(0, 60) + (firstMessage.length > 60 ? '...' : '');
    
    const { data, error } = await supabase.from('conversations').insert({
      user_id: user.id,
      title,
      model,
      summary: firstMessage.slice(0, 100),
    }).select('id').single();
    
    if (error) throw error;
    return data.id;
  }, []);

  return { loadMessages, saveMessage, createConversation };
}
```

**Conversation sidebar component:**
```tsx
// Show user's past conversations in the left sidebar (toggle with the sidebar icon visible in Images 3 & 4)

export function ConversationSidebar({ isOpen }: { isOpen: boolean }) {
  const [conversations, setConversations] = useState([]);
  
  useEffect(() => {
    // Load recent conversations — only title, summary, date (NOT messages)
    supabase
      .from('conversations')
      .select('id, title, summary, model, last_message_at, message_count')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .eq('is_archived', false)
      .order('last_message_at', { ascending: false })
      .limit(50)
      .then(({ data }) => setConversations(data ?? []));
  }, []);
  
  return (
    <aside className={`fixed left-0 top-0 h-full w-72 bg-[#F2F0EB] border-r border-zinc-200 
      transform transition-transform duration-300 z-40
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      
      <div className="p-4 border-b border-zinc-200">
        <button className="w-full bg-black text-white rounded-xl py-2.5 text-sm font-medium">
          + New Chat
        </button>
      </div>
      
      <div className="overflow-y-auto h-[calc(100%-80px)] p-2">
        {conversations.map(conv => (
          <ConversationItem key={conv.id} conversation={conv} />
        ))}
      </div>
    </aside>
  );
}
```

## 3-D: SUPABASE STORAGE — FILE EFFICIENCY

**For any file uploads in chat (images, PDFs, etc.):**

```typescript
// lib/storage.ts

export async function uploadChatFile(
  file: File,
  conversationId: string
): Promise<{ path: string; thumbnail?: string }> {
  
  let uploadFile = file;
  let thumbnail: string | undefined;
  
  // 1. Image optimization before upload
  if (file.type.startsWith('image/')) {
    // Resize to max 1920px on longest side
    uploadFile = await resizeImage(file, 1920);
    // Generate inline thumbnail (200px, base64) — avoids a second fetch
    thumbnail = await generateThumbnail(file, 200);
  }
  
  // 2. Generate a content-addressed path (deduplication)
  const hash = await sha256(await uploadFile.arrayBuffer());
  const ext = file.name.split('.').pop();
  const path = `chat-files/${conversationId}/${hash}.${ext}`;
  
  // 3. Check if file already exists (deduplication)
  const { data: existing } = await supabase.storage
    .from('zero-chat')
    .list(`chat-files/${conversationId}`, { search: hash });
  
  if (!existing?.length) {
    // 4. Upload with proper cache headers
    await supabase.storage.from('zero-chat').upload(path, uploadFile, {
      cacheControl: '31536000',  // 1 year cache (content-addressed, safe)
      upsert: false,
    });
  }
  
  return { path, thumbnail };
}

async function resizeImage(file: File, maxDimension: number): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => resolve(new File([blob!], file.name, { type: 'image/webp' })), 
        'image/webp', 0.85);
    };
    img.src = URL.createObjectURL(file);
  });
}

async function generateThumbnail(file: File, size: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      // Center-crop thumbnail
      const minDim = Math.min(img.width, img.height);
      const sx = (img.width - minDim) / 2;
      const sy = (img.height - minDim) / 2;
      canvas.getContext('2d')!.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
      resolve(canvas.toDataURL('image/webp', 0.7));
    };
    img.src = URL.createObjectURL(file);
  });
}
```

**Supabase Storage bucket setup:**
```sql
-- Create bucket (do this in Supabase dashboard or via API)
-- Name: 'zero-chat'
-- Public: false (authenticated access only)
-- File size limit: 50MB
-- Allowed MIME types: image/*, application/pdf, text/plain, text/csv

-- Storage RLS policy
CREATE POLICY "Users access own files"
ON storage.objects FOR ALL
USING (
  bucket_id = 'zero-chat' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## 3-E: REALTIME SYNC (BONUS — HIGH IMPACT)

Add Supabase Realtime so the chat works across tabs and devices:

```typescript
// In useChatHistory.ts, add this subscription:

useEffect(() => {
  if (!conversationId) return;
  
  const channel = supabase
    .channel(`conv:${conversationId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`
    }, (payload) => {
      // New message arrived (could be from another tab/device)
      const newMsg = {
        ...payload.new,
        content: decompressFromBase64(payload.new.content_compressed),
        role: ['system', 'user', 'assistant', 'tool'][payload.new.role]
      };
      setMessages(prev => [...prev, newMsg]);
    })
    .subscribe();
  
  return () => { supabase.removeChannel(channel); };
}, [conversationId]);
```

---

# ═══════════════════════════════════════
# FINAL CHECKLIST BEFORE DEPLOY
# ═══════════════════════════════════════

After completing all 3 phases, verify each item:

## Navigation
- [ ] Developers section has API Platform, Docs, Research, Changelog, Status
- [ ] All nav links route to correct pages
- [ ] Mobile hamburger nav works with new items

## API Platform Page (`/api`)
- [ ] Free ₹100 credits banner is visible
- [ ] Pricing table shows 20B and 90B with correct rates
- [ ] Token calculator works client-side
- [ ] All 5 offer cards are visible and scrollable on mobile
- [ ] API key generation UI renders (mock if backend not ready)

## Docs Page (`/docs`)
- [ ] Sidebar works on desktop (sticky, scrollable)
- [ ] Accordion works on mobile
- [ ] All 3 language tabs (JS/Python/cURL) work in code block
- [ ] Copy button works on code blocks

## Microphone
- [ ] Mic button shows correct state (idle / listening / error)
- [ ] Permission error shows user-friendly toast
- [ ] MediaRecorder fallback is initialized when Web Speech API fails
- [ ] `/api/transcribe` endpoint is deployed

## Mascot
- [ ] All accessory layers align correctly at all Mascot Studio settings
- [ ] Rain particles don't overflow the container
- [ ] "TEST" badge removed from Mascot Studio pill
- [ ] Time-of-day glow works for M/A/E/N

## Research Page
- [ ] Ornith 9B benchmarks updated with Phase 2-A values
- [ ] Qwen 3.6 27B benchmarks updated with Phase 2-B values
- [ ] All 12 benchmark cards visible
- [ ] Titan 20B card added below Titan 90B card

## Supabase
- [ ] `conversations` table created with partitioning
- [ ] `messages` table created with compression
- [ ] RLS policies active and tested (cannot read other users' data)
- [ ] `api_keys` and `api_usage` tables created
- [ ] `zero-chat` storage bucket created with size limits
- [ ] Realtime subscription doesn't leak on component unmount
- [ ] Conversation sidebar loads < 50ms for 50 conversations
- [ ] Message compression reduces payload by >50%

---

*End of agent prompt. Total changes: ~2,400 lines of new code + schema. Estimated completion: 6-8 hours for a focused agent.*
