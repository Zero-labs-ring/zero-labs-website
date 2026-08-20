'use client';

import React from 'react';
import { TitanLogo, OpenAILogo, AnthropicLogo, GoogleLogo, DeepSeekLogo } from './BrandLogos';

export interface ModelComparisonRow {
  model: string;
  provider: string;
  badge?: string;
  brand: 'titan' | 'anthropic' | 'openai' | 'deepseek' | 'google' | 'moonshot' | 'xai';
  sweBenchVerified: number | null;
  terminalBench: number | null;
  gpqaDiamond: number;
  math500: number;
  liveCodeBench: number;
  mmluPro: number;
  humanEval: number;
  isTitan?: boolean;
}

export const REAL_MODEL_COMPARISON: ModelComparisonRow[] = [
  {
    model: 'Titan Ultra Thinking',
    provider: 'Zero Labs',
    badge: 'Flagship Reasoning',
    brand: 'titan',
    sweBenchVerified: 82.4,
    terminalBench: 61.4,
    gpqaDiamond: 83.8,
    math500: 93.2,
    liveCodeBench: 86.2,
    mmluPro: 82.4,
    humanEval: 95.1,
    isTitan: true,
  },
  {
    model: 'Titan Pro Thinking',
    provider: 'Zero Labs',
    badge: 'Fast Agentic Engine',
    brand: 'titan',
    sweBenchVerified: 73.1,
    terminalBench: 49.8,
    gpqaDiamond: 73.9,
    math500: 83.8,
    liveCodeBench: 72.9,
    mmluPro: 75.1,
    humanEval: 91.0,
    isTitan: true,
  },
  {
    model: 'Claude Opus 4.6',
    provider: 'Anthropic',
    badge: 'Frontier (Feb 2026)',
    brand: 'anthropic',
    sweBenchVerified: 80.84,
    terminalBench: 65.4,
    gpqaDiamond: 91.3,
    math500: 95.0,
    liveCodeBench: 91.2,
    mmluPro: 88.3,
    humanEval: 97.4,
  },
  {
    model: 'Gemini 3.1 Pro',
    provider: 'Google DeepMind',
    badge: 'Frontier (Feb 2026)',
    brand: 'google',
    sweBenchVerified: 80.6,
    terminalBench: 68.5,
    gpqaDiamond: 94.3,
    math500: 97.9,
    liveCodeBench: 89.4,
    mmluPro: 86.8,
    humanEval: 96.2,
  },
  {
    model: 'GPT-5.5',
    provider: 'OpenAI',
    badge: 'Agentic SOTA (Apr 2026)',
    brand: 'openai',
    sweBenchVerified: 58.6,
    terminalBench: 82.7,
    gpqaDiamond: 93.6,
    math500: 96.4,
    liveCodeBench: 88.7,
    mmluPro: 86.2,
    humanEval: 96.5,
  },
  {
    model: 'GPT-5',
    provider: 'OpenAI',
    badge: 'Frontier (Aug 2025)',
    brand: 'openai',
    sweBenchVerified: 74.9,
    terminalBench: 35.2,
    gpqaDiamond: 88.4,
    math500: 94.6,
    liveCodeBench: 84.8,
    mmluPro: 85.1,
    humanEval: 95.8,
  },
  {
    model: 'Claude Sonnet 4.6',
    provider: 'Anthropic',
    badge: 'Production (2026)',
    brand: 'anthropic',
    sweBenchVerified: 74.6,
    terminalBench: 51.0,
    gpqaDiamond: 86.2,
    math500: 94.1,
    liveCodeBench: 86.5,
    mmluPro: 85.6,
    humanEval: 96.0,
  },
  {
    model: 'Claude Sonnet 4.5',
    provider: 'Anthropic',
    badge: 'Frontier (Sep 2025)',
    brand: 'anthropic',
    sweBenchVerified: 77.2,
    terminalBench: null,
    gpqaDiamond: 83.4,
    math500: 87.0,
    liveCodeBench: 82.1,
    mmluPro: 83.9,
    humanEval: 94.2,
  },
  {
    model: 'Gemini 3 Flash',
    provider: 'Google DeepMind',
    badge: 'High Speed (Nov 2025)',
    brand: 'google',
    sweBenchVerified: 78.0,
    terminalBench: null,
    gpqaDiamond: 90.4,
    math500: 91.5,
    liveCodeBench: 78.4,
    mmluPro: 82.0,
    humanEval: 93.8,
  },
  {
    model: 'DeepSeek V4-Pro',
    provider: 'DeepSeek',
    badge: 'Open Weights (Apr 2026)',
    brand: 'deepseek',
    sweBenchVerified: 80.6,
    terminalBench: 67.9,
    gpqaDiamond: 90.1,
    math500: 95.0,
    liveCodeBench: 93.5,
    mmluPro: 87.5,
    humanEval: 95.4,
  },
  {
    model: 'DeepSeek V3.2',
    provider: 'DeepSeek',
    badge: 'Open Weights (Dec 2025)',
    brand: 'deepseek',
    sweBenchVerified: 73.1,
    terminalBench: 46.4,
    gpqaDiamond: 82.4,
    math500: 93.1,
    liveCodeBench: 83.3,
    mmluPro: 85.0,
    humanEval: 93.9,
  },
  {
    model: 'DeepSeek R1',
    provider: 'DeepSeek',
    badge: 'Open Reasoning (Jan 2025)',
    brand: 'deepseek',
    sweBenchVerified: null,
    terminalBench: null,
    gpqaDiamond: 71.5,
    math500: 86.7,
    liveCodeBench: 72.8,
    mmluPro: 84.0,
    humanEval: 91.8,
  },
];

export function BenchmarkTable() {
  return (
    <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 overflow-x-auto shadow-sm">
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
      <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wider text-[11px] bg-slate-100/70">
              <th className="py-3.5 px-4 min-w-[210px]">Model & Provider</th>
              <th className="py-3.5 px-3 min-w-[130px]">
                <div>SWE-bench</div>
                <div className="text-[9px] text-slate-400 font-sans lowercase">verified (%)</div>
              </th>
              <th className="py-3.5 px-3 min-w-[130px]">
                <div>Terminal-Bench</div>
                <div className="text-[9px] text-slate-400 font-sans lowercase">agentic cli (%)</div>
              </th>
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
                className={`transition-colors ${row.isTitan
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
                  {row.sweBenchVerified !== null ? `${row.sweBenchVerified.toFixed(1)}%` : <span className="text-slate-400 font-normal">—</span>}
                </td>
                <td className="py-3.5 px-3 text-slate-900 font-semibold">
                  {row.terminalBench !== null ? `${row.terminalBench.toFixed(1)}%` : <span className="text-slate-400 font-normal">—</span>}
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
  );
}
