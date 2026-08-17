'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Moon, Sun, Download, Trash2, Cpu, Mic, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getOrCreateUserUid } from '@/lib/storage/identity';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearHistory: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  onClearHistory,
}: SettingsModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'models' | 'speech' | 'data'>('general');
  
  // App preferences
  const [defaultModel, setDefaultModel] = useState('Titan Pro');
  const [webSearchDefault, setWebSearchDefault] = useState(false);
  const [autoSendSpeech, setAutoSendSpeech] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    try {
      const storedModel = localStorage.getItem('zero_default_model');
      if (storedModel) setDefaultModel(storedModel);

      const storedWeb = localStorage.getItem('zero_default_web_search');
      if (storedWeb !== null) setWebSearchDefault(storedWeb === 'true');

      const storedAutoSend = localStorage.getItem('zero_autosend_speech');
      if (storedAutoSend !== null) setAutoSendSpeech(storedAutoSend === 'true');
    } catch {}
  }, [isOpen]);

  const handleSave = () => {
    try {
      localStorage.setItem('zero_default_model', defaultModel);
      localStorage.setItem('zero_default_web_search', webSearchDefault ? 'true' : 'false');
      localStorage.setItem('zero_autosend_speech', autoSendSpeech ? 'true' : 'false');
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2000);
    } catch {}
  };

  const handleExportData = () => {
    const uid = user?.id || getOrCreateUserUid();
    window.open(`/api/export/training-data?uid=${encodeURIComponent(uid)}`, '_blank');
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
                <Settings className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#111]">Application Settings</h2>
                <p className="text-[11.5px] text-[#111]/50">
                  Configure model parameters, speech recognition, and privacy
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

          {/* Navigation Bar */}
          <div className="flex items-center gap-2 px-6 pt-3 pb-2 bg-[#F9F8F5] border-b border-[#E5E4DF] overflow-x-auto">
            {[
              { id: 'general', label: 'General' },
              { id: 'models', label: 'AI Models' },
              { id: 'speech', label: 'Voice & Speech' },
              { id: 'data', label: 'Data & Privacy' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-[#111] shadow-xs border border-[#E5E4DF]'
                    : 'text-[#111]/60 hover:text-[#111]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto flex-1 min-h-[300px] text-xs">
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F9F8F5] border border-[#E5E4DF]">
                  <div>
                    <div className="font-bold text-[#111]">Auto-enable Web Search</div>
                    <div className="text-[11px] text-[#111]/50 mt-0.5">
                      Automatically activate live search index for every new conversation
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={webSearchDefault}
                    onChange={(e) => setWebSearchDefault(e.target.checked)}
                    className="w-4 h-4 accent-[#00C8FF] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F9F8F5] border border-[#E5E4DF]">
                  <div>
                    <div className="font-bold text-[#111]">Keyboard Shortcuts</div>
                    <div className="text-[11px] text-[#111]/50 mt-0.5">
                      Use <kbd className="px-1.5 py-0.5 bg-white border border-[#E0E0DB] rounded font-mono">⌘K</kbd> to search chats, <kbd className="px-1.5 py-0.5 bg-white border border-[#E0E0DB] rounded font-mono">Enter</kbd> to send
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#00C8FF]">Active</span>
                </div>
              </div>
            )}

            {activeTab === 'models' && (
              <div className="space-y-3">
                <div className="font-bold text-[#111] mb-1">Default AI Engine</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'Titan Pro',
                      title: 'Titan Pro',
                      desc: 'Lightning-fast, highly responsive reasoning & everyday coding.',
                      tag: 'Fast & Versatile',
                    },
                    {
                      id: 'Titan Ultra',
                      title: 'Titan Ultra',
                      desc: 'High-compute model for deep architectural design & complex math.',
                      tag: 'Deep Reasoning',
                    },
                  ].map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setDefaultModel(m.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        defaultModel === m.id
                          ? 'border-[#00C8FF] bg-[#00C8FF]/5 shadow-xs font-semibold'
                          : 'border-[#E5E4DF] bg-white hover:bg-[#F9F8F5]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-[#00C8FF]" />
                          <span className="text-xs font-bold text-[#111]">{m.title}</span>
                        </div>
                        {defaultModel === m.id && (
                          <span className="w-2 h-2 rounded-full bg-[#00C8FF]" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#111]/50 font-normal leading-relaxed">
                        {m.desc}
                      </p>
                      <div className="mt-2 text-[10px] uppercase tracking-wider font-bold text-[#00C8FF]">
                        {m.tag}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'speech' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F9F8F5] border border-[#E5E4DF]">
                  <div>
                    <div className="font-bold text-[#111]">Speech Recognition Provider</div>
                    <div className="text-[11px] text-[#111]/50 mt-0.5">
                      Real-time browser-native Web Speech STT with amplitude tracking
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600">Hardware Accelerated</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F9F8F5] border border-[#E5E4DF]">
                  <div>
                    <div className="font-bold text-[#111]">Auto-send on Speech Pause</div>
                    <div className="text-[11px] text-[#111]/50 mt-0.5">
                      Automatically transmit prompt when you finish talking
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoSendSpeech}
                    onChange={(e) => setAutoSendSpeech(e.target.checked)}
                    className="w-4 h-4 accent-[#00C8FF] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-[#F9F8F5] border border-[#E5E4DF] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#111]">Export All Chat Sessions</div>
                    <div className="text-[11px] text-[#111]/50 mt-0.5">
                      Download complete conversational dataset in JSONL format
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportData}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#ECEAE4] border border-[#E5E4DF] rounded-xl text-xs font-semibold text-[#111] shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#00C8FF]" />
                    <span>Export JSONL</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-rose-700">Clear All Chat History</div>
                    <div className="text-[11px] text-rose-600/70 mt-0.5">
                      Permanently wipe all locally cached conversations and artifacts
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete all chat history? This cannot be undone.')) {
                        onClearHistory();
                        onClose();
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Save */}
          <div className="px-6 py-3 bg-[#F9F8F5] border-t border-[#E5E4DF] flex items-center justify-between">
            <span className="text-[11px] text-[#111]/45">
              Settings persist across browser sessions
            </span>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-[#111] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              {savedNotice ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saved</span>
                </>
              ) : (
                <span>Save Preferences</span>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
