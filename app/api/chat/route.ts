import { NextRequest } from 'next/server';
import { buildDynamicSystemPrompt } from '@/lib/skills';
import { serperSearch, formatSearchResults } from '@/lib/search/serper';

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

// Direct call to Zero GPU / Kaggle Cluster
async function callZeroGpu(
    messages: { role: string; content: string }[],
    model: string,
    isUltra: boolean,
    webSearch: boolean = false,
    clientSignal?: AbortSignal,
    maxTokens?: number
): Promise<Response | null> {
    try {
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
                max_tokens: maxTokens || (isUltra ? 128000 : 128000),
                stream: true,
                ...(webSearch ? { extra_body: { web_search: true } } : {}),
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

        const fullMessages = [
            { role: 'system', content: dynamicSystemPrompt },
            ...messages,
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

                    // Connect to Zero GPU cluster
                    const effectiveMaxTokens = max_tokens || maxTokens || (isUltra ? 128000 : 128000);
                    const upstream = await callZeroGpu(searchInjectedMessages, modelId, isUltra, webSearch, req.signal, effectiveMaxTokens);

                    if (!upstream || !upstream.ok) {
                        const errText = upstream ? await upstream.text() : 'No active GPU instance responding';
                        enqueue(JSON.stringify({
                            type: 'error',
                            error: `Zero AI GPU Cluster Error: ${errText || 'Inference cluster is offline or initializing.'}`
                        }));
                        enqueue('[DONE]');
                        clearInterval(heartbeat);
                        controller.close();
                        return;
                    }

                    reader = upstream.body!.getReader();
                    let buffer = '';

                    while (true) {
                        if (req.signal.aborted) {
                            try { await reader.cancel(); } catch { }
                            break;
                        }

                        const { done, value } = await reader.read();
                        if (done) break;

                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split('\n');
                        buffer = lines.pop() ?? '';

                        for (const line of lines) {
                            if (!line.startsWith('data:')) continue;
                            const raw = line.slice(5).trim();

                            if (raw === '[DONE]') {
                                enqueue('[DONE]');
                                clearInterval(heartbeat);
                                controller.close();
                                return;
                            }

                            try {
                                const parsed = JSON.parse(raw);
                                const token = 
                                    parsed.choices?.[0]?.delta?.content ?? 
                                    parsed.choices?.[0]?.delta?.reasoning_content ?? 
                                    parsed.choices?.[0]?.delta?.thought ?? 
                                    parsed.choices?.[0]?.text ?? 
                                    parsed.text ?? 
                                    parsed.content ?? 
                                    '';
                                if (token) {
                                    enqueue(JSON.stringify({ type: 'token', token }));
                                }
                            } catch {
                                // Skip non-JSON chunks
                            }
                        }
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
