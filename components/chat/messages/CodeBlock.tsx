'use client'

import { useState, useMemo, useRef } from 'react'
import { Check, Copy, Code2, Play, Terminal, Loader2, RotateCw, X, CornerDownLeft, ChevronDown, ChevronUp } from 'lucide-react'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

interface CodeBlockProps {
  language?: string
  code: string
}

function formatTitle(str: string): string {
  let clean = str
    .replace(/^[\/*#\-\s]+|[\/*#\-\s]+$/g, '')
    // Strip redundant words like "Implementation in Python", "Algorithm in C++", "Program", etc.
    .replace(/\s*(?:implementation|algorithm|example|program|script|code|tutorial)\s*(?:in|for|using)?\s*[a-zA-Z0-9+#.]*$/i, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .trim()

  if (!clean || clean.length < 2) {
    clean = str.replace(/^[\/*#\-\s]+|[\/*#\-\s]+$/g, '').trim()
  }

  return clean
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const EXECUTABLE_LANGS = new Set([
  'c', 'cpp', 'c++', 'cc', 'cxx',
  'python', 'py', 'python3',
  'javascript', 'js', 'jsx', 'node',
  'typescript', 'ts', 'tsx',
  'java',
  'rust', 'rs',
  'go', 'golang',
  'csharp', 'c#', 'cs',
  'php',
  'ruby', 'rb',
  'swift',
  'r',
  'lua',
])

const NON_EXECUTABLE_LANGS = new Set([
  'bash', 'sh', 'shell', 'zsh', 'terminal', 'console', 'cmd', 'powershell', 'ps1',
  'html', 'htm', 'xml', 'svg', 'vue', 'svelte',
  'css', 'scss', 'sass', 'less', 'postcss',
  'json', 'jsonc', 'yaml', 'yml', 'toml', 'ini', 'env',
  'markdown', 'md', 'mdx',
  'sql', 'mysql', 'postgres', 'sqlite', 'graphql', 'prisma',
  'dockerfile', 'docker', 'makefile', 'cmake',
  'text', 'txt', 'plaintext', 'output', 'log', 'diff', 'git',
  'pseudocode', 'pseudo', 'latex', 'tex', 'bib',
  'code', 'none', ''
])

function extractCodeTitle(code: string, language: string): string {
  const lines = code.split('\n').map(l => l.trim()).filter(Boolean)

  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i]
    const blockMatch = line.match(/^\/\*+\s*(?:Demo:\s*|Algorithm:\s*|Program:\s*|Description:\s*)?([^*]+?)\*+\/$/i)
    if (blockMatch && blockMatch[1].trim().length > 2 && blockMatch[1].trim().length < 50) {
      const clean = blockMatch[1].trim()
      const lower = clean.toLowerCase()
      if (!lower.startsWith('include') && !lower.startsWith('clean up') && !lower.includes('function prototypes') && !lower.includes('main entry')) {
        return formatTitle(clean)
      }
    }

    const lineMatch = line.match(/^(?:\/\/|#|--)\s*(?:Demo:\s*|Algorithm:\s*|Program:\s*)?([A-Za-z0-9_\-\s]{3,45})$/i)
    if (lineMatch && lineMatch[1].trim().length > 2) {
      const clean = lineMatch[1].trim()
      const lower = clean.toLowerCase()
      if (!lower.includes('include') && !lower.includes('clean up') && !lower.includes('eslint') && !lower.includes('function prototypes')) {
        return formatTitle(clean)
      }
    }
  }

  const funcMatches = code.matchAll(/(?:void|int|float|double|bool|boolean|char\*?|def|function|const|async\s+function)\s+([a-zA-Z0-9_]{3,32})\s*\(/g)
  for (const m of funcMatches) {
    const fnName = m[1]
    const lower = fnName.toLowerCase()
    if (!['main', 'printf', 'scanf', 'malloc', 'free', 'print', 'printarray', 'display', 'init', 'getint', 'cleanup', 'freelist'].includes(lower)) {
      return formatTitle(fnName)
    }
  }

  const classMatch = code.match(/(?:class|struct|interface|type|enum)\s+([A-Za-z0-9_]{3,32})/i)
  if (classMatch && classMatch[1]) {
    if (classMatch[1].toLowerCase() === 'node') {
      return 'Linked List'
    }
    return formatTitle(classMatch[1])
  }

  return ''
}

function escapeHtml(str: string): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const LANG_ALIASES: Record<string, string> = {
  'c++': 'cpp',
  'c#': 'csharp',
  'py': 'python',
  'js': 'javascript',
  'ts': 'typescript',
  'tsx': 'typescript',
  'jsx': 'javascript',
  'sh': 'bash',
  'zsh': 'bash',
  'html': 'xml',
  'svg': 'xml',
  'vue': 'html',
}

export function CodeBlock({ language = '', code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [stdout, setStdout] = useState('')
  const [stderr, setStderr] = useState('')
  const [compilerName, setCompilerName] = useState('')
  const [exitCode, setExitCode] = useState<number | null>(null)
  const [durationMs, setDurationMs] = useState<number | null>(null)
  const [stdin, setStdin] = useState('')
  const [showStdin, setShowStdin] = useState(false)
  const terminalContainerRef = useRef<HTMLDivElement>(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code', err)
    }
  }

  // Determine highlighted HTML with guaranteed HTML escaping for unblocked rendering
  const { highlightedCode, langDisplay } = useMemo(() => {
    const rawLang = (language || '').toLowerCase().trim()
    const resolvedLang = LANG_ALIASES[rawLang] || rawLang || 'code'
    let highlighted = ''

    try {
      if (resolvedLang && hljs.getLanguage(resolvedLang)) {
        highlighted = hljs.highlight(code, { language: resolvedLang, ignoreIllegals: true }).value
      } else if (code.length > 10) {
        const auto = hljs.highlightAuto(code)
        highlighted = auto.value || escapeHtml(code)
      } else {
        highlighted = escapeHtml(code)
      }
    } catch {
      highlighted = escapeHtml(code)
    }

    return { 
      highlightedCode: highlighted || escapeHtml(code), 
      langDisplay: resolvedLang || 'code' 
    }
  }, [code, language])

  const codeTitle = useMemo(() => extractCodeTitle(code, langDisplay), [code, langDisplay])
  const hasCustomTitle = Boolean(
    codeTitle && 
    codeTitle.toLowerCase() !== langDisplay.toLowerCase() && 
    codeTitle.toLowerCase() !== 'code'
  )

  // Check if code block is truly executable code vs terminal output / config / markdown
  const isExecutable = useMemo(() => {
    const raw = (language || '').toLowerCase().trim()
    const resolved = LANG_ALIASES[raw] || raw
    const trimmed = code.trim()

    // 1. Must be non-empty code with at least 15 characters (filters out single variables like 'target')
    if (!trimmed || trimmed.length < 15) return false

    // 2. Terminal commands, prompt lines ($ or >) should never be runnable
    if (/^\$\s+[a-zA-Z0-9_\-]+/m.test(trimmed) || trimmed.startsWith('> ') || trimmed.startsWith('>>> ')) {
      return false
    }

    // 3. If explicit non-executable language, reject immediately
    if (NON_EXECUTABLE_LANGS.has(resolved) || NON_EXECUTABLE_LANGS.has(raw)) {
      return false
    }

    // 4. If explicit executable language, allow execution
    if (EXECUTABLE_LANGS.has(resolved) || EXECUTABLE_LANGS.has(raw)) {
      return true
    }

    // 5. If no language was specified (or 'code'), only allow if strong unambiguous code signatures exist
    if (!resolved || resolved === 'code') {
      const hasPythonSig = /def\s+[a-zA-Z0-9_]+\s*\(|import\s+(?:math|sys|os|re|collections|itertools|heapq)|print\s*\(/i.test(trimmed)
      const hasCppSig = /#include\s*<|int\s+main\s*\(|std::|cout\s*<<|printf\s*\(/i.test(trimmed)
      const hasJsSig = /console\.log\s*\(|function\s+[a-zA-Z0-9_]+\s*\(|const\s+[a-zA-Z0-9_]+\s*=\s*(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>/i.test(trimmed)
      const hasJavaSig = /public\s+class\s+|public\s+static\s+void\s+main/i.test(trimmed)
      const hasRustSig = /fn\s+main\s*\(|println!\s*\(/i.test(trimmed)
      const hasGoSig = /package\s+main|func\s+main\s*\(/i.test(trimmed)

      if (hasPythonSig || hasCppSig || hasJsSig || hasJavaSig || hasRustSig || hasGoSig) {
        return true
      }
    }

    return false
  }, [language, code])

  // Check if code might accept stdin
  const hasInteractiveInput = useMemo(() => {
    return /scanf\s*\(|cin\s*>>|input\s*\(|readline|gets\s*\(|fgets\s*\(/i.test(code)
  }, [code])

  const handleRunCode = async (customStdin?: string) => {
    setIsRunning(true)
    setTerminalOpen(true)
    setStdout('')
    setStderr('')
    setExitCode(null)
    setDurationMs(null)

    if (hasInteractiveInput && !stdin && customStdin === undefined) {
      setShowStdin(true)
    }

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: langDisplay,
          code,
          stdin: customStdin !== undefined ? customStdin : stdin,
        }),
      })

      const data = await res.json()

      setCompilerName(data.compilerName || data.compiler || '')
      setDurationMs(data.durationMs ?? 0)

      if (!res.ok) {
        setStderr(data.error || data.details || 'Execution service error')
        setExitCode(data.exitCode ?? 1)
      } else {
        const out = data.stdout || (data.output && !data.stderr ? data.output : '')
        setStdout(out)
        setStderr(data.stderr || '')
        setExitCode(data.exitCode ?? 0)
      }
    } catch (err: any) {
      setStderr(err.message || 'Failed to connect to execution engine')
      setExitCode(1)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="my-4 w-full max-w-full rounded-2xl border border-[#2D2D30] bg-[#1E1E1E] text-[#D4D4D4] shadow-[0_4px_24px_rgba(0,0,0,0.15)] font-mono relative">
      {/* ChatGPT-style Sticky Top Header with Concise Name & Dedicated Action Spacing */}
      <div className="sticky top-0 z-20 flex items-center justify-between gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#252526] border-b border-[#333337] text-xs select-none rounded-t-2xl shadow-sm backdrop-blur-md">
        {/* Left: Concise Code Title & Language Badge */}
        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden text-[#CCCCCC] font-medium tracking-wide">
          <Code2 className="w-3.5 h-3.5 text-[#00C8FF] shrink-0" />
          {hasCustomTitle && (
            <span 
              className="font-semibold text-white text-[12.5px] sm:text-[13.5px] tracking-tight truncate max-w-[130px] xs:max-w-[190px] sm:max-w-[280px] md:max-w-none"
              title={codeTitle}
            >
              {codeTitle}
            </span>
          )}
          <span className="text-[9.5px] sm:text-[10.5px] font-bold text-[#00C8FF] bg-[#00C8FF]/10 px-1.5 sm:px-2 py-0.5 rounded border border-[#00C8FF]/20 uppercase tracking-wider shrink-0">
            {langDisplay}
          </span>
        </div>

        {/* Right Actions: Run + Copy (With Guaranteed Spacing & Shrink Prevention) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Run Code Button */}
          {isExecutable && (
            <button
              onClick={() => handleRunCode()}
              disabled={isRunning}
              type="button"
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-md bg-[#00C8FF]/15 hover:bg-[#00C8FF]/25 border border-[#00C8FF]/30 text-[#00C8FF] hover:text-white transition-all text-xs font-sans font-semibold cursor-pointer shadow-xs disabled:opacity-50 shrink-0"
              title="Run code in interactive container"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden xs:inline">Running…</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run</span>
                </>
              )}
            </button>
          )}

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            type="button"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-[#CCCCCC] hover:text-white hover:bg-white/10 transition-all text-xs font-sans font-medium cursor-pointer shrink-0"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#00C8FF]" />
                <span className="text-[#00C8FF] font-semibold text-[11.5px] sm:text-xs">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy code</span>
                <span className="sm:hidden">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body with Highlighting & Horizontal Scroll */}
      <div 
        className={`relative w-full max-w-full overflow-x-auto p-4 sm:p-5 text-[13px] sm:text-[14px] leading-relaxed bg-[#1E1E1E] ${!terminalOpen ? 'rounded-b-2xl' : ''}`}
      >
        <pre 
          className="!bg-transparent !p-0 !m-0 !border-0 !shadow-none font-mono text-[#D4D4D4] !whitespace-pre tab-4 select-text"
          style={{ whiteSpace: 'pre', wordBreak: 'normal' }}
        >
          <code
            className="hljs !bg-transparent !p-0 !text-[#D4D4D4]"
            style={{ whiteSpace: 'pre', wordBreak: 'normal' }}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      </div>

      {/* ── Integrated Interactive Terminal Console ── */}
      {terminalOpen && (
        <div
          ref={terminalContainerRef}
          className="border-t border-[#333337] bg-[#0E0E12] flex flex-col font-mono text-xs rounded-b-2xl overflow-hidden transition-all duration-200"
        >
          {/* Terminal Header Bar */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-[#17171C] border-b border-[#25252C] text-[12px] select-none gap-2">
            <div className="flex items-center gap-2 text-[#E0E0E0] flex-wrap min-w-0">
              <Terminal className="w-4 h-4 text-[#00C8FF] shrink-0" />
              <span className="font-bold text-white tracking-wide">Terminal</span>

              {/* Compiler Badge */}
              {compilerName && (
                <span className="text-[10.5px] sm:text-[11px] text-[#A0A0A0] font-sans bg-white/5 px-2 py-0.5 rounded border border-white/10 truncate max-w-[120px] sm:max-w-none">
                  {compilerName}
                </span>
              )}

              {/* Execution Status Badge */}
              {isRunning ? (
                <span className="flex items-center gap-1.5 text-[11px] text-[#00C8FF] font-medium bg-[#00C8FF]/10 px-2.5 py-0.5 rounded-full border border-[#00C8FF]/30">
                  <Loader2 className="w-3 h-3 animate-spin text-[#00C8FF]" />
                  <span>Executing…</span>
                </span>
              ) : exitCode !== null ? (
                <span
                  className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
                    exitCode === 0
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                      : 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${exitCode === 0 ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  {exitCode === 0 ? 'Success' : `Exit ${exitCode}`}
                  {durationMs !== null && <span className="opacity-60 ml-0.5 font-sans">({durationMs}ms)</span>}
                </span>
              ) : null}
            </div>

            {/* Terminal Controls: Stdin / Re-run / Close */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowStdin(v => !v)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-sans font-medium transition-all ${
                  showStdin
                    ? 'bg-[#00C8FF]/20 text-[#00C8FF] border border-[#00C8FF]/40'
                    : 'text-[#888] hover:text-white hover:bg-white/10'
                }`}
                title="Toggle standard input (stdin)"
              >
                <span>Input</span>
                {showStdin ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              <button
                type="button"
                onClick={() => handleRunCode()}
                disabled={isRunning}
                className="p-1.5 text-[#888] hover:text-[#00C8FF] hover:bg-white/10 rounded transition-all cursor-pointer"
                title="Re-run program"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => setTerminalOpen(false)}
                className="p-1.5 text-[#888] hover:text-rose-400 hover:bg-white/10 rounded transition-all cursor-pointer"
                title="Close terminal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Stdin Drawer */}
          {showStdin && (
            <div className="px-3 sm:px-4 py-2.5 bg-[#131317] border-b border-[#25252C] flex flex-col gap-2">
              <label className="text-[11px] font-sans font-semibold text-[#AAA] flex items-center justify-between">
                <span>Standard Input (for scanf, cin, input):</span>
                <span className="text-[10px] text-[#666]">Press Enter to Run</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={stdin}
                  onChange={e => setStdin(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleRunCode(stdin)
                  }}
                  placeholder="e.g. 5 64 34 25 12 22"
                  className="flex-1 bg-[#09090C] border border-[#33333D] rounded px-3 py-1.5 text-xs text-white placeholder:text-[#555] outline-none focus:border-[#00C8FF]"
                />
                <button
                  type="button"
                  onClick={() => handleRunCode(stdin)}
                  disabled={isRunning}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#00C8FF]/20 text-[#00C8FF] hover:bg-[#00C8FF]/30 border border-[#00C8FF]/40 rounded font-semibold text-xs transition-all cursor-pointer"
                >
                  <CornerDownLeft className="w-3 h-3" />
                  <span className="hidden xs:inline">Run</span>
                </button>
              </div>
            </div>
          )}

          {/* Terminal Console Output Body */}
          <div className="p-3 sm:p-4 max-h-80 overflow-y-auto font-mono text-[13px] sm:text-[13.5px] leading-relaxed select-text space-y-2 bg-[#09090C]">
            {/* Command Invocation Banner */}
            <div className="text-[#666] flex items-center gap-2 select-none text-[11.5px] pb-1.5 border-b border-[#1A1A22]">
              <span className="text-[#00C8FF] font-bold">$</span>
              <span>{compilerName ? `[${compilerName}] ./program` : './program'}</span>
            </div>

            {/* Running Indicator */}
            {isRunning && (
              <div className="flex items-center gap-2 text-[#00C8FF] py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-[12.5px] font-sans font-medium">Compiling & executing source code in sandbox…</span>
              </div>
            )}

            {/* Standard Output (stdout) */}
            {stdout && (
              <pre className="text-[#4ADE80] font-mono whitespace-pre-wrap break-words !bg-transparent !p-0 !m-0 !border-0 leading-relaxed">
                {stdout}
              </pre>
            )}

            {/* Standard Error / Compiler Error (stderr) */}
            {stderr && (
              <pre className="text-[#F87171] font-mono whitespace-pre-wrap break-words !bg-transparent !p-0 !m-0 !border-0 leading-relaxed">
                {stderr}
              </pre>
            )}

            {/* Empty Output Case */}
            {!isRunning && !stdout && !stderr && exitCode === 0 && (
              <div className="text-[#888] italic py-1 font-sans text-xs">[Program finished successfully with no standard output]</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
