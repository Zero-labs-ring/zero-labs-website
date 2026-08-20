import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const WANDBOX_COMPILERS: Record<string, { compiler: string; name: string }> = {
  c: { compiler: 'gcc-13.2.0-c', name: 'GCC 13.2.0 (C)' },
  cpp: { compiler: 'gcc-13.2.0', name: 'GCC 13.2.0 (C++)' },
  'c++': { compiler: 'gcc-13.2.0', name: 'GCC 13.2.0 (C++)' },
  cc: { compiler: 'gcc-13.2.0', name: 'GCC 13.2.0 (C++)' },
  cxx: { compiler: 'gcc-13.2.0', name: 'GCC 13.2.0 (C++)' },
  python: { compiler: 'cpython-3.12.7', name: 'Python 3.12.7' },
  python3: { compiler: 'cpython-3.12.7', name: 'Python 3.12.7' },
  py: { compiler: 'cpython-3.12.7', name: 'Python 3.12.7' },
  javascript: { compiler: 'nodejs-20.17.0', name: 'Node.js 20.17.0' },
  js: { compiler: 'nodejs-20.17.0', name: 'Node.js 20.17.0' },
  jsx: { compiler: 'nodejs-20.17.0', name: 'Node.js 20.17.0' },
  typescript: { compiler: 'typescript-5.6.2', name: 'TypeScript 5.6.2' },
  ts: { compiler: 'typescript-5.6.2', name: 'TypeScript 5.6.2' },
  tsx: { compiler: 'typescript-5.6.2', name: 'TypeScript 5.6.2' },
  java: { compiler: 'openjdk-jdk-21+35', name: 'OpenJDK 21' },
  rust: { compiler: 'rust-1.81.0', name: 'Rust 1.81.0' },
  rs: { compiler: 'rust-1.81.0', name: 'Rust 1.81.0' },
  go: { compiler: 'go-1.23.1', name: 'Go 1.23.1' },
  golang: { compiler: 'go-1.23.1', name: 'Go 1.23.1' },
  csharp: { compiler: 'dotnetcore-8.0.401', name: '.NET C# 8.0' },
  'c#': { compiler: 'dotnetcore-8.0.401', name: '.NET C# 8.0' },
  cs: { compiler: 'dotnetcore-8.0.401', name: '.NET C# 8.0' },
  php: { compiler: 'php-8.3.11', name: 'PHP 8.3.11' },
  ruby: { compiler: 'ruby-3.3.5', name: 'Ruby 3.3.5' },
  rb: { compiler: 'ruby-3.3.5', name: 'Ruby 3.3.5' },
  bash: { compiler: 'bash', name: 'GNU Bash' },
  sh: { compiler: 'bash', name: 'GNU Bash' },
  shell: { compiler: 'bash', name: 'GNU Bash' },
  lua: { compiler: 'lua-5.4.6', name: 'Lua 5.4.6' },
  sql: { compiler: 'sqlite-3.46.1', name: 'SQLite 3.46.1' },
  swift: { compiler: 'swift-5.10.1', name: 'Swift 5.10.1' },
  r: { compiler: 'r-4.4.1', name: 'R 4.4.1' },
};

function detectCompiler(language: string, code: string): { compiler: string; name: string } {
  const lang = language.toLowerCase().trim();
  if (WANDBOX_COMPILERS[lang]) {
    return WANDBOX_COMPILERS[lang];
  }

  // Automatic signature detection
  if (/#include\s*<iostream>|std::|cout\s*<<|namespace\s+std|template\s*</i.test(code)) {
    return WANDBOX_COMPILERS['cpp'];
  }
  if (/#include\s*<|int\s+main\s*\(|printf\s*\(|scanf\s*\(|void\s+main\s*\(/i.test(code)) {
    return WANDBOX_COMPILERS['c'];
  }
  if (/public\s+class\s+|System\.out\.print/i.test(code)) {
    return WANDBOX_COMPILERS['java'];
  }
  if (/def\s+[a-zA-Z0-9_]+\s*\(|import\s+sys|import\s+os|print\s*\(/i.test(code)) {
    return WANDBOX_COMPILERS['python'];
  }
  if (/console\.log|function\s+|const\s+|let\s+|var\s+/i.test(code)) {
    return WANDBOX_COMPILERS['javascript'];
  }
  if (/fn\s+main\s*\(|println!/i.test(code)) {
    return WANDBOX_COMPILERS['rust'];
  }
  if (/package\s+main|func\s+main\s*\(/i.test(code)) {
    return WANDBOX_COMPILERS['go'];
  }

  return WANDBOX_COMPILERS['c'];
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const { language = '', code = '', stdin = '' } = body;

    if (!code || !code.trim()) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    const { compiler, name: compilerName } = detectCompiler(language, code);

    // Call Wandbox high-speed compiler API
    const response = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        compiler,
        code,
        stdin: stdin || '',
      }),
    });

    const durationMs = Date.now() - startTime;

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        {
          error: `Execution service error: ${response.status}`,
          details: errText,
          durationMs,
        },
        { status: 502 }
      );
    }

    const result = await response.json();

    const compileError = result.compiler_error || result.compiler_message || '';
    const stdout = result.program_output || '';
    const stderr = result.program_error || compileError || '';
    const output = (stdout || stderr || result.program_message || '').trim();
    const exitCode = parseInt(result.status ?? '0', 10);

    return NextResponse.json({
      language,
      compiler,
      compilerName,
      stdout,
      stderr,
      output,
      exitCode: isNaN(exitCode) ? (stderr ? 1 : 0) : exitCode,
      durationMs,
    });
  } catch (err: any) {
    const durationMs = Date.now() - startTime;
    return NextResponse.json(
      {
        error: err.message || 'Failed to execute code',
        stderr: err.message || 'Execution error',
        exitCode: 1,
        durationMs,
      },
      { status: 500 }
    );
  }
}
