'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Loader2, CheckCircle2, AlertCircle, ArrowRight, Eye, EyeOff, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export type AuthModalView = 'login' | 'signup' | 'forgot-password' | 'reset-password';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialView?: AuthModalView;
    onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, initialView = 'login', onSuccess }: AuthModalProps) {
    const { signInWithEmail, signUpWithEmail, signInWithGoogle, forgotPassword, updatePassword } = useAuth();

    const [view, setView] = useState<AuthModalView>(initialView);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setView(initialView);
            setErrorMessage(null);
            setSuccessMessage(null);
            setPassword('');
            setConfirmPassword('');
        }
    }, [isOpen, initialView]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);
        setIsLoading(true);

        try {
            if (view === 'login') {
                if (!email || !password) {
                    setErrorMessage('Please enter both your email and password.');
                    setIsLoading(false);
                    return;
                }
                const { error } = await signInWithEmail(email, password);
                if (error) {
                    setErrorMessage(error.message || 'Invalid email or password.');
                } else {
                    setSuccessMessage('Welcome back! Logging you in…');
                    setTimeout(() => {
                        if (onSuccess) onSuccess();
                        onClose();
                    }, 800);
                }
            } else if (view === 'signup') {
                if (!email || !password || !confirmPassword) {
                    setErrorMessage('Please fill in all required fields.');
                    setIsLoading(false);
                    return;
                }
                if (password.length < 6) {
                    setErrorMessage('Password must be at least 6 characters.');
                    setIsLoading(false);
                    return;
                }
                if (password !== confirmPassword) {
                    setErrorMessage('Passwords do not match.');
                    setIsLoading(false);
                    return;
                }
                const { error } = await signUpWithEmail(email, password, name);
                if (error) {
                    setErrorMessage(error.message || 'Failed to create account.');
                } else {
                    setSuccessMessage('Account created successfully! Welcome to Zero AI.');
                    setTimeout(() => {
                        if (onSuccess) onSuccess();
                        onClose();
                    }, 1000);
                }
            } else if (view === 'forgot-password') {
                if (!email) {
                    setErrorMessage('Please enter your email address.');
                    setIsLoading(false);
                    return;
                }
                const { error } = await forgotPassword(email);
                if (error) {
                    setErrorMessage(error.message || 'Failed to send reset link.');
                } else {
                    setSuccessMessage('Password reset link sent! Check your inbox & spam folder.');
                }
            } else if (view === 'reset-password') {
                if (!password || !confirmPassword) {
                    setErrorMessage('Please fill in both password fields.');
                    setIsLoading(false);
                    return;
                }
                if (password.length < 6) {
                    setErrorMessage('Password must be at least 6 characters.');
                    setIsLoading(false);
                    return;
                }
                if (password !== confirmPassword) {
                    setErrorMessage('Passwords do not match.');
                    setIsLoading(false);
                    return;
                }
                const { error } = await updatePassword(password);
                if (error) {
                    setErrorMessage(error.message || 'Failed to update password.');
                } else {
                    setSuccessMessage('Password successfully updated! Logging you in…');
                    setTimeout(() => {
                        if (onSuccess) onSuccess();
                        onClose();
                    }, 1000);
                }
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setErrorMessage(null);
        setIsGoogleLoading(true);
        try {
            const { error } = await signInWithGoogle();
            if (error) {
                setErrorMessage(error.message || 'Failed to connect with Google.');
                setIsGoogleLoading(false);
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'Failed to connect with Google.');
            setIsGoogleLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-md"
                    onClick={onClose}
                />

                {/* Modal Window */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 320 }}
                    className="relative w-full max-w-md bg-[#FBFBF9] border border-[#E5E4DF] rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.25)] p-7 sm:p-8 overflow-hidden z-10 font-sans"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-5 right-5 p-1.5 rounded-full text-[#111]/40 hover:text-[#111] hover:bg-[#ECEAE4] transition-all cursor-pointer"
                        title="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Header with Zero Logo */}
                    <div className="flex flex-col items-center text-center mb-5">
                        <img
                            src="/logo.png?v=2"
                            alt="Zero"
                            className="h-9 object-contain mb-3"
                            draggable="false"
                        />
                        <h2 className="text-[21px] font-bold tracking-tight text-[#111]">
                            {view === 'login' && 'Welcome back'}
                            {view === 'signup' && 'Create your Zero account'}
                            {view === 'forgot-password' && 'Reset your password'}
                            {view === 'reset-password' && 'Set new password'}
                        </h2>
                        <p className="text-xs text-[#111]/60 mt-1">
                            {view === 'login' && 'Sign in to access your models, chats, and API keys'}
                            {view === 'signup' && 'Instant access to high-speed Titan models & unlimited memory'}
                            {view === 'forgot-password' && 'We’ll email you a secure link to reset it'}
                            {view === 'reset-password' && 'Enter your new password below'}
                        </p>
                    </div>

                    {/* Feedback Messages */}
                    {errorMessage && (
                        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* Google OAuth Button */}
                    {(view === 'login' || view === 'signup') && (
                        <>
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={isGoogleLoading || isLoading}
                                className="w-full flex items-center justify-center gap-3 h-11 rounded-xl bg-white border border-[#E5E4DF] text-xs font-semibold text-[#111] hover:bg-[#F3F2EE] hover:border-[#D5D4CE] shadow-sm transition-all cursor-pointer disabled:opacity-50"
                            >
                                {isGoogleLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-[#00C8FF]" />
                                ) : (
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                        />
                                    </svg>
                                )}
                                <span>Continue with Google</span>
                            </button>

                            <div className="flex items-center gap-3 my-3">
                                <div className="h-px bg-[#E5E4DF] flex-1" />
                                <span className="text-[11px] font-medium text-[#111]/40 uppercase tracking-wider">or</span>
                                <div className="h-px bg-[#E5E4DF] flex-1" />
                            </div>
                        </>
                    )}

                    {/* Email Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        {view === 'signup' && (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[12px] font-semibold text-[#111]/70">Full Name</label>
                                <div className="relative flex items-center">
                                    <UserIcon className="absolute left-3 w-4 h-4 text-[#111]/40" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Alex Mercer"
                                        className="w-full h-11 pl-9 pr-3 rounded-xl bg-white border border-[#E5E4DF] text-xs text-[#111] placeholder:text-[#111]/40 outline-none focus:border-[#00C8FF] transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {view !== 'reset-password' && (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[12px] font-semibold text-[#111]/70">Email address</label>
                                <div className="relative flex items-center">
                                    <Mail className="absolute left-3 w-4 h-4 text-[#111]/40" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full h-11 pl-9 pr-3 rounded-xl bg-white border border-[#E5E4DF] text-xs text-[#111] placeholder:text-[#111]/40 outline-none focus:border-[#00C8FF] transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {view !== 'forgot-password' && (
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-[12px] font-semibold text-[#111]/70">
                                        {view === 'reset-password' ? 'New Password' : 'Password'}
                                    </label>
                                    {view === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setView('forgot-password');
                                                setErrorMessage(null);
                                                setSuccessMessage(null);
                                            }}
                                            className="text-[11.5px] font-semibold text-[#00C8FF] hover:underline cursor-pointer"
                                        >
                                            Forgot password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative flex items-center">
                                    <Lock className="absolute left-3 w-4 h-4 text-[#111]/40" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full h-11 pl-9 pr-10 rounded-xl bg-white border border-[#E5E4DF] text-xs text-[#111] placeholder:text-[#111]/40 outline-none focus:border-[#00C8FF] transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((p) => !p)}
                                        className="absolute right-3 p-1 text-[#111]/40 hover:text-[#111] cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {(view === 'signup' || view === 'reset-password') && (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[12px] font-semibold text-[#111]/70">Confirm password</label>
                                <div className="relative flex items-center">
                                    <Lock className="absolute left-3 w-4 h-4 text-[#111]/40" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full h-11 pl-9 pr-3 rounded-xl bg-white border border-[#E5E4DF] text-xs text-[#111] placeholder:text-[#111]/40 outline-none focus:border-[#00C8FF] transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || isGoogleLoading}
                            className="mt-2 w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-[#111111] text-white font-semibold text-[13.5px] hover:bg-[#222] shadow-sm transition-all cursor-pointer disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin text-[#00C8FF]" />
                            ) : (
                                <>
                                    <span>
                                        {view === 'login' && 'Log In'}
                                        {view === 'signup' && 'Create Account'}
                                        {view === 'forgot-password' && 'Send Reset Link'}
                                        {view === 'reset-password' && 'Update Password'}
                                    </span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Bottom Switch Links */}
                    <div className="mt-5 text-center text-xs text-[#111]/60">
                        {view === 'login' && (
                            <>
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setView('signup');
                                        setErrorMessage(null);
                                        setSuccessMessage(null);
                                    }}
                                    className="font-semibold text-[#00C8FF] hover:underline cursor-pointer"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                        {view === 'signup' && (
                            <>
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setView('login');
                                        setErrorMessage(null);
                                        setSuccessMessage(null);
                                    }}
                                    className="font-semibold text-[#00C8FF] hover:underline cursor-pointer"
                                >
                                    Log In
                                </button>
                            </>
                        )}
                        {(view === 'forgot-password' || view === 'reset-password') && (
                            <button
                                type="button"
                                onClick={() => {
                                    setView('login');
                                    setErrorMessage(null);
                                    setSuccessMessage(null);
                                }}
                                className="font-semibold text-[#00C8FF] hover:underline cursor-pointer"
                            >
                                Back to Log In
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
