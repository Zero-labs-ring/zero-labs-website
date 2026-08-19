'use client';

import React, { useState } from 'react';
import { ModelComparisonHero } from '@/components/research/ModelComparisonHero';
import { BenchmarkGrid } from '@/components/research/BenchmarkGrid';
import { TrainingMethodology } from '@/components/research/TrainingMethodology';
import { TitanLogo } from '@/components/research/BrandLogos';
import { PageNav } from '@/components/chat/nav/PageNav';
import { Menu, ArrowUpRight, Copy, Check, Terminal, Code2, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ResearchPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const bibtex = `@article{zerolabs2026titan,
  title={Titan: Frontier Agentic Reasoning and Step-by-Step Self-Verification via Trajectory Alignment},
  author={Zero Labs Deep Learning Research Group},
  journal={Zero Technical Reports},
  year={2026},
  url={https://zero-tech.in/research}
}`;

  const apiSnippet = `import { ZeroClient } from '@zero-tech/sdk';

// Initialize Zero Client with Titan Ultra Thinking
const zero = new ZeroClient({
  apiKey: process.env.ZERO_API_KEY,
});

const response = await zero.chat.completions.create({
  model: 'titan-ultra', // Titan Ultra Thinking
  messages: [
    { role: 'user', content: 'Debug and refactor this distributed consensus worker.' }
  ],
  thinking: {
    mode: 'step_by_step_verify',
    max_reasoning_tokens: 4096,
  },
  stream: true,
});

for await (const chunk of response) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}`;

  const copyToClipboard = (text: string, isBibtex: boolean) => {
    navigator.clipboard.writeText(text);
    if (isBibtex) {
      setCopiedBibtex(true);
      setTimeout(() => setCopiedBibtex(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#00C8FF] selection:text-black font-sans">
      {/* ── Sticky Top Nav ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png?v=2" alt="Zero AI" className="h-7 object-contain" />
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
              Research
            </span>
          </Link>
        </div>

        {/* Center Desktop Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
          <a href="#models" className="hover:text-slate-900 transition-colors">Models</a>
          <a href="#benchmarks" className="hover:text-slate-900 transition-colors">Benchmarks</a>
          <a href="#methodology" className="hover:text-slate-900 transition-colors">Methodology</a>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="px-4 py-2 rounded-full bg-[#00C8FF] text-black text-xs font-semibold hover:bg-[#38BDF8] transition-all shadow-[0_0_15px_rgba(0,200,255,0.3)] flex items-center gap-1.5"
          >
            <span>Open Chat</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* ── Page Navigation Drawer ─────────────────────────────── */}
      <PageNav open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* ── Main Content Container ─────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Section 1: Hero & Model Comparison */}
        <div id="models">
          <ModelComparisonHero />
        </div>

        {/* Section 2: Industry Benchmark Comparisons */}
        <BenchmarkGrid />

        {/* Section 3: Training Methodology & Architecture */}
        <div id="methodology" className="my-16">
          <TrainingMethodology />
        </div>

        {/* Section 5: BibTeX Citation */}
        <div className="my-16 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#00C8FF]" />
              <h4 className="text-base font-bold text-slate-900">Cite Technical Report</h4>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(bibtex, true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200/60 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-mono transition-colors"
            >
              {copiedBibtex ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedBibtex ? 'Copied to Clipboard' : 'Copy BibTeX'}</span>
            </button>
          </div>
          <pre className="p-4 bg-slate-900 text-slate-100 border border-slate-800 rounded-xl text-xs font-mono overflow-x-auto">
            <code>{bibtex}</code>
          </pre>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png?v=2" alt="Zero AI" className="h-6 object-contain" />
            <span className="text-xs text-slate-500">Zero Labs Deep Learning Research</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-600">
            <Link href="/" className="hover:text-slate-900 transition-colors">Zero Ring</Link>
            <Link href="/chat" className="hover:text-slate-900 transition-colors">Zero AI Chat</Link>
            <Link href="/cowork" className="hover:text-slate-900 transition-colors">Cowork</Link>
            <Link href="/research" className="hover:text-slate-900 transition-colors text-[#00C8FF] font-semibold">Research</Link>
          </div>
          <span className="text-xs font-mono text-slate-400">© 2026 Zero Tech Inc.</span>
        </div>
      </footer>
    </div>
  );
}
