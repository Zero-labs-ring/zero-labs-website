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

  const effectiveUid = userUid || getOrCreateUserUid();
  const storageKey = `${MEMORY_STORAGE_KEY}_${effectiveUid}`;
  const enabledKey = `${MEMORY_ENABLED_KEY}_${effectiveUid}`;
  const instructionsKey = `${CUSTOM_INSTRUCTIONS_KEY}_${effectiveUid}`;

  useEffect(() => {
    try {
      const storedMem = localStorage.getItem(storageKey);
      if (storedMem) {
        const parsed = JSON.parse(storedMem);
        if (Array.isArray(parsed)) setMemories(parsed);
      } else {
        // Default starter memory items
        const defaultItems: MemoryItem[] = [
          {
            id: 'mem-1',
            content: 'Prefers clear, modern, clean, and concise technical responses',
            category: 'preference',
            created_at: new Date().toISOString(),
          },
          {
            id: 'mem-2',
            content: 'Primary language stack: TypeScript, Next.js, Tailwind CSS, Python',
            category: 'fact',
            created_at: new Date().toISOString(),
          },
        ];
        setMemories(defaultItems);
        localStorage.setItem(storageKey, JSON.stringify(defaultItems));
      }

      const storedEnabled = localStorage.getItem(enabledKey);
      if (storedEnabled !== null) {
        setMemoryEnabled(storedEnabled === 'true');
      }

      const storedInst = localStorage.getItem(instructionsKey);
      if (storedInst) {
        setCustomInstructions(storedInst);
      }
    } catch (e) {
      console.warn('Failed to load memory settings from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey, enabledKey, instructionsKey]);

  const addMemory = useCallback((content: string, category: 'preference' | 'fact' | 'instruction' = 'preference') => {
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
  }, [storageKey]);

  const removeMemory = useCallback((id: string) => {
    setMemories(prev => {
      const updated = prev.filter(m => m.id !== id);
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [storageKey]);

  const clearAllMemories = useCallback(() => {
    setMemories([]);
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  }, [storageKey]);

  const toggleMemoryEnabled = useCallback((enabled: boolean) => {
    setMemoryEnabled(enabled);
    try {
      localStorage.setItem(enabledKey, enabled ? 'true' : 'false');
    } catch {}
  }, [enabledKey]);

  const updateCustomInstructions = useCallback((instructions: string) => {
    setCustomInstructions(instructions);
    try {
      localStorage.setItem(instructionsKey, instructions);
    } catch {}
  }, [instructionsKey]);

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
