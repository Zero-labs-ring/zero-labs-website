'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { getOrCreateUserUid } from '@/lib/storage/identity';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    signInWithEmail: (email: string, password: string) => Promise<{ error: { message: string } | null }>;
    signUpWithEmail: (email: string, password: string, name?: string) => Promise<{ error: { message: string } | null; user: User | null }>;
    signInWithGoogle: () => Promise<{ error: { message: string } | null }>;
    forgotPassword: (email: string) => Promise<{ error: { message: string } | null }>;
    updatePassword: (password: string) => Promise<{ error: { message: string } | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Helper to migrate guest sessions to the authenticated user ID
    const migrateGuestSessions = useCallback(async (authUserId: string) => {
        try {
            const guestUid = getOrCreateUserUid();
            if (guestUid && guestUid !== authUserId) {
                await fetch('/api/auth/migrate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        guestUid,
                        authUserId,
                    }),
                });
            }
        } catch (err) {
            console.warn('Failed to migrate guest sessions:', err);
        }
    }, []);

    useEffect(() => {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) {
            setIsLoading(false);
            return;
        }

        // 1. Initial session check
        supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
            setSession(initialSession);
            setUser(initialSession?.user ?? null);
            setIsLoading(false);
            if (initialSession?.user?.id) {
                migrateGuestSessions(initialSession.user.id);
            }
        });

        // 2. Real-time auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            setIsLoading(false);

            if (event === 'SIGNED_IN' && currentSession?.user?.id) {
                await migrateGuestSessions(currentSession.user.id);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [migrateGuestSessions]);

    // Sign in with Email & Password (with automatic auto-confirm recovery)
    const signInWithEmail = async (email: string, password: string): Promise<{ error: { message: string } | null }> => {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) {
            return { error: { message: 'Supabase client is not configured' } };
        }

        const cleanEmail = email.trim().toLowerCase();

        let { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
        });

        // If email confirmation is holding back this account, auto-confirm on backend and retry!
        if (error && (error.message.toLowerCase().includes('email not confirmed') || error.message.toLowerCase().includes('not confirmed'))) {
            try {
                const confirmRes = await fetch('/api/auth/auto-confirm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: cleanEmail }),
                });

                if (confirmRes.ok) {
                    const retryResult = await supabase.auth.signInWithPassword({
                        email: cleanEmail,
                        password,
                    });
                    data = retryResult.data;
                    error = retryResult.error;
                }
            } catch (autoErr) {
                console.warn('Auto-confirm retry warning:', autoErr);
            }
        }

        if (!error && data.user) {
            setUser(data.user);
            setSession(data.session);
            await migrateGuestSessions(data.user.id);
            return { error: null };
        }

        const friendlyMsg = error?.message?.includes('Invalid login credentials')
            ? 'Invalid email or password. Please check your credentials.'
            : (error?.message || 'Failed to sign in.');

        return { error: { message: friendlyMsg } };
    };

    // Sign up with Email & Password (server-side creation with pre-verified email)
    const signUpWithEmail = async (
        email: string,
        password: string,
        name?: string
    ): Promise<{ error: { message: string } | null; user: User | null }> => {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) {
            return { error: { message: 'Supabase client is not configured' }, user: null };
        }

        const cleanEmail = email.trim().toLowerCase();

        try {
            // 1. Call server-side verified account creation route
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: cleanEmail,
                    password,
                    name: name || cleanEmail.split('@')[0],
                }),
            });

            const result = await res.json();

            if (!res.ok || result.error) {
                return { error: { message: result.error || 'Failed to create account.' }, user: null };
            }

            // 2. Automatically sign in with client to establish session
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email: cleanEmail,
                password,
            });

            if (loginError) {
                // If auto-confirm is needed
                await fetch('/api/auth/auto-confirm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: cleanEmail }),
                });

                const retryLogin = await supabase.auth.signInWithPassword({
                    email: cleanEmail,
                    password,
                });

                if (retryLogin.error) {
                    return { error: { message: 'Account created! Please log in with your credentials.' }, user: null };
                }

                if (retryLogin.data.user) {
                    setUser(retryLogin.data.user);
                    setSession(retryLogin.data.session);
                    await migrateGuestSessions(retryLogin.data.user.id);
                    return { error: null, user: retryLogin.data.user };
                }
            }

            if (loginData?.user) {
                setUser(loginData.user);
                setSession(loginData.session);
                await migrateGuestSessions(loginData.user.id);
                return { error: null, user: loginData.user };
            }

            return { error: null, user: null };
        } catch (err: any) {
            console.error('Sign up error:', err);
            return { error: { message: err.message || 'An unexpected error occurred during signup.' }, user: null };
        }
    };

    // Google OAuth
    const signInWithGoogle = async (): Promise<{ error: { message: string } | null }> => {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) {
            return { error: { message: 'Supabase client is not configured' } };
        }
        const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '';
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        });
        return { error: error ? { message: error.message } : null };
    };

    // Send Forgot Password Email Link
    const forgotPassword = async (email: string): Promise<{ error: { message: string } | null }> => {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) {
            return { error: { message: 'Supabase client is not configured' } };
        }
        const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/chat?view=reset-password` : '';
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
            redirectTo,
        });
        return { error: error ? { message: error.message } : null };
    };

    // Update password (for users arriving via password reset link)
    const updatePassword = async (password: string): Promise<{ error: { message: string } | null }> => {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) {
            return { error: { message: 'Supabase client is not configured' } };
        }
        const { error } = await supabase.auth.updateUser({
            password,
        });
        return { error: error ? { message: error.message } : null };
    };

    // Sign out
    const signOut = async () => {
        const supabase = getSupabaseBrowserClient();
        if (supabase) {
            await supabase.auth.signOut();
        }
        setUser(null);
        setSession(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                isLoading,
                signInWithEmail,
                signUpWithEmail,
                signInWithGoogle,
                forgotPassword,
                updatePassword,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
