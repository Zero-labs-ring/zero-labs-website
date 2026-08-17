'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Plus, Trash2, X, Sparkles, ToggleLeft, ToggleRight, Check } from 'lucide-react';
import { MemoryItem } from '@/hooks/useMemory';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: MemoryItem[];
  memoryEnabled: boolean;
  customInstructions: string;
  onAddMemory: (content: string, category: 'preference' | 'fact' | 'instruction') => void;
  onRemoveMemory: (id: string) => void;
  onClearAll: () => void;
  onToggleEnabled: (enabled: boolean) => void;
  onUpdateInstructions: (instructions: string) => void;
}

export function MemoryModal({
  isOpen,
  onClose,
  memories,
  memoryEnabled,
  customInstructions,
  onAddMemory,
  onRemoveMemory,
  onClearAll,
  onToggleEnabled,
  onUpdateInstructions,
}: MemoryModalProps) {
  const [activeTab, setActiveTab] = useState<'memories' | 'instructions'>('memories');
  const [newMemoryText, setNewMemoryText] = useState('');
  const [instructionsText, setInstructionsText] = useState(customInstructions);
  const [hasSavedInstructions, setHasSavedInstructions] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryText.trim()) return;
    onAddMemory(newMemoryText.trim(), 'preference');
    setNewMemoryText('');
  };

  const handleSaveInstructions = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateInstructions(instructionsText);
    setHasSavedInstructions(true);
    setTimeout(() => setHasSavedInstructions(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E5E4DF] overflow-hidden z-10 flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E4DF]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#00C8FF]/10 text-[#00C8FF] flex items-center justify-center">
                <Brain className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#111]">Zero Memory & Personalization</h2>
                <p className="text-[11.5px] text-[#111]/50">
                  Manage details and rules Zero remembers across chats
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#111]/40 hover:text-[#111] hover:bg-[#F0F0F0]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center justify-between px-6 pt-3 pb-2 border-b border-[#E5E4DF]/60 bg-[#F9F8F5]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('memories')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'memories'
                    ? 'bg-white text-[#111] shadow-xs border border-[#E5E4DF]'
                    : 'text-[#111]/60 hover:text-[#111]'
                }`}
              >
                Learned Memories ({memories.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('instructions')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'instructions'
                    ? 'bg-white text-[#111] shadow-xs border border-[#E5E4DF]'
                    : 'text-[#111]/60 hover:text-[#111]'
                }`}
              >
                Custom Instructions
              </button>
            </div>

            {/* Global Memory Toggle */}
            <button
              type="button"
              onClick={() => onToggleEnabled(!memoryEnabled)}
              className="flex items-center gap-2 text-xs font-medium text-[#111]/75 hover:text-[#111]"
            >
              <span>Memory {memoryEnabled ? 'Enabled' : 'Paused'}</span>
              {memoryEnabled ? (
                <ToggleRight className="w-6 h-6 text-[#00C8FF]" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-[#111]/30" />
              )}
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto flex-1 min-h-[320px]">
            {activeTab === 'memories' ? (
              <div className="space-y-4">
                {/* Add New Memory Input */}
                <form onSubmit={handleAdd} className="flex gap-2">
                  <input
                    type="text"
                    value={newMemoryText}
                    onChange={(e) => setNewMemoryText(e.target.value)}
                    placeholder="Remember something (e.g. 'I work in Next.js', 'Always reply concisely')..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-[#E5E4DF] text-xs text-[#111] outline-none focus:border-[#00C8FF]"
                  />
                  <button
                    type="submit"
                    disabled={!newMemoryText.trim()}
                    className="px-4 py-2 rounded-xl bg-[#111] hover:bg-black text-white text-xs font-semibold disabled:opacity-40 flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </form>

                {/* List of Memories */}
                <div className="space-y-2 pt-2">
                  {memories.length === 0 ? (
                    <div className="py-12 text-center text-xs text-[#111]/45">
                      No memories stored yet. Zero will automatically remember facts you share in conversations.
                    </div>
                  ) : (
                    memories.map((mem) => (
                      <div
                        key={mem.id}
                        className="flex items-start justify-between gap-3 p-3 rounded-xl bg-[#F9F8F5] border border-[#E5E4DF] text-xs"
                      >
                        <div className="flex items-start gap-2.5 flex-1">
                          <Sparkles className="w-3.5 h-3.5 text-[#00C8FF] shrink-0 mt-0.5" />
                          <span className="text-[#111] font-medium leading-relaxed">
                            {mem.content}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveMemory(mem.id)}
                          className="p-1 rounded text-[#111]/40 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Delete memory"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {memories.length > 0 && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={onClearAll}
                      className="text-xs text-rose-500 hover:underline font-medium"
                    >
                      Clear all memories
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Custom Instructions Form */
              <form onSubmit={handleSaveInstructions} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#111] mb-1">
                    What would you like Zero to know about you to provide better responses?
                  </label>
                  <textarea
                    value={instructionsText}
                    onChange={(e) => setInstructionsText(e.target.value)}
                    placeholder="e.g. I am a software engineer building distributed apps with React and Go. Keep explanations direct and prioritize production-ready code..."
                    rows={6}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E4DF] text-xs text-[#111] outline-none focus:border-[#00C8FF] leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-[11.5px] text-[#111]/50">
                    These instructions will be included in the context of every new chat.
                  </p>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#111] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    {hasSavedInstructions ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <span>Save Instructions</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
