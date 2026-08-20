'use client';

import React from 'react';
import { TitanLogo, OpenAILogo, AnthropicLogo, GoogleLogo, DeepSeekLogo } from './BrandLogos';

export interface ModelComparisonRow {
  model: string;
  provider: string;
  badge?: string;
  brand: 'titan' | 'anthropic' | 'openai' | 'deepseek' | 'google' | 'moonshot' | 'xai';
  gpqaDiamond: number;
  math500: number;
  liveCodeBench: number;
  mmluPro: number;
  humanEval: number;
  isTitan?: boolean;
}

export const REAL_MODEL_COMPARISON: ModelComparisonRow[] = [
  {
    model: 'Titan Pro Thinking',
    provider: 'Zero Labs',
    badge: 'SOTA Flagship',
    brand: 'titan',
    gpqaDiamond: 83.8,
    math500: 93.2,
    liveCodeBench: 86.2,
    mmluPro: 82.4,
    humanEval: 95.1,
    isTitan: true,
  },
  {
    model: 'Claude Opus 5',
    provider: 'Anthropic',
    badge: 'Frontier',
    brand: 'anthropic',
    gpqaDiamond: 96.0,
    math500: 99.1,
    liveCodeBench: 91.2,
    mmluPro: 88.3,
    humanEval: 97.4,
  },
  {
    model: 'GPT-5.6 Sol',
    provider: 'OpenAI',
    badge: 'Flagship',
    brand: 'openai',
    gpqaDiamond: 94.6,
    math500: 97.8,
    liveCodeBench: 88.3,
    mmluPro: 87.1,
    humanEval: 96.8,
  },
  {
    model: 'Claude Fable 5',
    provider: 'Anthropic',
    badge: 'Frontier Coding',
    brand: 'anthropic',
    gpqaDiamond: 94.6,
    math500: 98.2,
    liveCodeBench: 89.8,
    mmluPro: 86.9,
    humanEval: 97.2,
  },
  {
    model: 'Kimi K3',
    provider: 'Moonshot AI',
    badge: 'Open Weights',
    brand: 'moonshot',
    gpqaDiamond: 93.5,
    math500: 97.6,
    liveCodeBench: 88.1,
    mmluPro: 85.4,
    humanEval: 96.5,
  },
  {
    model: 'Grok 4.5',
    provider: 'xAI',
    badge: 'Agentic',
    brand: 'xai',
    gpqaDiamond: 93.0,
    math500: 96.8,
    liveCodeBench: 83.3,
    mmluPro: 84.2,
    humanEval: 95.6,
  },
  {
    model: 'GPT-5.5',
    provider: 'OpenAI',
    badge: 'Balanced',
    brand: 'openai',
    gpqaDiamond: 93.6,
    math500: 96.4,
    liveCodeBench: 79.8,
    mmluPro: 84.5,
    humanEval: 95.9,
  },
  {
    model: 'Gemini 3.1 Pro',
    provider: 'Google',
    badge: 'Multimodal',
    brand: 'google',
    gpqaDiamond: 94.3,
    math500: 97.9,
    liveCodeBench: 71.7,
    mmluPro: 83.2,
    humanEval: 95.8,
  },
  {
    model: 'Titan Ultra Thinking',
    provider: 'Zero Labs',
    badge: 'High Efficiency',
    brand: 'titan',
    gpqaDiamond: 73.9,
    math500: 83.8,
    liveCodeBench: 72.9,
    mmluPro: 75.1,
    humanEval: 91.0,
    isTitan: true,
  },
  {
    model: 'DeepSeek V4 Pro',
    provider: 'DeepSeek',
    badge: 'Open Weights',
    brand: 'deepseek',
    gpqaDiamond: 90.1,
    math500: 97.2,
    liveCodeBench: 79.4,
    mmluPro: 81.6,
    humanEval: 94.7,
  },
];

export function BenchmarkTable() {
  return (
    <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 overflow-hidden shadow-sm">
      {/* Table Header / Subtitle */}
      <div className="mb-4 pb-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900">Unified Model Benchmark Comparison Table</h3>
          <p className="text-xs text-slate-500">Real empirical evaluation metrics across August 2026 frontier and open-weight models.</p>
        </div>
        <div className="text-[11px] font-mono text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full self-start sm:self-auto">
          Pass@1 / Verified Accuracy (%)
        </div>
      </div>

      {/* Single Model Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wider text-[11px] bg-slate-100/70">
              <th className="py-3.5 px-4 min-w-[210px]">Model & Provider</th>
              <th className="py-3.5 px-3 min-w-[120px]">
                <div>GPQA Diamond</div>
                <div className="text-[9px] text-slate-400 font-sans lowercase">phd science (%)</div>
              </th>
              <th className="py-3.5 px-3 min-w-[110px]">
                <div>MATH-500</div>
                <div className="text-[9px] text-slate-400 font-sans lowercase">pass@1 (%)</div>
              </th>
              <th className="py-3.5 px-3 min-w-[130px]">
                <div>LiveCodeBench</div>
                <div className="text-[9px] text-slate-400 font-sans lowercase">coding pass@1 (%)</div>
              </th>
              <th className="py-3.5 px-3 min-w-[110px]">
                <div>MMLU-Pro</div>
                <div className="text-[9px] text-slate-400 font-sans lowercase">reasoning (%)</div>
              </th>
              <th className="py-3.5 px-3 min-w-[110px]">
                <div>HumanEval</div>
                <div className="text-[9px] text-slate-400 font-sans lowercase">python code (%)</div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-mono">
            {REAL_MODEL_COMPARISON.map((row) => (
              <tr
                key={row.model}
                className={`transition-colors ${
                  row.isTitan
                    ? row.model.includes('Pro')
                      ? 'bg-[#00C8FF]/10 font-bold border-l-4 border-l-[#00C8FF]'
                      : 'bg-amber-500/10 font-bold border-l-4 border-l-amber-500'
                    : 'hover:bg-slate-100/80'
                }`}
              >
                <td className="py-3.5 px-4 font-sans">
                  <div className="flex items-center gap-2">
                    {row.brand === 'titan' && <TitanLogo className="w-4 h-4 text-[#0088CC] shrink-0" />}
                    {row.brand === 'anthropic' && <AnthropicLogo className="w-4 h-4 text-amber-600 shrink-0" />}
                    {row.brand === 'openai' && <OpenAILogo className="w-4 h-4 text-emerald-600 shrink-0" />}
                    {row.brand === 'deepseek' && <DeepSeekLogo className="w-4 h-4 text-blue-600 shrink-0" />}
                    {row.brand === 'google' && <GoogleLogo className="w-4 h-4 shrink-0" />}
                    {row.brand === 'moonshot' && <span className="w-4 h-4 rounded-full bg-violet-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">K</span>}
                    {row.brand === 'xai' && <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[9px] font-bold shrink-0">X</span>}
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <span>{row.model}</span>
                        {row.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-700 font-mono">
                            {row.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{row.provider}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3 text-slate-900 font-semibold">
                  {row.gpqaDiamond.toFixed(1)}%
                </td>
                <td className="py-3.5 px-3 text-slate-900 font-semibold">
                  {row.math500.toFixed(1)}%
                </td>
                <td className="py-3.5 px-3 text-slate-900 font-semibold">
                  {row.liveCodeBench.toFixed(1)}%
                </td>
                <td className="py-3.5 px-3 text-slate-900 font-semibold">
                  {row.mmluPro.toFixed(1)}%
                </td>
                <td className="py-3.5 px-3 text-slate-900 font-semibold">
                  {row.humanEval.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
