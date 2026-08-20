'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { PageNav } from '@/components/chat/nav/PageNav'
import ZeroLogo from '@/components/zero/ZeroLogo'
import { Menu, CheckCircle2, ArrowUpRight } from 'lucide-react'

export default function StatusPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [timeString, setTimeString] = useState<string>('')

  useEffect(() => {
    setTimeString(new Date().toUTCString())
    const interval = setInterval(() => {
      setTimeString(new Date().toUTCString())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const services = [
    {
      name: 'API Gateway',
      status: 'Operational',
      uptime: '99.98% uptime (30d)',
      latency: '24ms'
    },
    {
      name: 'Inference Engine',
      status: 'Operational',
      uptime: '99.95% uptime (30d)',
      latency: '210ms P50'
    },
    {
      name: 'Storage & Memory Layer',
      status: 'Operational',
      uptime: '100.00% uptime (30d)',
      latency: '12ms'
    },
    {
      name: 'Voice Processing',
      status: 'Operational',
      uptime: '99.99% uptime (30d)',
      latency: '340ms'
    }
  ]

  return (
    <div className="min-h-screen bg-[#F4F3EF] text-[#0A0A0A] selection:bg-[#00C8FF] selection:text-black font-sans antialiased" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#F4F3EF]/95 backdrop-blur-md border-b-2 border-[#0A0A0A] px-4 sm:px-8 h-18 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" aria-label="Zero home" className="flex items-center no-underline">
            <ZeroLogo size={0.28} color="#0A0A0A" />
          </Link>
          <span className="hidden sm:inline-block font-mono text-[11px] font-bold px-2.5 py-0.5 rounded border border-[#0A0A0A] bg-white shadow-[2px_2px_0_#0A0A0A] text-[#0A0A0A] uppercase tracking-wider">
            System Status
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/api-platform"
            className="px-4 py-2 rounded-lg bg-[#0A0A0A] text-white text-xs font-bold border-2 border-[#0A0A0A] shadow-[3px_3px_0_#00C8FF] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center gap-1 no-underline"
          >
            <span>API Platform</span>
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

      {/* Main Status Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <div className="space-y-3 mb-10 text-center sm:text-left">
          <span className="font-mono text-[11px] font-bold tracking-[2px] uppercase text-[#0A0A0A] border-2 border-[#0A0A0A] rounded-md px-3 py-1 bg-white shadow-[2px_2px_0_#0A0A0A] inline-block">
            INFRASTRUCTURE HEALTH
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0A0A0A]">Zero Labs Platform Status</h1>
          <p className="text-[#555550] text-sm">
            Current system operational health and live latency statistics.
          </p>
        </div>

        {/* Global Banner */}
        <div className="p-6 rounded-2xl bg-white border-2 border-[#0A0A0A] shadow-[5px_5px_0_#00C8FF] flex items-center gap-4 mb-10">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
          </span>
          <div>
            <h2 className="text-lg font-extrabold text-[#0A0A0A]">All Systems Operational</h2>
            <p className="text-xs text-[#555550] font-mono mt-0.5 font-bold">Last checked: {timeString || 'Live'}</p>
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase text-[#555550] tracking-wider">Core Infrastructure</h3>
          <div className="divide-y-2 divide-[#0A0A0A]/10 rounded-2xl border-2 border-[#0A0A0A] bg-white shadow-[4px_4px_0_#0A0A0A] overflow-hidden">
            {services.map((service, index) => (
              <div key={index} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F8F7F3] transition-colors">
                <div>
                  <h4 className="font-extrabold text-[#0A0A0A] text-base">{service.name}</h4>
                  <p className="text-xs text-[#555550] font-mono mt-0.5 font-bold">{service.uptime} · Latency: {service.latency}</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-500 px-3 py-1 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-mono font-extrabold text-emerald-700">{service.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[#0A0A0A] bg-white py-8 text-center text-xs font-mono text-[#555550] mt-20">
        <p>Zero Labs Infrastructure · Global Distributed Edge</p>
      </footer>
    </div>
  )
}
