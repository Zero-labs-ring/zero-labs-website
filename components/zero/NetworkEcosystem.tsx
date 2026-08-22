"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import {
  User,
  Watch,
  Home,
  HeartPulse,
  BrainCircuit,
  LayoutGrid,
  Wrench,
  Database,
  Store,
  Zap,
  Code2,
  Search,
  Palette,
  Cpu,
  ArrowRight,
  Sparkles,
  Layers,
  ExternalLink
} from "lucide-react"

const physicalNodes = [
  {
    id: "person",
    name: "PERSON",
    icon: User,
    color: "#22C55E",
    tag: "Identity & Context",
    desc: "Learns your routines, voice, and preferences for zero-touch interaction."
  },
  {
    id: "wearables",
    name: "WEARABLES",
    icon: Watch,
    color: "#22C55E",
    tag: "Seamless Sync",
    desc: "Bridges seamlessly with earbuds, smartwatches, and smart home wearables."
  },
  {
    id: "home",
    name: "HOME",
    icon: Home,
    color: "#22C55E",
    tag: "Ambient Automation",
    desc: "Gesture and voice control across smart lights, screens, and ambient devices."
  },
  {
    id: "health",
    name: "HEALTH",
    icon: HeartPulse,
    color: "#22C55E",
    tag: "Vitals & Telemetry",
    desc: "Continuous heart rate, SPO2, temperature, and stress tracking on your finger."
  }
]

const digitalNodes = [
  {
    id: "ai-models",
    name: "AI MODELS",
    icon: BrainCircuit,
    color: "#00C8FF",
    tag: "Titan & Frontier LLMs",
    desc: "Blazing fast on-device models backed by cloud frontier intelligence."
  },
  {
    id: "apps",
    name: "APPS",
    icon: LayoutGrid,
    color: "#00C8FF",
    tag: "iOS · Android · PC",
    desc: "Zero mobile app hub and native Windows 11 autonomous screen companion."
  },
  {
    id: "tools",
    name: "TOOLS",
    icon: Wrench,
    color: "#00C8FF",
    tag: "Autonomous Workflows",
    desc: "Automates IDE tasks, terminal execution, browsing, and file operations."
  },
  {
    id: "data",
    name: "DATA",
    icon: Database,
    color: "#00C8FF",
    tag: "Encrypted Graph",
    desc: "Private, local-first memory graph keeping your data securely in your control."
  }
]

const actionPills = [
  { label: "BUILD", icon: Zap, href: "/chat", desc: "Interactive AI Sandbox", color: "#00C8FF" },
  { label: "CODE", icon: Code2, href: "/cowork", desc: "Autonomous PC Co-work", color: "#3B82F6" },
  { label: "RESEARCH", icon: Search, href: "/research", desc: "Titan AI Models & Benchmarks", color: "#00C8FF" },
  { label: "CREATE", icon: Palette, href: "/chat", desc: "Multimodal Generative Workflows", color: "#EC4899" },
  { label: "API", icon: Cpu, href: "/api-platform", desc: "Developer Platform & SDKs", color: "#00C8FF" },
]

