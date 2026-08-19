'use client';

import React, { useState } from 'react';
import { BENCHMARKS, BenchmarkItem } from './benchmarkData';
import { TitanLogo, OpenAILogo, AnthropicLogo, GoogleLogo, SarvamLogo, DeepSeekLogo } from './BrandLogos';

export function BenchmarkTable() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered = activeCategory === 'All'
    ? BENCHMARKS
    : BENCHMARKS.filter(b => b.category === activeCategory);

  const categories = ['All', 'Agentic', 'Coding', 'Reasoning', 'Tools & MCP', 'Multimodal'];

  return (
    <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 overflow-hidden shadow-sm">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-2 border-b border-slate-200 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-[#00C8FF] text-black shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {cat} {cat === 'All' ? `(${BENCHMARKS.length})` : ''}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-3 min-w-[200px]">Benchmark</th>
              <th className="py-3.5 px-3">Category</th>
              <th className="py-3.5 px-3 bg-[#00C8FF]/15 text-[#0077AA] font-bold border-x border-[#00C8FF]/30">
                <div className="flex items-center gap-1.5">
                  <TitanLogo className="w-4 h-4 text-[#0088CC]" />
                  <span>Zero Titan Ultra</span>
                </div>
              </th>
              <th className="py-3.5 px-3 bg-amber-100 text-amber-900 font-bold border-r border-amber-300">
                <div className="flex items-center gap-1.5">
                  <TitanLogo className="w-4 h-4 text-amber-700" />
                  <span>Zero Titan Pro</span>
                </div>
              </th>
              <th className="py-3.5 px-3">
                <div className="flex items-center gap-1.5">
                  <OpenAILogo className="w-3.5 h-3.5 text-emerald-600" />
                  <span>GPT-5.6 Luna</span>
                </div>
              </th>
              <th className="py-3.5 px-3">
                <div className="flex items-center gap-1.5">
                  <AnthropicLogo className="w-3.5 h-3.5 text-amber-600" />
                  <span>Claude 4.6</span>
                </div>
              </th>
              <th className="py-3.5 px-3">
                <div className="flex items-center gap-1.5">
                  <GoogleLogo className="w-3.5 h-3.5" />
                  <span>Gemini 3.5</span>
                </div>
              </th>
              <th className="py-3.5 px-3">
                <div className="flex items-center gap-1.5">
                  <SarvamLogo className="w-3.5 h-3.5" />
                  <span>Sarvam 105B</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-mono">
            {filtered.map((item) => {
              const gptScore = item.scores.find(s => s.brand === 'openai')?.score;
              const claudeScore = item.scores.find(s => s.brand === 'anthropic')?.score;
              const geminiScore = item.scores.find(s => s.brand === 'google')?.score;
              const sarvamScore = item.scores.find(s => s.brand === 'sarvam')?.score;

              return (
                <tr key={item.id} className="hover:bg-slate-100/60 transition-colors">
                  <td className="py-3.5 px-3 font-sans font-medium text-slate-900">
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-[11px] font-mono text-slate-500">{item.metric}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 bg-[#00C8FF]/15 text-[#0077AA] font-bold border-x border-[#00C8FF]/20">
                    <span className="text-sm">{item.titanUltraScore.toFixed(1)}%</span>
                  </td>
                  <td className="py-3.5 px-3 bg-amber-100/60 text-amber-900 font-bold border-r border-amber-200">
                    <span className="text-sm">{item.titanProScore.toFixed(1)}%</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-700">
                    {gptScore !== undefined ? `${gptScore.toFixed(1)}%` : '—'}
                  </td>
                  <td className="py-3.5 px-3 text-slate-700">
                    {claudeScore !== undefined ? `${claudeScore.toFixed(1)}%` : '—'}
                  </td>
                  <td className="py-3.5 px-3 text-slate-700">
                    {geminiScore !== undefined ? `${geminiScore.toFixed(1)}%` : '—'}
                  </td>
                  <td className="py-3.5 px-3 text-slate-700">
                    {sarvamScore !== undefined ? `${sarvamScore.toFixed(1)}%` : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
