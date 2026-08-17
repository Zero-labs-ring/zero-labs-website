'use client';

import { useState, useEffect, useCallback } from 'react';
import { getOrCreateUserUid } from '@/lib/storage/identity';

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  sessionIds: string[];
  created_at: string;
  updated_at: string;
}

const PROJECTS_STORAGE_KEY = 'zero_ai_projects';

export const PROJECT_COLOR_OPTIONS = [
  '#00C8FF', // Cyan
  '#9333EA', // Purple
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#6366F1', // Indigo
];

export function useProjects(userUid?: string | null) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const effectiveUid = userUid || getOrCreateUserUid();
  const storageKey = `${PROJECTS_STORAGE_KEY}_${effectiveUid}`;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setProjects(parsed);
      } else {
        const defaultProjects: Project[] = [
          {
            id: 'proj-general',
            name: 'General Exploration',
            description: 'Workspace for general queries, daily tasks, and experiments.',
            color: '#00C8FF',
            sessionIds: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'proj-code',
            name: 'Engineering & Code',
            description: 'Full stack development, architectures, debugging, and review.',
            color: '#9333EA',
            sessionIds: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ];
        setProjects(defaultProjects);
        localStorage.setItem(storageKey, JSON.stringify(defaultProjects));
      }
    } catch (e) {
      console.warn('Failed to load projects from storage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  const saveProjects = useCallback((newProjects: Project[]) => {
    setProjects(newProjects);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newProjects));
    } catch {}
  }, [storageKey]);

  const createProject = useCallback((name: string, description: string = '', color: string = '#00C8FF') => {
    const trimmed = name.trim();
    if (!trimmed) return null;

    const newProj: Project = {
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed,
      description: description.trim(),
      color,
      sessionIds: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = [newProj, ...projects];
    saveProjects(updated);
    return newProj;
  }, [projects, saveProjects]);

  const updateProject = useCallback((id: string, updates: Partial<Omit<Project, 'id' | 'created_at'>>) => {
    const updated = projects.map(p =>
      p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
    );
    saveProjects(updated);
  }, [projects, saveProjects]);

  const deleteProject = useCallback((id: string) => {
    const updated = projects.filter(p => p.id !== id);
    if (selectedProjectId === id) setSelectedProjectId(null);
    saveProjects(updated);
  }, [projects, selectedProjectId, saveProjects]);

  const assignSessionToProject = useCallback((projectId: string, sessionId: string) => {
    const updated = projects.map(p => {
      if (p.id === projectId) {
        const nextSessions = Array.from(new Set([...p.sessionIds, sessionId]));
        return { ...p, sessionIds: nextSessions, updated_at: new Date().toISOString() };
      }
      return p;
    });
    saveProjects(updated);
  }, [projects, saveProjects]);

  const removeSessionFromProject = useCallback((projectId: string, sessionId: string) => {
    const updated = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, sessionIds: p.sessionIds.filter(id => id !== sessionId), updated_at: new Date().toISOString() };
      }
      return p;
    });
    saveProjects(updated);
  }, [projects, saveProjects]);

  return {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    isLoaded,
    createProject,
    updateProject,
    deleteProject,
    assignSessionToProject,
    removeSessionFromProject,
  };
}
