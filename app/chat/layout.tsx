import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zero AI — Chat',
  description: 'Ultra-fast intelligence with Titan Pro models, web search, memory, and code workspace.',
  icons: {
    icon: [
      { url: '/logo.png?v=2', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/logo.png?v=2',
    apple: '/logo.png?v=2',
  },
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