export default function NetworkEcosystem() {
  const [activeTab, setActiveTab] = useState<"all" | "physical" | "digital">("all")
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  return (
    <motion.section
      id="ecosystem"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      style={{ background: "#F4F3EF", borderTop: "2px solid #0A0A0A" }}
      className="px-4 py-16 sm:px-6 md:px-8 md:py-24"
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#FFFFFF] border-[1.5px] border-[#0A0A0A] shadow-[2px_2px_0_#0A0A0A] mb-4">
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00C8FF" }} className="animate-pulse" />
            <span
              style={{
                fontFamily: "var(--font-space-mono)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#0A0A0A"
              }}
            >
              ✦ THE ZERO NEURAL ECOSYSTEM
            </span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 800,
              fontSize: "clamp(34px, 7vw, 56px)",
              letterSpacing: "-2px",
              color: "#0A0A0A",
              lineHeight: 1.02,
              margin: "0 0 12px",
            }}
          >
            ONE NETWORK. <br className="hidden sm:inline" />
            <span style={{ color: "#00C8FF" }}>EVERYTHING CONNECTED.</span>
          </h2>

          <p
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "clamp(15px, 2.5vw, 18px)",
              color: "#555550",
              lineHeight: 1.6,
              maxWidth: 620,
              margin: "0 auto",
            }}
          >
            <span className="font-semibold text-[#0A0A0A]">Physical life ⟷ Digital intelligence.</span>
            {" "}The Zero Ring sits at the center, bridging your body, real-world devices, and frontier AI intelligence into one unified loop.
          </p>
        </div>

        {/* Main Showcase Infographic Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          style={{
            background: "#FFFFFF",
            border: "2px solid #0A0A0A",
            borderRadius: 24,
            boxShadow: "6px 6px 0 #0A0A0A",
            overflow: "hidden",
            position: "relative"
          }}
          className="p-4 sm:p-6 md:p-8 mb-12"
        >
          {/* Card Header Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[rgba(10,10,10,0.1)]">
            <div className="flex items-center gap-2">
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F56" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#27C93F" }} />
              <span
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#666660",
                  letterSpacing: "1px",
                  marginLeft: 6
                }}
              >
                ZERO_ECOSYSTEM_MAP · V1.0
              </span>
            </div>

            {/* Filter Toggle Pills */}
            <div className="flex items-center gap-1.5 bg-[#F4F3EF] p-1 rounded-lg border border-[#0A0A0A]">
              {(["all", "physical", "digital"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    fontFamily: "var(--font-space-mono)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    background: activeTab === tab ? "#0A0A0A" : "transparent",
                    color: activeTab === tab ? "#FFFFFF" : "#555550",
                    transition: "all 150ms"
                  }}
                >
                  {tab === "all" ? "Full Matrix" : tab === "physical" ? "Physical Life" : "Digital Intel"}
                </button>
              ))}
            </div>
          </div>

          {/* Centerpiece Image */}
          <div
            style={{
              position: "relative",
              width: "100%",
              borderRadius: 16,
              overflow: "hidden",
              background: "#FAF9F6",
              border: "1.5px solid rgba(10,10,10,0.08)"
            }}
            className="flex items-center justify-center p-2 sm:p-4"
          >
            <img
              src="/zero_network_ecosystem.png"
              alt="Zero Ring Neural Ecosystem — One Network. Everything Connected. Physical life (Person, Wearables, Home, Health) connected to Digital Intelligence (AI Models, Apps, Tools, Data) through Zero Ring and Marketplace"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: 640,
                objectFit: "contain",
                display: "block",
                borderRadius: 12
              }}
            />
          </div>

          {/* Quick Subtitle Bar underneath image */}
          <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-[rgba(10,10,10,0.08)]">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
              <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 600, color: "#111111" }}>
                Physical Life Nodes
              </span>
              <span className="text-[#888880] hidden sm:inline">· Wearables, Home & Biometrics</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#00C8FF]" />
              <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 600, color: "#111111" }}>
                Digital Intelligence Nodes
              </span>
              <span className="text-[#888880] hidden sm:inline">· AI Models, Apps, Tools & Data</span>
            </div>
          </div>
        </motion.div>

        {/* Dual Pillar Interactive Deep-Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column: Physical Life */}
          {(activeTab === "all" || activeTab === "physical") && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              style={{
                background: "#FFFFFF",
                border: "2px solid #0A0A0A",
                borderRadius: 20,
                boxShadow: "4px 4px 0 #22C55E",
                padding: "24px 20px"
              }}
              className="sm:p-6"
            >
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[rgba(10,10,10,0.1)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#15803D]">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 800, fontSize: 20, color: "#0A0A0A", margin: 0 }}>
                      Physical Life
                    </h3>
                    <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 10, color: "#15803D", margin: 0, fontWeight: 700, letterSpacing: "1px" }}>
                      SENSORS · BODY · ENVIRONMENT
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#22C55E]/10 text-[#15803D] border border-[#22C55E]/20">
                  4 Nodes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {physicalNodes.map((node) => {
                  const Icon = node.icon
                  const isSelected = selectedNode === node.id
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(isSelected ? null : node.id)}
                      style={{
                        background: isSelected ? "rgba(34,197,94,0.06)" : "#FAF9F5",
                        border: `1.5px solid ${isSelected ? "#22C55E" : "rgba(10,10,10,0.12)"}`,
                        borderRadius: 14,
                        padding: 14,
                        cursor: "pointer",
                        transition: "all 150ms"
                      }}
                      className="hover:border-[#22C55E] hover:shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            style={{
                              fontFamily: "var(--font-space-mono)",
                              fontSize: 12,
                              fontWeight: 800,
                              color: "#0A0A0A",
                              letterSpacing: "0.5px"
                            }}
                          >
                            {node.name}
                          </span>
                          <div className="w-7 h-7 rounded-lg bg-white border border-[rgba(10,10,10,0.1)] flex items-center justify-center text-[#15803D]">
                            <Icon size={14} />
                          </div>
                        </div>
                        <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 9.5, color: "#16A34A", fontWeight: 700, display: "block", marginBottom: 6 }}>
                          {node.tag}
                        </span>
                        <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 12.5, color: "#555550", lineHeight: 1.45, margin: 0 }}>
                          {node.desc}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Right Column: Digital Intelligence */}
          {(activeTab === "all" || activeTab === "digital") && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              style={{
                background: "#FFFFFF",
                border: "2px solid #0A0A0A",
                borderRadius: 20,
                boxShadow: "4px 4px 0 #00C8FF",
                padding: "24px 20px"
              }}
              className="sm:p-6"
            >
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[rgba(10,10,10,0.1)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00C8FF]/15 border border-[#00C8FF]/30 flex items-center justify-center text-[#0284C7]">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 800, fontSize: 20, color: "#0A0A0A", margin: 0 }}>
                      Digital Intelligence
                    </h3>
                    <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 10, color: "#0284C7", margin: 0, fontWeight: 700, letterSpacing: "1px" }}>
                      FRONTIER AI · APPS · AUTOMATION
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#00C8FF]/10 text-[#0284C7] border border-[#00C8FF]/20">
                  4 Nodes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {digitalNodes.map((node) => {
                  const Icon = node.icon
                  const isSelected = selectedNode === node.id
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(isSelected ? null : node.id)}
                      style={{
                        background: isSelected ? "rgba(0,200,255,0.06)" : "#FAF9F5",
                        border: `1.5px solid ${isSelected ? "#00C8FF" : "rgba(10,10,10,0.12)"}`,
                        borderRadius: 14,
                        padding: 14,
                        cursor: "pointer",
                        transition: "all 150ms"
                      }}
                      className="hover:border-[#00C8FF] hover:shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            style={{
                              fontFamily: "var(--font-space-mono)",
                              fontSize: 12,
                              fontWeight: 800,
                              color: "#0A0A0A",
                              letterSpacing: "0.5px"
                            }}
                          >
                            {node.name}
                          </span>
                          <div className="w-7 h-7 rounded-lg bg-white border border-[rgba(10,10,10,0.1)] flex items-center justify-center text-[#0284C7]">
                            <Icon size={14} />
                          </div>
                        </div>
                        <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 9.5, color: "#0284C7", fontWeight: 700, display: "block", marginBottom: 6 }}>
                          {node.tag}
                        </span>
                        <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 12.5, color: "#555550", lineHeight: 1.45, margin: 0 }}>
                          {node.desc}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Marketplace Hub Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          style={{
            background: "#0A0A0A",
            border: "2px solid #0A0A0A",
            borderRadius: 20,
            boxShadow: "4px 4px 0 #00C8FF",
            padding: "24px 28px",
            color: "#FFFFFF"
          }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-[#00C8FF] shrink-0">
              <Store size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 10, color: "#00C8FF", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700 }}>
                  CENTRAL HUB
                </span>
                <span className="text-[10px] bg-[#00C8FF] text-[#0A0A0A] font-extrabold px-2 py-0.2 rounded-full">
                  COMING SOON
                </span>
              </div>
              <h4 style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 800, fontSize: 20, color: "#FFFFFF", margin: 0 }}>
                A Marketplace of People, Apps, Services & Ideas
              </h4>
              <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 13.5, color: "rgba(255,255,255,0.7)", margin: "4px 0 0", maxWidth: 540 }}>
                Publish custom Zero Ring skills, AI voice agents, and desktop automation workflows or discover community creations.
              </p>
            </div>
          </div>

          <a
            href="/docs"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 700,
              fontSize: 13,
              background: "#FFFFFF",
              color: "#0A0A0A",
              border: "1.5px solid #FFFFFF",
              borderRadius: 10,
              padding: "10px 18px",
              textDecoration: "none",
              boxShadow: "3px 3px 0 #00C8FF",
              whiteSpace: "nowrap"
            }}
            className="flex items-center gap-2 hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform"
          >
            <span>Explore Developer Platform</span>
            <ArrowRight size={14} />
          </a>
        </motion.div>

        {/* Bottom Interactive Builder Actions Suite (Build · Code · Research · Create · API) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          style={{
            background: "#FFFFFF",
            border: "2px solid #0A0A0A",
            borderRadius: 20,
            boxShadow: "4px 4px 0 #0A0A0A",
            padding: "24px 20px"
          }}
          className="sm:p-6 text-center"
        >
          <p
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: 10.5,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "#00C8FF",
              fontWeight: 700,
              marginBottom: 6
            }}
          >
            A NETWORK FOR EVERYTHING YOU BUILD AND USE
          </p>
          <h3
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 800,
              fontSize: "clamp(20px, 4vw, 26px)",
              color: "#0A0A0A",
              margin: "0 0 16px"
            }}
          >
            Explore the Zero Ecosystem Platforms
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {actionPills.map((action) => {
              const ActionIcon = action.icon
              return (
                <a
                  key={action.label}
                  href={action.href}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "16px 12px",
                    background: "#FAF9F6",
                    border: "1.5px solid #0A0A0A",
                    borderRadius: 14,
                    textDecoration: "none",
                    boxShadow: "2px 2px 0 #0A0A0A",
                    transition: "all 150ms"
                  }}
                  className="hover:-translate-y-1 hover:shadow-[3px_3px_0_#00C8FF] group"
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: "#0A0A0A",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 8
                    }}
                    className="group-hover:bg-[#00C8FF] group-hover:text-[#0A0A0A] transition-colors"
                  >
                    <ActionIcon size={18} />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-space-mono)",
                      fontWeight: 800,
                      fontSize: 13,
                      color: "#0A0A0A",
                      letterSpacing: "0.5px"
                    }}
                  >
                    {action.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      fontSize: 11,
                      color: "#666660",
                      marginTop: 2
                    }}
                  >
                    {action.desc}
                  </span>
                </a>
              )
            })}
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
