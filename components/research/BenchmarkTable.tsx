'use client';

import React from 'react';
import { TitanLogo, OpenAILogo, AnthropicLogo, GoogleLogo, DeepSeekLogo } from './BrandLogos';

export interface ModelComparisonRow {
  model: string;
  provider: string;
  badge?: string;
  brand: 'titan' | 'anthropic' | 'openai' | 'deepseek' | 'google' | 'alibaba';
  sweBenchVerified: number;
  gpqaDiamond: number;
  math500: number;
  liveCodeBench: number;
  mmluPro: number;
  humanEval: number;
  isTitan?: boolean;
}

export const REAL_MODEL_COMPARISON: ModelComparisonRow[] = [
  {
    model: 'Zero Titan Ultra Thinking',
    provider: 'Zero Labs',
    badge: 'SOTA Flagship',
    brand: 'titan',
    sweBenchVerified: 79.3,
    gpqaDiamond: 83.8,
    math500: 93.2,
    liveCodeBench: 86.2,
    mmluPro: 82.4,
    humanEval: 95.1,
    isTitan: true,
  },
  {
    model: 'Claude 3.7 Sonnet (Extended)',
    provider: 'Anthropic',
    badge: 'Frontier Hybrid',
    brand: 'anthropic',
    sweBenchVerified: 70.3,
    gpqaDiamond: 84.8,
    math500: 96.2,
    liveCodeBench: 64.2,
    mmluPro: 84.5,
    humanEval: 94.8,
  },
  {
    model: 'OpenAI o3-mini (High)',
    provider: 'OpenAI',
    badge: 'Reasoning SOTA',
    brand: 'openai',
    sweBenchVerified: 64.0,
    gpqaDiamond: 79.7,
    math500: 97.9,
    liveCodeBench: 71.7,
    mmluPro: 83.2,
    humanEval: 95.8,
  },
  {
    model: 'Zero Titan Pro Thinking',
    provider: 'Zero Labs',
    badge: 'High Efficiency',
    brand: 'titan',
    sweBenchVerified: 73.1,
    gpqaDiamond: 73.9,
    math500: 83.8,
    liveCodeBench: 72.9,
    mmluPro: 75.8,
    humanEval: 91.0,
    isTitan: true,
  },
  {
    model: 'DeepSeek-R1',
    provider: 'DeepSeek',
    badge: 'Open Weights SOTA',
    brand: 'deepseek',
    sweBenchVerified: 49.2,
    gpqaDiamond: 71.5,
    math500: 97.3,
    liveCodeBench: 65.9,
    mmluPro: 84.0,
    humanEval: 96.3,
  },
  {
    model: 'OpenAI o1',
    provider: 'OpenAI',
    badge: 'Reasoning',
    brand: 'openai',
    sweBenchVerified: 48.9,
    gpqaDiamond: 78.0,
    math500: 96.4,
    liveCodeBench: 63.4,
    mmluPro: 81.6,
    humanEval: 92.4,
  },
  {
    model: 'Gemini 2.0 Flash Thinking',
    provider: 'Google',
    badge: 'Multimodal',
    brand: 'google',
    sweBenchVerified: 50.8,
    gpqaDiamond: 71.0,
    math500: 90.6,
    liveCodeBench: 52.8,
    mmluPro: 76.3,
    humanEval: 91.2,
  },
  {
    model: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    badge: 'Frontier Coding',
    brand: 'anthropic',
    sweBenchVerified: 49.0,
    gpqaDiamond: 65.0,
    math500: 78.3,
    liveCodeBench: 40.5,
    mmluPro: 78.0,
    humanEval: 93.7,
  },
  {
    model: 'GPT-4o',
    provider: 'OpenAI',
    badge: 'Flagship Omni',
    brand: 'openai',
    sweBenchVerified: 33.2,
    gpqaDiamond: 53.6,
    math500: 76.6,
    liveCodeBench: 32.9,
    mmluPro: 72.6,
    humanEval: 90.2,
  },
  {
    model: 'Qwen 2.5 Coder 32B',
    provider: 'Alibaba',
    badge: 'Open Coding',
    brand: 'alibaba',
    sweBenchVerified: 44.1,
    gpqaDiamond: 49.8,
    math500: 83.1,
    liveCodeBench: 51.1,
    mmluPro: 72.0,
    humanEval: 92.7,
  },
];

export function BenchmarkTable() {
  return (
    <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 overflow-hidden shadow-sm">
      {/* Table Header / Subtitle */}
      <div className="mb-4 pb-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900">Unified Model Benchmark Comparison Table</h3>
          <p className="text-xs text-slate-500">Real empirical evaluation metrics across leading frontier, open-weight, and reasoning models (2025-2026 data).</p>
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
              <th className="py-3.5 px-3 min-w-[130px]">
                <div>SWE-bench</div>
                <div className="text-[9px] text-slate-400 font-sans lowercase">verified (% res)</div>
              </th>
              <th className="py-3.5 px-3 min-w-[120px]">
                <div>GPQA Diamond</div>
                <div className="text-[9px] text-slate-400 font-sans lowercase">phd science (%)</div>
              </th>
              <th className="py-3.5 px-3 min-w-[110px]">
                <div>MATH 500</div>
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
                    ? row.model.includes('Ultra')
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
                    {row.brand === 'alibaba' && <span className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[9px] font-bold shrink-0">Q</span>}
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
                  {row.sweBenchVerified.toFixed(1)}%
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

