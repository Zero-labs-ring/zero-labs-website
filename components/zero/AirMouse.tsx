"use client"

import { motion, type Variants } from "framer-motion"
import { useState, useRef } from "react"
import { MousePointer2, Hand, Compass, Laptop2, Sparkles, Move, Zap, Play } from "lucide-react"

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
}

const modes = [
  {
    id: "pointer",
    icon: MousePointer2,
    title: "Air Pointer",
    badge: "Sub-mm Precision",
    desc: "Move your finger naturally. 6-axis gyroscope and accelerometer project a sub-millimeter cursor trail onto any screen."
  },
  {
    id: "click",
    icon: Hand,
    title: "Air Click",
    badge: "Haptic Feedback",
    desc: "Single-tap your thumb against your index finger for left-click. Double-tap or pinch for right-click and context actions."
  },
  {
    id: "scroll",
    icon: Compass,
    title: "Air Scroll",
    badge: "Inertial Scroll",
    desc: "Tilt your wrist vertically or horizontally for physics-based kinetic scrolling through code, docs, and timelines."
  },
  {
    id: "universal",
    icon: Laptop2,
    title: "Zero Setup",
    badge: "HID Bluetooth 5.3",
    desc: "Standard Bluetooth HID profile. Works out of the box with Mac, Windows 11, iPad, Android TV, and smart projectors."
  }
]

const telemetrySpecs = [
  { label: "SENSOR RATE", val: "1000 Hz" },
  { label: "GESTURE LATENCY", val: "< 1.8 ms" },
  { label: "TRACKING RANGE", val: "15 Meters" },
  { label: "BATTERY EFFICIENCY", val: "All Day" }
]

