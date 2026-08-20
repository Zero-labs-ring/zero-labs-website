'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { PageNav } from '@/components/chat/nav/PageNav'
import ZeroLogo from '@/components/zero/ZeroLogo'
import { 
  Menu, 
  ArrowUpRight, 
  Copy, 
  Check, 
  Terminal, 
  Code2, 
  BookOpen, 
  ShieldCheck, 
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react'

export default function DocsPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'js' | 'python' | 'curl'>('js')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const jsQuickstart = `import OpenAI from 'openai';

// Initialize OpenAI client with Zero Labs API Gateway
const client = new OpenAI({
  baseURL: 'https://api.zerolabs.live/v1',
  apiKey: process.env.ZERO_API_KEY,
});

async function main() {
  const stream = await client.chat.completions.create({
    model: 'titan-pro', // or 'titan-ultra'
    messages: [
      { role: 'user', content: 'Explain neural networks in 3 bullet points.' }
    ],
    stream: true,
  });

  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '');
  }
}

main();`

  const pythonQuickstart = `from openai import OpenAI
import os

# Point standard OpenAI client to Zero Labs API Gateway
client = OpenAI(
    base_url="https://api.zerolabs.live/v1",
    api_key=os.environ.get("ZERO_API_KEY")
)

# Stream completions directly from Zero Titan models
response = client.chat.completions.create(
    model="titan-pro", # or "titan-ultra"
    messages=[
        {"role": "user", "content": "Explain neural networks in 3 bullet points."}
    ],
    stream=True
)

for chunk in response:
    print(chunk.choices[0].delta.content or "", end="", flush=True)`

  const curlQuickstart = `curl https://api.zerolabs.live/v1/chat/completions \\
  -H "Authorization: Bearer $ZERO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "titan-pro",
    "messages": [{"role": "user", "content": "Explain neural networks simply."}],
    "stream": false
  }'`

  return (
    <div className="min-h-screen bg-[#F4F3EF] text-[#0A0A0A] selection:bg-[#00C8FF] selection:text-black font-sans antialiased" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-50 bg-[#F4F3EF]/95 backdrop-blur-md border-b-2 border-[#0A0A0A] px-4 sm:px-8 h-18 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" aria-label="Zero home" className="flex items-center no-underline">
            <ZeroLogo size={0.28} color="#0A0A0A" />
          </Link>
          <span className="hidden sm:inline-block font-mono text-[11px] font-bold px-2.5 py-0.5 rounded border border-[#0A0A0A] bg-white shadow-[2px_2px_0_#0A0A0A] text-[#0A0A0A] uppercase tracking-wider">
            Documentation
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/api-platform"
            className="px-4 py-2 rounded-lg bg-white hover:bg-[#F8F7F3] text-[#0A0A0A] text-xs font-bold border-2 border-[#0A0A0A] shadow-[2px_2px_0_#0A0A0A] transition-all no-underline"
          >
            API Platform
          </Link>
          <Link
            href="/chat"
            className="px-4 py-2 rounded-lg bg-[#0A0A0A] text-white text-xs font-bold border-2 border-[#0A0A0A] shadow-[3px_3px_0_#00C8FF] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center gap-1 no-underline"
          >
            <span>Open Chat</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#00C8FF]" />
          </Link>

          <button
            onClick={() => setMenuOpen(true)}
            className="p-1.5 bg-transparent border-none cursor-pointer text-[#0A0A0A]"
            aria-label="Open Menu"
          >
            <Menu className="w-7 h-7" strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {/* Drawer */}
      <PageNav open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* ── Main Docs Layout with Sticky Sidebar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col md:flex-row gap-10">
        {/* Left Sticky Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 space-y-6 text-sm p-5 bg-white border-2 border-[#0A0A0A] rounded-2xl shadow-[4px_4px_0_#0A0A0A]">
            <div>
              <p className="font-mono text-xs font-extrabold text-[#00C8FF] uppercase tracking-wider mb-2">Getting Started</p>
              <ul className="space-y-1.5 text-[#555550] font-bold text-xs">
                <li><a href="#quickstart" className="hover:text-[#0A0A0A] transition-colors block py-0.5 no-underline">Quick Start</a></li>
                <li><a href="#authentication" className="hover:text-[#0A0A0A] transition-colors block py-0.5 no-underline">Authentication</a></li>
                <li><a href="#chat-completions" className="hover:text-[#0A0A0A] transition-colors block py-0.5 no-underline">Your First API Call</a></li>
              </ul>
            </div>

            <div className="pt-4 border-t border-[#0A0A0A]/10">
              <p className="font-mono text-xs font-extrabold text-[#00C8FF] uppercase tracking-wider mb-2">API Reference</p>
              <ul className="space-y-1.5 text-[#555550] font-bold text-xs">
                <li><a href="#chat-completions" className="hover:text-[#0A0A0A] transition-colors block py-0.5 no-underline">Chat Completions</a></li>
                <li><a href="#models" className="hover:text-[#0A0A0A] transition-colors block py-0.5 no-underline">Titan Models</a></li>
              </ul>
            </div>

            <div className="pt-4 border-t border-[#0A0A0A]/10">
              <p className="font-mono text-xs font-extrabold text-[#00C8FF] uppercase tracking-wider mb-2">Guides & SDKs</p>
              <ul className="space-y-1.5 text-[#555550] font-bold text-xs">
                <li><a href="#quickstart" className="hover:text-[#0A0A0A] transition-colors block py-0.5 no-underline">TypeScript / JS</a></li>
                <li><a href="#quickstart" className="hover:text-[#0A0A0A] transition-colors block py-0.5 no-underline">Python SDK</a></li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="flex-1 min-w-0 space-y-12">
          {/* Section: Quick Start */}
          <section id="quickstart" className="space-y-5">
            <div className="space-y-2">
              <span className="font-mono text-[11px] font-bold tracking-[2px] uppercase text-[#0A0A0A] border-2 border-[#0A0A0A] rounded-md px-3 py-1 bg-white shadow-[2px_2px_0_#0A0A0A] inline-block">
                DEVELOPER SDK
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0A0A0A]">Zero Labs API Quick Start</h1>
              <p className="text-[#555550] text-sm sm:text-base leading-relaxed max-w-2xl">
                Start generating real-time completions with Zero Titan models in seconds using JavaScript, Python, or cURL.
              </p>
            </div>

            {/* Language Switcher Tabs */}
            <div className="rounded-2xl border-2 border-[#0A0A0A] bg-[#0A0A0A] overflow-hidden shadow-[5px_5px_0_#00C8FF]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 bg-[#161616]">
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <button
                    onClick={() => setActiveTab('js')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      activeTab === 'js' ? 'bg-[#00C8FF] text-black shadow-xs' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    JavaScript / TS
                  </button>
                  <button
                    onClick={() => setActiveTab('python')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      activeTab === 'python' ? 'bg-[#00C8FF] text-black shadow-xs' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Python
                  </button>
                  <button
                    onClick={() => setActiveTab('curl')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      activeTab === 'curl' ? 'bg-[#00C8FF] text-black shadow-xs' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    cURL
                  </button>
                </div>

                <button
                  onClick={() => handleCopy(
                    activeTab === 'js' ? jsQuickstart : activeTab === 'python' ? pythonQuickstart : curlQuickstart,
                    'quickstart'
                  )}
                  className="flex items-center gap-1 text-xs font-mono text-zinc-300 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded transition-colors cursor-pointer"
                >
                  {copiedCode === 'quickstart' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'quickstart' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre className="p-4 sm:p-6 font-mono text-xs sm:text-sm text-[#00C8FF] bg-[#0A0A0A] overflow-x-auto leading-relaxed">
                <code>
                  {activeTab === 'js' && jsQuickstart}
                  {activeTab === 'python' && pythonQuickstart}
                  {activeTab === 'curl' && curlQuickstart}
                </code>
              </pre>
            </div>
          </section>

          {/* Section: Authentication */}
          <section id="authentication" className="space-y-4 pt-8 border-t-2 border-[#0A0A0A]/10">
            <h2 className="text-2xl font-extrabold text-[#0A0A0A]">Authentication</h2>
            <p className="text-[#555550] text-sm leading-relaxed">
              The Zero Labs API uses API keys for request authentication. Provide your secret key in the <code className="text-[#0A0A0A] font-mono text-xs font-bold bg-white border border-[#0A0A0A] px-2 py-0.5 rounded shadow-[1px_1px_0_#0A0A0A]">Authorization</code> HTTP header.
            </p>

            <div className="p-4 rounded-xl bg-white border-2 border-[#0A0A0A] shadow-[3px_3px_0_#0A0A0A] font-mono text-xs text-[#0A0A0A] font-bold">
              Authorization: Bearer YOUR_API_KEY
            </div>
          </section>

          {/* Section: API Reference - Chat Completions */}
          <section id="chat-completions" className="space-y-6 pt-8 border-t-2 border-[#0A0A0A]/10">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#0A0A0A]">Chat Completions</h2>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-[#00C8FF] text-black font-extrabold border border-[#0A0A0A]">POST</span>
                <span className="text-[#0A0A0A] font-bold">https://api.zerolabs.live/v1/chat/completions</span>
              </div>
            </div>

            <p className="text-[#555550] text-sm leading-relaxed">
              Creates a model response for the given conversation messages. Supports both synchronous output and Server-Sent Event (SSE) streaming.
            </p>

            {/* Parameters Table */}
            <div className="rounded-2xl border-2 border-[#0A0A0A] bg-white shadow-[4px_4px_0_#0A0A0A] overflow-x-auto">
              <table className="w-full text-left font-sans text-xs sm:text-sm divide-y-2 divide-[#0A0A0A]/10">
                <thead className="bg-[#F8F7F3] font-mono text-[#0A0A0A] uppercase text-[11px] font-bold">
                  <tr>
                    <th className="p-3.5">Parameter</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Required</th>
                    <th className="p-3.5">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0A0A0A]/10 font-mono text-xs text-[#0A0A0A]">
                  <tr>
                    <td className="p-3.5 font-bold text-[#0A0A0A]">model</td>
                    <td className="p-3.5 text-[#00C8FF] font-bold">string</td>
                    <td className="p-3.5 text-rose-600 font-bold">Yes</td>
                    <td className="p-3.5 font-sans">"titan-pro" or "titan-ultra"</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-[#0A0A0A]">messages</td>
                    <td className="p-3.5 text-[#00C8FF] font-bold">array</td>
                    <td className="p-3.5 text-rose-600 font-bold">Yes</td>
                    <td className="p-3.5 font-sans">Array of message objects with role and content</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-[#0A0A0A]">stream</td>
                    <td className="p-3.5 text-[#00C8FF] font-bold">boolean</td>
                    <td className="p-3.5 text-[#555550]">Optional</td>
                    <td className="p-3.5 font-sans">If set, partial message deltas will be sent as SSE chunks. Default: false</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-[#0A0A0A]">temperature</td>
                    <td className="p-3.5 text-[#00C8FF] font-bold">number</td>
                    <td className="p-3.5 text-[#555550]">Optional</td>
                    <td className="p-3.5 font-sans">Sampling temperature between 0.0 and 2.0. Default: 1.0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: Models */}
          <section id="models" className="space-y-6 pt-8 border-t-2 border-[#0A0A0A]/10">
            <h2 className="text-2xl font-extrabold text-[#0A0A0A]">Available Models</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="p-6 rounded-2xl bg-white border-2 border-[#0A0A0A] shadow-[4px_4px_0_#00C8FF] space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-[#0A0A0A] text-lg">Zero Titan 20B (Flash)</h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E8F8FF] text-[#00C8FF] border border-[#00C8FF]">FAST</span>
                </div>
                <p className="text-xs text-[#555550]">Low-latency agentic inference, RAG embeddings, and rapid conversational UI.</p>
                <div className="font-mono text-xs text-[#0A0A0A] font-bold pt-2 space-y-1">
                  <p>Context: 118,000 tokens</p>
                  <p>Latency: &lt;500ms P50</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border-2 border-[#0A0A0A] shadow-[4px_4px_0_#0A0A0A] space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-[#0A0A0A] text-lg">Zero Titan 90B (Pro)</h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F3E8FF] text-[#9333EA] border border-[#9333EA]">PRO</span>
                </div>
                <p className="text-xs text-[#555550]">Frontier multi-step reasoning, mathematical proof, code synthesis, and deep logic.</p>
                <div className="font-mono text-xs text-[#0A0A0A] font-bold pt-2 space-y-1">
                  <p>Context: 118,000 tokens</p>
                  <p>Self-Verification CoT Engine</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-[#0A0A0A] bg-white py-8 text-center text-xs font-mono text-[#555550] mt-16">
        <p>Zero Labs Documentation · 2026</p>
      </footer>
    </div>
  )
}
