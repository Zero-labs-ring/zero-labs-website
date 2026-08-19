'use client';

import React, { useState } from 'react';
import { BENCHMARKS } from './benchmarkData';
import { BenchmarkCard } from './BenchmarkCard';
import { BenchmarkTable } from './BenchmarkTable';
import { LayoutGrid, Table, Search, Sparkles, Filter } from 'lucide-react';

export function BenchmarkGrid() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Agentic', 'Coding', 'Reasoning', 'Tools & MCP', 'Multimodal'];

  const filteredBenchmarks = BENCHMARKS.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            Industry Benchmark Comparison
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Titan Pro Thinking and Titan Ultra Thinking evaluated across 12 industry-standard agentic, reasoning, and multi-modal benchmarks against 2026 leading frontier systems.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 p-1 rounded-xl self-start md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'grid'
                ? 'bg-[#00C8FF] text-black shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Card Grid</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-[#00C8FF] text-black shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Data Table</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white font-bold shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search benchmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#00C8FF] transition-all"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBenchmarks.map((b, idx) => (
            <BenchmarkCard key={b.id} benchmark={b} index={idx} />
          ))}
        </div>
      ) : (
        <BenchmarkTable />
      )}

      {/* Benchmark Summary Bar */}
      <div className="mt-12 p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
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
            <span className="text-base font-bold text-[#0088CC]">12 / 12</span>
            <span className="text-[10px] text-slate-500 block">Verified Tests</span>
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
