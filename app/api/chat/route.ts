import { NextRequest } from 'next/server';
import { buildDynamicSystemPrompt } from '@/lib/skills';
import { serperSearch, formatSearchResults } from '@/lib/search/serper';
import { isResponseTruncated } from '@/lib/ornith/artifactParser';

const ZERO_GPU_BASE = process.env.INTERNAL_BACKEND_URL || process.env.ZERO_GPU_API_BASE || '';
const ZERO_GPU_API_KEY = process.env.INTERNAL_SECRET || process.env.ZERO_GPU_API_KEY || '';

// Enable maximum allowed execution duration for Vercel Serverless Function (60s Hobby / up to 300s Pro)
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

// Fast pre-defined greetings dictionary (Instant 0ms TTFT & credit saver)
const GREETING_RESPONSES: Record<string, string> = {
    'hi': "Hello! I'm Zero, your high-performance AI assistant. How can I help you today?",
    'hello': "Hello! I'm Zero, your AI assistant. Ready to help with code, research, math, or anything else you're working on.",
    'hey': "Hey there! How can I assist with your projects or questions today?",
    'heyy': "Hey! How can I help you today?",
    'hi zero': "Hello! How can I assist you today?",
    'hello zero': "Hello! Ready to help you build and explore. What's on your mind?",
    'good morning': "Good morning! Hope you have a wonderful and productive day. What would you like to work on today?",
    'good afternoon': "Good afternoon! How can I assist you with your tasks, code, or research today?",
    'good evening': "Good evening! Ready to help you wrap up your day or work on your next project. What's on your mind?",
    'good night': "Good night! Have a great rest, and feel free to reach out whenever you're ready to continue.",
    'who are you': "I am Zero AI, an intelligent coding and research assistant powered by Zero Labs. I specialize in fast software development, sandbox code execution, real-time web search, and artifact generation.",
    'what is your name': "I am Zero, an advanced AI companion built to assist with programming, research, creative design, and technical problem-solving.",
    'how are you': "I'm running at full speed and ready to help! What are we working on today?",
    'what can you do': "I can write and execute code in 15+ languages, design interactive UI applications and games, search the live web for real-time data, author technical documentation, and answer questions across any domain. How can I help you right now?",
    'help': "I can help you with:\n1. **Coding & Debugging** — Write, optimize, and execute runnable code in Python, C++, JS, Rust, Go, and more.\n2. **UI & Frontend Design** — Build interactive single-file React and HTML apps.\n3. **Live Web Search** — Retrieve real-time information with citations.\n4. **Research & Deep Reasoning** — Step-by-step problem solving.\n\nWhat would you like to explore?",
};

function getPredefinedGreeting(text: string): string | null {
    const cleaned = text.toLowerCase().trim().replace(/[!?.,;:]+$/, '').trim();
    if (GREETING_RESPONSES[cleaned]) {
        return GREETING_RESPONSES[cleaned];
    }
    return null;
}

// Model ID normalizer
function normalizeModelId(requestedModel?: string, webSearch?: boolean): { base: string; isUltra: boolean } {
    const raw = (requestedModel || 'titan-pro').toLowerCase().trim();
    const isUltra = raw.includes('ultra');
    let base = isUltra ? 'titan-ultra' : 'titan-pro';

    if (webSearch) {
        base = isUltra ? 'search-ultra' : 'search-pro';
    }

    return { base, isUltra };
}

// Calculate dynamic max_tokens based on intent, prompt complexity, model tier, and explicit caller request (up to 128K / 131,072)
function calculateDynamicMaxTokens(
    requestedMaxTokens?: number,
    isUltra: boolean = false,
    promptText: string = ''
): number {
    if (typeof requestedMaxTokens === 'number' && requestedMaxTokens > 0) {
        return Math.min(Math.max(requestedMaxTokens, 512), 131072);
    }

    return 131072;
}

