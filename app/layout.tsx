import type { Metadata } from 'next';
import './globals.css';
import 'katex/dist/katex.min.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.zerolabs.live'),
  alternates: {
    canonical: '/',
  },
  title: 'Zero AI — Real-Time Intelligence',
  description: 'AI assistant powered by Zero Ring & Titan models',
  icons: {
    icon: [
      { url: '/logo.png?v=2', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/logo.png?v=2',
    apple: '/logo.png?v=2',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
