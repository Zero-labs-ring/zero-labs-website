'use client';

import { useState, useEffect, useCallback } from 'react';
import { getOrCreateUserUid } from '@/lib/storage/identity';

export interface MemoryItem {
  id: string;
  content: string;
  category: 'preference' | 'fact' | 'instruction';
  created_at: string;
}

const MEMORY_STORAGE_KEY = 'zero_ai_memory_items';
const MEMORY_ENABLED_KEY = 'zero_ai_memory_enabled';
const CUSTOM_INSTRUCTIONS_KEY = 'zero_custom_instructions';

export function useMemory(userUid?: string | null) {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [memoryEnabled, setMemoryEnabled] = useState<boolean>(true);
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Strictly enforce storage key ONLY for authenticated users
  const storageKey = userUid ? `${MEMORY_STORAGE_KEY}_${userUid}` : null;
  const enabledKey = userUid ? `${MEMORY_ENABLED_KEY}_${userUid}` : null;
  const instructionsKey = userUid ? `${CUSTOM_INSTRUCTIONS_KEY}_${userUid}` : null;

  useEffect(() => {
    // If user is not logged in, clear memory in memory state and do NOT persist to storage
    if (!userUid || !storageKey || !enabledKey || !instructionsKey) {
      setMemories([]);
      setCustomInstructions('');
      setMemoryEnabled(false);
      setIsLoaded(true);
      return;
    }

    try {
      const storedMem = localStorage.getItem(storageKey);
      if (storedMem) {
        const parsed = JSON.parse(storedMem);
        if (Array.isArray(parsed)) setMemories(parsed);
      } else {
        setMemories([]);
      }

      const storedEnabled = localStorage.getItem(enabledKey);
      if (storedEnabled !== null) {
        setMemoryEnabled(storedEnabled === 'true');
      } else {
        setMemoryEnabled(true);
      }

      const storedInst = localStorage.getItem(instructionsKey);
      if (storedInst) {
        setCustomInstructions(storedInst);
      } else {
        setCustomInstructions('');
      }
    } catch (e) {
      console.warn('Failed to load memory settings from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, [userUid, storageKey, enabledKey, instructionsKey]);

  const addMemory = useCallback((content: string, category: 'preference' | 'fact' | 'instruction' = 'preference') => {
    // Do not store memory if user is not logged in
    if (!userUid || !storageKey) return;

    const trimmed = content.trim();
    if (!trimmed) return;

    const newItem: MemoryItem = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      content: trimmed,
      category,
      created_at: new Date().toISOString(),
    };

    setMemories(prev => {
      const updated = [newItem, ...prev];
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [userUid, storageKey]);

  const removeMemory = useCallback((id: string) => {
    if (!userUid || !storageKey) return;

    setMemories(prev => {
      const updated = prev.filter(m => m.id !== id);
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [userUid, storageKey]);

  const clearAllMemories = useCallback(() => {
    setMemories([]);
    if (storageKey) {
      try {
        localStorage.removeItem(storageKey);
      } catch {}
    }
  }, [storageKey]);

  const toggleMemoryEnabled = useCallback((enabled: boolean) => {
    if (!userUid || !enabledKey) return;

    setMemoryEnabled(enabled);
    try {
      localStorage.setItem(enabledKey, enabled ? 'true' : 'false');
    } catch {}
  }, [userUid, enabledKey]);

  const updateCustomInstructions = useCallback((instructions: string) => {
    if (!userUid || !instructionsKey) return;

    setCustomInstructions(instructions);
    try {
      localStorage.setItem(instructionsKey, instructions);
    } catch {}
  }, [userUid, instructionsKey]);

  return {
    memories,
    memoryEnabled,
    customInstructions,
    isLoaded,
    addMemory,
    removeMemory,
    clearAllMemories,
    toggleMemoryEnabled,
    updateCustomInstructions,
  };
}