// Intelligently prune and compress older conversation history so input prompt stays compact
// leaving maximum available headroom for the model's 128K output generation.
function optimizeConversationHistory(
    messages: { role: string; content: string }[]
): { role: string; content: string }[] {
    if (messages.length <= 6) {
        return messages;
    }

    // Keep the initial user message for conversation anchor/intent
    const firstUserMsgIndex = messages.findIndex(m => m.role === 'user');
    const rootUserMsg = firstUserMsgIndex !== -1 ? messages[firstUserMsgIndex] : null;

    // Recent 12 messages kept with highest fidelity
    const recentCount = Math.min(messages.length, 12);
    const recentMessages = messages.slice(messages.length - recentCount);

    // Older intermediate messages: summarize/prune large past code blocks
    const intermediate = messages.slice(0, messages.length - recentCount);
    const compressedIntermediate = intermediate.map(msg => {
        if (msg.role === 'assistant' && msg.content && msg.content.length > 600) {
            const pruned = msg.content.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
                if (code.length > 300) {
                    const lines = code.trim().split('\n');
                    const snippet = lines.slice(0, 4).join('\n');
                    return `\`\`\`${lang}\n${snippet}\n// ... [Full implementation provided in previous turn - ${lines.length} lines] ...\n\`\`\``;
                }
                return match;
            });
            return { role: msg.role, content: pruned };
        }
        return msg;
    });

    const combined: { role: string; content: string }[] = [];
    if (rootUserMsg && !recentMessages.includes(rootUserMsg)) {
        combined.push(rootUserMsg);
    }
    for (const msg of compressedIntermediate) {
        if (msg !== rootUserMsg && !recentMessages.includes(msg)) {
            combined.push(msg);
        }
    }
    for (const msg of recentMessages) {
        combined.push(msg);
    }

    return combined;
}

