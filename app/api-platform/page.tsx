'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PageNav } from '@/components/chat/nav/PageNav'
import ZeroLogo from '@/components/zero/ZeroLogo'
import { AuthModal, AuthModalView } from '@/components/auth/AuthModal'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { 
  Menu, 
  ArrowUpRight, 
  Copy, 
  Check, 
  Key, 
  User, 
  LogOut,
  Zap
} from 'lucide-react'

function ApiPlatformContent() {
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authView, setAuthView] = useState<AuthModalView>('login')
  const [copiedKey, setCopiedKey] = useState(false)
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [keyName, setKeyName] = useState('Default Key')

  const handleGenerateKey = () => {
    if (!user) {
      setAuthView('signup')
      setAuthModalOpen(true)
      return
    }
    const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    const newKey = `zl-sk-live-${randomHex.slice(0, 24)}`
    setCreatedKey(newKey)
  }

  return (
    <div className="min-h-screen bg-[#F4F3EF] text-[#0A0A0A] selection:bg-[#00C8FF] selection:text-black font-sans antialiased" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
      {/* ── Auth Modal ── */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialView={authView}
      />

      {/* ── Sticky Top Nav ── */}
      <header className="sticky top-0 z-50 bg-[#F4F3EF]/95 backdrop-blur-md border-b-2 border-[#0A0A0A] px-4 sm:px-8 h-18 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" aria-label="Zero home" className="flex items-center no-underline">
            <ZeroLogo size={0.28} color="#0A0A0A" />
          </Link>
          <span className="hidden sm:inline-block font-mono text-[11px] font-bold px-2.5 py-0.5 rounded border border-[#0A0A0A] bg-white shadow-[2px_2px_0_#0A0A0A] text-[#0A0A0A] uppercase tracking-wider">
            API Platform
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-[#555550]">
          <a href="#pricing" className="hover:text-[#0A0A0A] transition-colors">Pricing</a>
          <a href="#keys" className="hover:text-[#0A0A0A] transition-colors">API Keys</a>
          <Link href="/docs" className="hover:text-[#0A0A0A] transition-colors">Documentation</Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border-2 border-[#0A0A0A] shadow-[2px_2px_0_#0A0A0A] text-xs font-bold">
                <User className="w-3.5 h-3.5 text-[#00C8FF]" />
                <span className="truncate max-w-[120px] font-mono">{user.email?.split('@')[0]}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="p-2 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border-2 border-[#0A0A0A] shadow-[2px_2px_0_#0A0A0A] transition-all cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setAuthView('login')
                  setAuthModalOpen(true)
                }}
                className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-[#F8F7F3] text-[#0A0A0A] text-xs font-bold border-2 border-[#0A0A0A] shadow-[2px_2px_0_#0A0A0A] transition-all cursor-pointer"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthView('signup')
                  setAuthModalOpen(true)
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#00C8FF] hover:bg-[#38BDF8] text-black text-xs font-extrabold border-2 border-[#0A0A0A] shadow-[2px_2px_0_#0A0A0A] transition-all cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}

          <a
            href="#keys"
            className="hidden sm:flex px-4 py-2 rounded-lg bg-[#0A0A0A] text-white text-xs font-bold border-2 border-[#0A0A0A] shadow-[3px_3px_0_#00C8FF] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#00C8FF] transition-all items-center gap-1.5 no-underline"
          >
            <Key className="w-3.5 h-3.5 text-[#00C8FF]" />
            <span>Get API Key</span>
          </a>

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

      {/* ── Hero Section (Streamlined) ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <span className="inline-block font-mono text-[11px] font-bold tracking-[2px] uppercase text-[#0A0A0A] border-2 border-[#0A0A0A] rounded-md px-3 py-1 bg-white shadow-[2px_2px_0_#0A0A0A]">
            ✦ Production API
          </span>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05] text-[#0A0A0A]">
            Build with <span className="text-[#00C8FF]">Zero API.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#555550] max-w-lg mx-auto leading-relaxed">
            Ultra-low latency frontier intelligence. ₹100 free credits on sign up.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <a
              href="#keys"
              className="px-6 py-3 rounded-xl bg-[#0A0A0A] text-white font-bold text-sm border-2 border-[#0A0A0A] shadow-[4px_4px_0_#00C8FF] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center gap-2 no-underline"
            >
              <Key className="w-4 h-4 text-[#00C8FF]" />
              <span>Get API Key</span>
            </a>
            <Link
              href="/docs"
              className="px-6 py-3 rounded-xl bg-white text-[#0A0A0A] font-bold text-sm border-2 border-[#0A0A0A] shadow-[3px_3px_0_#0A0A0A] hover:bg-[#F8F7F3] transition-all flex items-center gap-2 no-underline"
            >
              <span>View Docs</span>
              <ArrowUpRight className="w-4 h-4 text-[#555550]" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Model Pricing (Clean & Focused) ── */}
      <section id="pricing" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t-2 border-[#0A0A0A]/10">
        <div className="text-center space-y-1 mb-8">
          <p className="font-mono text-xs font-bold tracking-[2.5px] uppercase text-[#00C8FF]">PRICING</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A0A0A]">Simple Token Rates</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Card 1: Titan Pro */}
          <div className="rounded-2xl p-6 bg-white border-2 border-[#0A0A0A] shadow-[5px_5px_0_#00C8FF] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-[#0A0A0A]">
                  Titan Pro
                </h3>
                <span className="px-2 py-0.5 rounded bg-[#E8F8FF] border border-[#00C8FF] text-[#00C8FF] text-[10px] font-mono font-bold uppercase">
                  FASTEST
                </span>
              </div>
              <p className="text-xs text-[#555550]">High-throughput dual-T4 MTP inference, chat & RAG pipelines</p>

              <div className="p-3.5 rounded-xl bg-[#F8F7F3] border border-[#0A0A0A]/15 font-mono text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#555550]">Input Tokens:</span>
                  <span className="font-bold text-[#0A0A0A]">$0.10 / 1M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#555550]">Output Tokens:</span>
                  <span className="font-bold text-[#0A0A0A]">$0.30 / 1M</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#0A0A0A]/10 text-[#00C8FF] font-bold">
                  <span>Context:</span>
                  <span>8,192 tokens</span>
                </div>
              </div>
            </div>

            <a
              href="#keys"
              className="mt-5 w-full py-2.5 rounded-xl bg-[#00C8FF] hover:bg-[#38BDF8] text-black font-extrabold text-xs text-center border-2 border-[#0A0A0A] shadow-[2px_2px_0_#0A0A0A] transition-all block no-underline"
            >
              Use Titan Pro →
            </a>
          </div>

          {/* Card 2: Titan Ultra */}
          <div className="rounded-2xl p-6 bg-white border-2 border-[#0A0A0A] shadow-[5px_5px_0_#0A0A0A] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-[#0A0A0A]">
                  Titan Ultra
                </h3>
                <span className="px-2 py-0.5 rounded bg-[#F3E8FF] border border-[#9333EA] text-[#9333EA] text-[10px] font-mono font-bold uppercase">
                  DEEP REASONING
                </span>
              </div>
              <p className="text-xs text-[#555550]">Complex reasoning, deep logic, coding & tool orchestration</p>

              <div className="p-3.5 rounded-xl bg-[#F8F7F3] border border-[#0A0A0A]/15 font-mono text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#555550]">Input Tokens:</span>
                  <span className="font-bold text-[#0A0A0A]">$0.45 / 1M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#555550]">Output Tokens:</span>
                  <span className="font-bold text-[#0A0A0A]">$1.35 / 1M</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#0A0A0A]/10 text-[#9333EA] font-bold">
                  <span>Context:</span>
                  <span>4,096 tokens</span>
                </div>
              </div>
            </div>

            <a
              href="#keys"
              className="mt-5 w-full py-2.5 rounded-xl bg-[#0A0A0A] hover:bg-[#222] text-white font-extrabold text-xs text-center border-2 border-[#0A0A0A] shadow-[2px_2px_0_#00C8FF] transition-all block no-underline"
            >
              Use Titan Ultra →
            </a>
          </div>
        </div>
      </section>

      {/* ── API Keys Management (Clean & Direct) ── */}
      <section id="keys" className="max-w-4xl mx-auto px-4 sm:px-6 py-12 border-t-2 border-[#0A0A0A]/10">
        <div className="space-y-6">
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-2xl font-extrabold text-[#0A0A0A]">Your API Keys</h2>
            <p className="text-xs sm:text-sm text-[#555550]">Generate keys to authenticate SDK and REST requests.</p>
          </div>

          {/* Key Generator Card */}
          <div className="p-6 rounded-2xl bg-white border-2 border-[#0A0A0A] shadow-[4px_4px_0_#0A0A0A] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="Key name (e.g. Production)"
                  className="px-3 py-2 rounded-xl bg-[#F8F7F3] border-2 border-[#0A0A0A] text-xs text-[#0A0A0A] focus:outline-none font-bold"
                />
                <button
                  type="button"
                  onClick={handleGenerateKey}
                  className="px-4 py-2 rounded-xl bg-[#0A0A0A] hover:bg-[#222] text-white font-extrabold text-xs border-2 border-[#0A0A0A] shadow-[2px_2px_0_#00C8FF] transition-all cursor-pointer whitespace-nowrap"
                >
                  + Create Key
                </button>
              </div>

              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-400">
                Balance: ₹100.00
              </span>
            </div>

            {/* Generated Key Modal / Display */}
            {createdKey && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-500 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-800">
                    🔑 Copy your API key now (shown once):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(createdKey)
                      setCopiedKey(true)
                      setTimeout(() => setCopiedKey(false), 2000)
                    }}
                    className="flex items-center gap-1 text-xs font-mono text-black bg-white border border-emerald-500 hover:bg-emerald-100 px-2.5 py-1 rounded transition-colors font-bold cursor-pointer"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-sm text-[#0A0A0A] break-all bg-white p-2.5 rounded-lg border border-emerald-300 font-bold">
                  {createdKey}
                </div>
              </motion.div>
            )}

            {/* Key List */}
            <div className="space-y-2 pt-1">
              <div className="divide-y divide-[#0A0A0A]/10 border-2 border-[#0A0A0A] rounded-xl bg-[#F8F7F3] overflow-hidden">
                <div className="p-3.5 flex items-center justify-between text-xs font-mono">
                  <div className="space-y-0.5">
                    <span className="text-[#0A0A0A] font-bold">zl-sk-live-9f2e...4d1a</span>
                    <span className="text-[#555550] ml-2">("Production")</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-400">Active</span>
                    <button className="text-rose-600 hover:underline font-bold cursor-pointer bg-transparent border-none">Revoke</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t-2 border-[#0A0A0A] bg-white py-8 text-center text-xs font-mono text-[#555550]">
        <p>Zero Labs Inc. © 2026</p>
      </footer>
    </div>
  )
}

export default function ApiPlatformPage() {
  return (
    <AuthProvider>
      <ApiPlatformContent />
    </AuthProvider>
  )
}
