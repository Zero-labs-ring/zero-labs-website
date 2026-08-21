'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { getOrCreateUserUid } from '@/lib/storage/identity';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function handleAuthCallback() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        setStatus('error');
        setErrorMsg('Supabase is not configured properly.');
        return;
      }

      const code = searchParams.get('code');
      const next = searchParams.get('next') || '/chat';

      try {
        let activeUser = null;

        // 1. If an auth code is present in the URL query params, exchange it for a session
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error('Error exchanging OAuth code:', error);
            // Fall back to getSession just in case client already exchanged it
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData?.session?.user) {
              activeUser = sessionData.session.user;
            } else {
              throw error;
            }
          } else {
            activeUser = data.user;
          }
        } else {
          // Check if session is already stored or available from hash tokens
          const { data: sessionData } = await supabase.auth.getSession();
          activeUser = sessionData?.session?.user || null;
        }

        if (activeUser && isMounted) {
          setStatus('success');

          // Migrate any anonymous guest chats to this user ID
          const guestUid = getOrCreateUserUid();
          if (guestUid && guestUid !== activeUser.id) {
            try {
              await fetch('/api/auth/migrate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  guestUid,
                  authUserId: activeUser.id,
                }),
              });
            } catch (migErr) {
              console.warn('Callback guest migration warning:', migErr);
            }
          }

          // Redirect to the intended destination
          setTimeout(() => {
            router.replace(next);
          }, 800);
        } else {
          // If no code and no immediate session, give onAuthStateChange a moment
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user && isMounted) {
              setStatus('success');
              subscription.unsubscribe();
              router.replace(next);
            }
          });

          // Timeout fallback to redirect
          setTimeout(() => {
            if (isMounted) {
              router.replace(next);
            }
          }, 2000);
        }
      } catch (err: any) {
        console.error('Auth callback handling error:', err);
        if (isMounted) {
          setStatus('error');
          setErrorMsg(err.message || 'Authentication exchange failed.');
        }
      }
    }

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm p-8 rounded-3xl bg-[#141414] border border-white/10 shadow-2xl flex flex-col items-center text-center">
        <img
          src="/logo.png?v=2"
          alt="Zero Logo"
          className="h-10 object-contain mb-6 filter invert"
          draggable="false"
        />

        {status === 'loading' && (
          <>
            <div className="w-12 h-12 rounded-2xl bg-[#00C8FF]/10 border border-[#00C8FF]/30 flex items-center justify-center mb-4">
              <Loader2 className="w-6 h-6 text-[#00C8FF] animate-spin" />
            </div>
            <h2 className="text-lg font-bold tracking-tight mb-1">Authenticating...</h2>
            <p className="text-xs text-white/50">Securing your session and connecting to Zero AI</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold tracking-tight mb-1">Signed in successfully!</h2>
            <p className="text-xs text-white/50">Redirecting to your workspace…</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-rose-400" />
            </div>
            <h2 className="text-lg font-bold tracking-tight mb-1">Sign in failed</h2>
            <p className="text-xs text-rose-300/80 mb-6">{errorMsg || 'Could not complete sign in'}</p>
            <button
              type="button"
              onClick={() => router.replace('/chat')}
              className="w-full h-10 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-all cursor-pointer"
            >
              Return to Chat
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-[#00C8FF] animate-spin" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