export default function AirMouse() {
  const [activeMode, setActiveMode] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [justClicked, setJustClicked] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = Math.round(e.clientX - rect.left)
    const y = Math.round(e.clientY - rect.top)
    setMousePos({ x, y })
  }

  const handleInteractiveClick = () => {
    setClickCount(c => c + 1)
    setJustClicked(true)
    setTimeout(() => setJustClicked(false), 300)
  }

  return (
    <motion.section
      id="air-mouse"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      style={{ background: "#F4F3EF", borderTop: "2px solid #0A0A0A" }}
      className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8"
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        {/* Top Header Badge & Intro */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#FFFFFF] border-[1.5px] border-[#0A0A0A] shadow-[2px_2px_0_#0A0A0A] mb-4">
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00C8FF" }} className="animate-pulse" />
            <span
              style={{
                fontFamily: "var(--font-space-mono)",
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "#0A0A0A"
              }}
            >
              ✦ ZERO SPATIAL ENGINE
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
            Spatial Cursor. <br className="hidden sm:inline" />
            <span style={{ color: "#00C8FF" }}>Zero Hardware Friction.</span>
          </h2>

          <p
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "clamp(15px, 2.5vw, 17.5px)",
              color: "#555550",
              lineHeight: 1.6,
              maxWidth: 540,
              margin: "0 auto",
            }}
          >
            No desk, no mousepad, no laser reflection required. Move your hand in free space to control any screen with micro-second responsiveness.
          </p>
        </div>

        {/* ── INTERACTIVE SHOWCASE HERO CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          style={{
            background: "#FFFFFF",
            border: "2px solid #0A0A0A",
            borderRadius: 24,
            boxShadow: "6px 6px 0 #0A0A0A",
            overflow: "hidden",
          }}
          className="mb-8"
        >
          {/* Card OS Top Bar with Live Telemetry */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-[#FAF9F5] border-b border-[#0A0A0A]">
            <div className="flex items-center gap-2">
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F56" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#27C93F" }} />
              <span
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: 11,
                  color: "#0A0A0A",
                  fontWeight: 800,
                  marginLeft: 6,
                  letterSpacing: "1px"
                }}
              >
                SPATIAL_CANVAS_V1.0
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Interactive cursor coordinate HUD */}
              <div className="hidden sm:flex items-center gap-2 bg-white px-2.5 py-1 rounded-md border border-[rgba(10,10,10,0.15)] font-mono text-[11px] text-[#555]">
                <span className="text-[#00C8FF] font-bold">X:</span> {mousePos.x}px
                <span className="text-[#00C8FF] font-bold ml-1">Y:</span> {mousePos.y}px
              </div>

              <span
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: "#0A0A0A",
                  background: "#00C8FF",
                  padding: "3px 10px",
                  borderRadius: 6,
                  boxShadow: "1.5px 1.5px 0 #0A0A0A"
                }}
              >
                BLUETOOTH 5.3 · CONNECTED
              </span>
            </div>
          </div>

          {/* Graphic Container with Interactive Hover & Tap Canvas */}
          <div
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleInteractiveClick}
            style={{
              position: "relative",
              width: "100%",
              overflow: "hidden",
              background: "#FFFFFF",
              cursor: "crosshair",
              userSelect: "none"
            }}
            className="p-3 sm:p-5 flex items-center justify-center"
          >
            <img
              src="/zero_air_mouse.png"
              alt="Zero Ring Air Mouse spatial navigation showcasing Move, Point, Click gestures on a laptop"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: 580,
                objectFit: "contain",
                display: "block",
                borderRadius: 14
              }}
              draggable={false}
            />

            {/* Interactive Live Cursor Dot Follower when user moves over image */}
            {isHovered && (
              <div
                style={{
                  position: "absolute",
                  left: mousePos.x,
                  top: mousePos.y,
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                  zIndex: 20
                }}
                className="transition-transform duration-75"
              >
                {/* Glow ring */}
                <div
                  style={{
                    width: justClicked ? 36 : 24,
                    height: justClicked ? 36 : 24,
                    borderRadius: "50%",
                    border: "2px solid #00C8FF",
                    background: justClicked ? "rgba(0, 200, 255, 0.4)" : "rgba(0, 200, 255, 0.15)",
                    boxShadow: "0 0 16px rgba(0, 200, 255, 0.8)",
                    transition: "all 150ms ease"
                  }}
                  className="flex items-center justify-center"
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00C8FF" }} />
                </div>

                {/* Floating tooltip */}
                <div
                  style={{
                    position: "absolute",
                    top: 28,
                    left: "50%",
                    transform: "translateX(-50%)",
                    whiteSpace: "nowrap",
                    fontFamily: "var(--font-space-mono)",
                    fontSize: 9.5,
                    fontWeight: 700,
                    background: "#0A0A0A",
                    color: "#FFFFFF",
                    padding: "2px 8px",
                    borderRadius: 4,
                    boxShadow: "2px 2px 0 #00C8FF"
                  }}
                >
                  {justClicked ? "CLICK REGISTERED ✓" : "AIR CURSOR TRACKING"}
                </div>
              </div>
            )}

            {/* Interactive Hint Chip */}
            <div
              style={{
                position: "absolute",
                bottom: 16,
                right: 16,
                background: "rgba(10,10,10,0.85)",
                color: "#FFFFFF",
                backdropFilter: "blur(8px)",
                borderRadius: 8,
                padding: "6px 12px",
                fontFamily: "var(--font-space-mono)",
                fontSize: 10,
                display: "flex",
                alignItems: "center",
                gap: 6,
                border: "1px solid rgba(255,255,255,0.15)",
                pointerEvents: "none"
              }}
              className="hidden sm:flex"
            >
              <Sparkles size={12} className="text-[#00C8FF]" />
              <span>Move & Click to test live spatial response ({clickCount} clicks)</span>
            </div>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-[#0A0A0A] bg-[#FAF9F5] divide-x divide-[#0A0A0A]">
            {telemetrySpecs.map((spec) => (
              <div key={spec.label} className="p-3 sm:p-4 text-center">
                <div style={{ fontFamily: "var(--font-space-mono)", fontSize: 9.5, fontWeight: 700, color: "#777770", letterSpacing: "1px" }}>
                  {spec.label}
                </div>
                <div style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 16, fontWeight: 800, color: "#0A0A0A", marginTop: 2 }}>
                  {spec.val}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── 4 INTERACTIVE FEATURE CARDS WITH TAB SELECTION ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modes.map((mode, i) => {
            const Icon = mode.icon
            const isSelected = activeMode === i
            return (
              <motion.div
                key={mode.id}
                onClick={() => setActiveMode(i)}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                viewport={{ once: true }}
                style={{
                  background: isSelected ? "#FFFFFF" : "#FAF9F6",
                  border: "2px solid #0A0A0A",
                  borderRadius: 18,
                  padding: "20px 18px",
                  boxShadow: isSelected ? "4px 4px 0 #00C8FF" : "3px 3px 0 #0A0A0A",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 150ms ease"
                }}
                className="hover:-translate-y-1 hover:shadow-[4px_4px_0_#00C8FF]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: isSelected ? "#00C8FF" : "#0A0A0A",
                        color: isSelected ? "#0A0A0A" : "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 150ms ease"
                      }}
                    >
                      <Icon size={18} />
                    </div>

                    <span
                      style={{
                        fontFamily: "var(--font-space-mono)",
                        fontSize: 9.5,
                        fontWeight: 800,
                        color: isSelected ? "#0A0A0A" : "#888880",
                        background: isSelected ? "rgba(0,200,255,0.15)" : "transparent",
                        padding: "2px 6px",
                        borderRadius: 4,
                        border: isSelected ? "1px solid #00C8FF" : "none"
                      }}
                    >
                      {mode.badge}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      fontWeight: 800,
                      fontSize: 16,
                      color: "#0A0A0A",
                      margin: "0 0 6px"
                    }}
                  >
                    {mode.title}
                  </h3>

                  <p
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      fontSize: 13,
                      color: "#555550",
                      lineHeight: 1.5,
                      margin: 0
                    }}
                  >
                    {mode.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
