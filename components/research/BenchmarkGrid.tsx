'use client';

import React from 'react';
import { BenchmarkTable } from './BenchmarkTable';
import { Sparkles } from 'lucide-react';

export function BenchmarkGrid() {
  return (
    <section id="benchmarks" className="w-full max-w-7xl mx-auto my-16 px-4">
      {/* Title & Description */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#00C8FF]" />
            <span>Empirical Evaluation Suite</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Industry Benchmark Model Comparison
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Titan Ultra Thinking and Titan Pro Thinking evaluated across industry-standard agentic, reasoning, and multi-modal benchmarks against leading frontier models.
          </p>
        </div>
      </div>

      {/* Main Single Model Comparison Table */}
      <BenchmarkTable />

      {/* Benchmark Summary Bar */}
      <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#0099CC] shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Consistent Frontier Leadership</h4>
            <p className="text-xs text-slate-600">
              Titan models maintain top rank across agentic coding, verified GitHub resolution, and complex mathematical deduction.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 font-mono text-center sm:text-right">
          <div>
            <span className="text-base font-bold text-[#0088CC]">10 / 10</span>
            <span className="text-[10px] text-slate-500 block">Verified Models</span>
          </div>
          <div>
            <span className="text-base font-bold text-[#0088CC]">100%</span>
            <span className="text-[10px] text-slate-500 block">Reproducible</span>
          </div>
        </div>
      </div>
    </section>
  );
}

