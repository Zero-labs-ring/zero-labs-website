'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MessageSquare, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { ChatSession } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  onSelectSession: (sessionId: string) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  sessions,
  onSelectSession,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const filteredSessions = useMemo(() => {
    if (!query.trim()) {
      return sessions.slice(0, 10);
    }
    const q = query.toLowerCase();
    return sessions.filter((s) => s.title.toLowerCase().includes(q));
  }, [sessions, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < filteredSessions.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredSessions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSessions[selectedIndex]) {
        onSelectSession(filteredSessions[selectedIndex].id);
        onClose();
      }
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-start justify-center pt-16 sm:pt-24 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E5E4DF] overflow-hidden z-10 flex flex-col font-sans"
        >
          {/* Top Search Input */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E5E4DF]">
            <Search className="w-5 h-5 text-[#00C8FF] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search chat history, topics, or prompts..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-[#111] placeholder:text-[#111]/40 font-medium"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-md text-[#111]/40 hover:text-[#111] hover:bg-[#F0F0F0]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold text-[#111]/40 bg-[#F4F4F0] border border-[#E0E0DB] rounded">
              ESC
            </kbd>
          </div>

          {/* List of Results */}
          <div className="max-h-[380px] overflow-y-auto p-2">
            {filteredSessions.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <p className="text-xs font-semibold text-[#111]/60">No conversations found</p>
                <p className="text-[11px] text-[#111]/40 mt-1">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-[#111]/40 flex items-center justify-between">
                  <span>{query ? 'Search Results' : 'Recent Chats'}</span>
                  <span>{filteredSessions.length} items</span>
                </div>

                {filteredSessions.map((session, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={session.id}
                      onClick={() => {
                        onSelectSession(session.id);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#00C8FF]/10 text-[#111] font-semibold border border-[#00C8FF]/30'
                          : 'hover:bg-[#F8F7F3] text-[#111]/80 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-[#00C8FF] text-white shadow-xs'
                              : 'bg-[#F0EEE9] text-[#111]/60'
                          }`}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col min-w-0 truncate">
                          <span className="text-xs truncate">{session.title}</span>
                          <div className="flex items-center gap-2 text-[10.5px] text-[#111]/45">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(session.updated_at || session.created_at)}
                            </span>
                            <span>•</span>
                            <span className="capitalize">{session.model || 'Titan Pro'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-[#00C8FF] shrink-0">
                        {isSelected && (
                          <>
                            <span className="text-[10px] font-bold hidden sm:inline">Jump</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Helper */}
          <div className="px-4 py-2.5 bg-[#F9F8F5] border-t border-[#E5E4DF] flex items-center justify-between text-[11px] text-[#111]/50">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00C8FF]" />
              <span>Zero Global Spotlight</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Navigate <kbd className="px-1.5 py-0.5 bg-white border border-[#E0E0DB] rounded text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-[#E0E0DB] rounded text-[10px]">↓</kbd></span>
              <span>Select <kbd className="px-1.5 py-0.5 bg-white border border-[#E0E0DB] rounded text-[10px]">↵</kbd></span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
