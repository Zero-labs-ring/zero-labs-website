'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, X, Lock, CheckCircle2 } from 'lucide-react';

interface SoftGateModalProps {
    isOpen: boolean;
    isHardLimit?: boolean;
    usedCount?: number;
    maxTrials?: number;
    onSignIn: () => void;
    onSignInLater?: () => void;
}

export function SoftGateModal({
    isOpen,
    isHardLimit = false,
    usedCount = 5,
    maxTrials = 5,
    onSignIn,
    onSignInLater,
}: SoftGateModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[105] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={!isHardLimit && onSignInLater ? onSignInLater : undefined}
                />

                {/* Modal Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 12 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 320 }}
                    className="relative w-full max-w-md bg-[#FBFBF9] border border-[#E5E4DF] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.22)] p-7 sm:p-8 overflow-hidden z-10 font-sans text-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button (only if not hard limit) */}
                    {!isHardLimit && onSignInLater && (
                        <button
                            type="button"
                            onClick={onSignInLater}
                            className="absolute top-5 right-5 p-1.5 rounded-full text-[#111]/40 hover:text-[#111] hover:bg-[#ECEAE4] transition-all cursor-pointer"
                            title="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}

                    {/* Badge Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-[#00C8FF]/10 border border-[#00C8FF]/20 flex items-center justify-center mx-auto mb-4 text-[#00C8FF]">
                        {isHardLimit ? <Lock className="w-6 h-6 text-[#111]" /> : <Sparkles className="w-6 h-6 text-[#00C8FF]" />}
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111]/5 border border-[#111111]/10 text-xs font-semibold text-[#111]/80 mb-3">
                        <span>Free Guest Trials: {Math.min(usedCount, maxTrials)}/{maxTrials} Used</span>
                    </div>

                    <h2 className="text-[21px] font-bold tracking-tight text-[#111] mb-2">
                        {isHardLimit ? 'Free Trial Limit Reached' : 'Unlock Unlimited Access'}
                    </h2>

                    <p className="text-xs sm:text-[13.5px] text-[#111]/70 leading-relaxed mb-5">
                        {isHardLimit
                            ? "You've used all 5 free guest messages. Sign in or create a free account to unlock unlimited messages, persistent memory, and history sync!"
                            : "Create a free account or sign in to get unlimited messages, persistent memory, and sync across all your devices."}
                    </p>

                    {/* Feature Highlights */}
                    <div className="bg-white/70 border border-[#E5E4DF] rounded-2xl p-3.5 mb-6 text-left flex flex-col gap-2">
                        <div className="flex items-center gap-2.5 text-xs text-[#111]/80 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                            <span><strong>Unlimited Messages</strong> & full 128K context</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-[#111]/80 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                            <span>Persistent Memory & Project Organization</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-[#111]/80 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                            <span>Multi-Session Sync Across Devices</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2.5">
                        <button
                            type="button"
                            onClick={onSignIn}
                            className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-[#111111] text-white font-semibold text-[14px] hover:bg-[#222] shadow-sm transition-all cursor-pointer"
                        >
                            <span>Sign in for Unlimited Free Access</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>

                        {!isHardLimit && onSignInLater && (
                            <button
                                type="button"
                                onClick={onSignInLater}
                                className="w-full flex items-center justify-center h-10 rounded-xl bg-transparent text-[#111]/60 hover:text-[#111] hover:bg-[#ECEAE4] font-medium text-xs transition-all cursor-pointer"
                            >
                                Continue as guest ({Math.max(0, maxTrials - usedCount)} trials left)
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