// Direct call to Zero GPU / Kaggle Cluster with 128K token ceiling
async function callZeroGpu(
    messages: { role: string; content: string }[],
    model: string,
    isUltra: boolean,
    webSearch: boolean = false,
    clientSignal?: AbortSignal,
    maxTokens?: number
): Promise<Response | null> {
    try {
        const effectiveTokens = maxTokens || 131072;
        const res = await fetch(`${ZERO_GPU_BASE}/chat/completions`, {
            method: 'POST',
            headers: {
                'Accept': 'text/event-stream',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ZERO_GPU_API_KEY}`,
            },
            body: JSON.stringify({
                model,
                messages,
                temperature: isUltra ? 0.6 : 0.7,
                max_tokens: effectiveTokens,
                max_new_tokens: effectiveTokens,
                stream: true,
                extra_body: {
                    max_tokens: effectiveTokens,
                    max_new_tokens: effectiveTokens,
                    ...(webSearch ? { web_search: true } : {})
                },
            }),
            signal: clientSignal,
        });

        if (res.ok) return res;
        return null;
    } catch (err) {
        console.error('Zero GPU Connection error:', err);
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages, model: requestedModel, webSearch = false, memory = [], customInstructions = '', max_tokens, maxTokens } = body as {
            messages: { role: string; content: string }[];
            model?: string;
            webSearch?: boolean;
            memory?: string[];
            customInstructions?: string;
            max_tokens?: number;
            maxTokens?: number;
        };

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return new Response('Invalid request: messages array is required', { status: 400 });
        }

        const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';
        const { base: modelId, isUltra } = normalizeModelId(requestedModel, webSearch);
        const resolvedModelName = isUltra ? 'Titan Ultra' : 'Titan Pro';

        // ── 1. FAST PREDEFINED GREETINGS CACHE ────────────────────────
        // For simple greetings without web search, return instant fast stream
        const instantGreeting = !webSearch && messages.length <= 2 ? getPredefinedGreeting(lastUserMsg) : null;
        if (instantGreeting) {
            const encoder = new TextEncoder();
            const words = instantGreeting.split(' ');
            const stream = new ReadableStream({
                async start(controller) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'model_info', model: resolvedModelName })}\n\n`));

                    for (let i = 0; i < words.length; i++) {
                        const token = (i === 0 ? '' : ' ') + words[i];
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'token', token })}\n\n`));
                        // Micro-delay for natural typing feel (15ms)
                        await new Promise(r => setTimeout(r, 15));
                    }
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                }
            });

            return new Response(stream, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache, no-transform',
                    'Connection': 'keep-alive',
                },
            });
        }

        // ── 2. DYNAMIC SYSTEM PROMPT & LIVE WEB SEARCH ────────────────
        let dynamicSystemPrompt = buildDynamicSystemPrompt(messages);

        if (Array.isArray(memory) && memory.length > 0) {
            dynamicSystemPrompt += `\n\n[Persistent User Memory & Learned Preferences]:\n${memory.map(m => `- ${m}`).join('\n')}`;
        }

        if (customInstructions && typeof customInstructions === 'string' && customInstructions.trim()) {
            dynamicSystemPrompt += `\n\n[User Custom Instructions]:\n${customInstructions.trim()}`;
        }

        // Optimize conversation history to prevent prompt context explosion
        const optimizedHistory = optimizeConversationHistory(messages);

        const fullMessages = [
            { role: 'system', content: dynamicSystemPrompt },
            ...optimizedHistory,
        ];

        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        // Return ReadableStream immediately with keep-alive heartbeats to prevent Vercel gateway timeouts
        const stream = new ReadableStream({
            async start(controller) {
                const enqueue = (data: string) => {
                    try {
                        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                    } catch { }
                };

                // 1. Immediately flush initial model_info frame so Vercel & client receive instant HTTP 200 OK
                enqueue(JSON.stringify({ type: 'model_info', model: resolvedModelName }));

                // 2. Start a keep-alive ping interval (every 8s) to maintain active socket state while GPU thinks
                const heartbeat = setInterval(() => {
                    enqueue(JSON.stringify({ type: 'ping' }));
                }, 8000);

                let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
                let searchInjectedMessages = [...fullMessages];
                let preloadedSearchResults = '';

                try {
                    // Pre-fetch live web search if requested
                    if (webSearch && !modelId.startsWith('search-')) {
                        if (lastUserMsg) {
                            try {
                                const searchData = await serperSearch(lastUserMsg, 5);
                                if (searchData.length > 0) {
                                    preloadedSearchResults = formatSearchResults(searchData);
                                    searchInjectedMessages = [
                                        ...fullMessages,
                                        {
                                            role: 'system',
                                            content: `[Real-Time Live Web Search Context]:\n${preloadedSearchResults}\n\nUse this real-time factual data to answer accurately with citations.`
                                        }
                                    ];
                                    enqueue(JSON.stringify({ type: 'tool_start', query: 'Web Search' }));
                                    enqueue(JSON.stringify({ type: 'tool_result', results: preloadedSearchResults }));
                                }
                            } catch (e) {
                                console.warn('Search pre-fetch error:', e);
                            }
                        }
                    }

                    // Connect to Zero GPU cluster with optimal dynamic max_tokens (128K) and transparent auto-continuation loop
                    let currentMessages = [...searchInjectedMessages];
                    let totalAccumulated = '';
                    let turn = 0;
                    const maxAutoTurns = 5;

                    while (turn < maxAutoTurns && !req.signal.aborted) {
                        turn++;
                        const effectiveMaxTokens = calculateDynamicMaxTokens(max_tokens || maxTokens, isUltra, lastUserMsg);
                        const upstream = await callZeroGpu(currentMessages, modelId, isUltra, webSearch, req.signal, effectiveMaxTokens);

                        if (!upstream || !upstream.ok) {
                            if (turn === 1) {
                                const errText = upstream ? await upstream.text() : 'No active GPU instance responding';
                                enqueue(JSON.stringify({
                                    type: 'error',
                                    error: `Zero AI GPU Cluster Error: ${errText || 'Inference cluster is offline or initializing.'}`
                                }));
                            }
                            break;
                        }

                        reader = upstream.body!.getReader();
                        let buffer = '';
                        let turnAccumulated = '';
                        let streamFinished = false;

                        // Helper: extract all complete JSON objects from a buffer that may have
                        // split data: lines across TCP packets (GPU sends fragmented chunks).
                        // Returns { tokens: string[], remaining: string, done: boolean }
                        const extractTokens = (buf: string): { tokens: string[]; remaining: string; done: boolean } => {
                            const tokens: string[] = [];
                            let done = false;
                            let i = 0;

                            while (i < buf.length) {
                                // Find next 'data:' prefix
                                const dataIdx = buf.indexOf('data:', i);
                                if (dataIdx === -1) break;

                                // Check for [DONE]
                                const afterData = buf.slice(dataIdx + 5).trimStart();
                                if (afterData.startsWith('[DONE]')) {
                                    done = true;
                                    i = dataIdx + 5 + afterData.indexOf('[DONE]') + 6;
                                    break;
                                }

                                // Find the start of the JSON object
                                const braceStart = buf.indexOf('{', dataIdx + 5);
                                if (braceStart === -1) break;

                                // Walk forward counting braces to find the end of the JSON object
                                let depth = 0;
                                let inString = false;
                                let escape = false;
                                let j = braceStart;

                                for (; j < buf.length; j++) {
                                    const ch = buf[j];
                                    if (escape) { escape = false; continue; }
                                    if (ch === '\\' && inString) { escape = true; continue; }
                                    if (ch === '"') { inString = !inString; continue; }
                                    if (inString) continue;
                                    if (ch === '{') depth++;
                                    else if (ch === '}') {
                                        depth--;
                                        if (depth === 0) { j++; break; }
                                    }
                                }

                                if (depth !== 0) {
                                    // Incomplete JSON — need more data, stop here
                                    break;
                                }

                                const jsonStr = buf.slice(braceStart, j);
                                i = j;

                                try {
                                    const parsed = JSON.parse(jsonStr);
                                    const token =
                                        parsed.choices?.[0]?.delta?.content ??
                                        parsed.choices?.[0]?.delta?.text ??
                                        parsed.text ??
                                        parsed.content ??
                                        '';
                                    if (token) tokens.push(token);
                                } catch { }
                            }

                            return { tokens, remaining: buf.slice(i), done };
                        };

                        while (!streamFinished) {
                            if (req.signal.aborted) {
                                try { await reader.cancel(); } catch { }
                                break;
                            }

                            const { done, value } = await reader.read();
                            if (done) {
                                // Drain remaining buffer
                                if (buffer.trim()) {
                                    const { tokens, done: isDone } = extractTokens(buffer);
                                    for (const token of tokens) {
                                        turnAccumulated += token;
                                        enqueue(JSON.stringify({ type: 'token', token }));
                                    }
                                    if (isDone) streamFinished = true;
                                }
                                break;
                            }

                            buffer += decoder.decode(value, { stream: true });
                            const { tokens, remaining, done: isDone } = extractTokens(buffer);
                            buffer = remaining;

                            for (const token of tokens) {
                                turnAccumulated += token;
                                enqueue(JSON.stringify({ type: 'token', token }));
                            }

                            if (isDone) streamFinished = true;
                        }

                        totalAccumulated += turnAccumulated;

                        // Check if the response was cut off midway and needs auto-continuation
                        const truncated = isResponseTruncated(totalAccumulated);
                        if (!truncated || turn >= maxAutoTurns || req.signal.aborted || !turnAccumulated.trim()) {
                            break;
                        }

                        // Seamless auto-continuation prompt for next chunk
                        const lastLines = totalAccumulated.trim().split('\n').slice(-4).join('\n');
                        currentMessages = [
                            ...searchInjectedMessages,
                            { role: 'assistant', content: totalAccumulated },
                            { role: 'user', content: `Continue writing the exact code directly from this cutoff point:\n\`\`\`\n${lastLines}\n\`\`\`\nDo not repeat code. Complete all remaining functions and output the rest of the code until completely finished.` }
                        ];
                    }
                } catch (err: any) {
                    if (!req.signal.aborted) {
                        console.error('Stream processing error:', err);
                    }
                } finally {
                    clearInterval(heartbeat);
                    if (reader) {
                        try { await reader.cancel(); } catch { }
                    }
                    try {
                        enqueue('[DONE]');
                        controller.close();
                    } catch { }
                }
            },
            async cancel(reason) {
                try { } catch { }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
            },
        });
    } catch (err: any) {
        console.error('Chat API Error:', err);
        return new Response(`Chat API Server Error: ${err.message}`, { status: 500 });
    }
}
