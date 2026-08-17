'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, Plus, Trash2, X, Sparkles, Check, MessageSquare, ExternalLink } from 'lucide-react';
import { Project, PROJECT_COLOR_OPTIONS } from '@/hooks/useProjects';
import { ChatSession } from '@/types';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  sessions: ChatSession[];
  activeSessionId?: string | null;
  onCreateProject: (name: string, description: string, color: string) => void;
  onDeleteProject: (id: string) => void;
  onAssignSession: (projectId: string, sessionId: string) => void;
  onRemoveSession: (projectId: string, sessionId: string) => void;
  onSelectSession: (sessionId: string) => void;
}

export function ProjectsModal({
  isOpen,
  onClose,
  projects,
  sessions,
  activeSessionId,
  onCreateProject,
  onDeleteProject,
  onAssignSession,
  onRemoveSession,
  onSelectSession,
}: ProjectsModalProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [isCreating, setIsCreating] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjColor, setNewProjColor] = useState(PROJECT_COLOR_OPTIONS[0]);

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;
    onCreateProject(newProjName, newProjDesc, newProjColor);
    setNewProjName('');
    setNewProjDesc('');
    setIsCreating(false);
  };

  const projectSessions = sessions.filter((s) =>
    activeProject?.sessionIds?.includes(s.id)
  );

  const availableSessionsToAssign = sessions.filter(
    (s) => !activeProject?.sessionIds?.includes(s.id)
  );

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
          className="relative w-full max-w-3xl h-[560px] max-h-[90vh] bg-[#F9F8F5] rounded-2xl shadow-2xl border border-[#E5E4DF] overflow-hidden z-10 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E5E4DF]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#00C8FF]/10 text-[#00C8FF] flex items-center justify-center">
                <Folder className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#111]">Projects & Workspaces</h2>
                <p className="text-[11.5px] text-[#111]/50">
                  Organize chats, prompts, and artifacts into focused folders
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

          {/* Main Body (Split into Left Project List & Right Project Details) */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0">
            {/* Left Sidebar: List of Projects */}
            <div className="w-full md:w-64 bg-[#F2F1EC] border-r border-[#E5E4DF] flex flex-col p-3 gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#111]/45">
                  Folders ({projects.length})
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#00C8FF] hover:underline"
                >
                  <Plus className="w-3 h-3" /> New
                </button>
              </div>

              {/* Projects List */}
              <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                {projects.map((proj) => {
                  const isSelected = activeProject?.id === proj.id;
                  return (
                    <div
                      key={proj.id}
                      onClick={() => {
                        setSelectedProjectId(proj.id);
                        setIsCreating(false);
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-white shadow-xs font-semibold text-[#111] border border-[#E5E4DF]'
                          : 'text-[#111]/70 hover:bg-white/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: proj.color || '#00C8FF' }}
                        />
                        <span className="truncate">{proj.name}</span>
                      </div>
                      <span className="text-[10.5px] text-[#111]/40 shrink-0 ml-1">
                        {proj.sessionIds?.length || 0}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Quick Action: Assign Current Active Chat */}
              {activeSessionId && activeProject && (
                <div className="pt-2 border-t border-[#E5E4DF]">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeProject) {
                        onAssignSession(activeProject.id, activeSessionId);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white hover:bg-black hover:text-white border border-[#E5E4DF] rounded-xl text-[11.5px] font-semibold text-[#111] transition-all shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Current Chat</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Pane: Project Content & Settings */}
            <div className="flex-1 bg-white p-5 overflow-y-auto flex flex-col">
              {isCreating ? (
                /* Create Project Form */
                <form onSubmit={handleCreate} className="space-y-4 max-w-md">
                  <div>
                    <h3 className="text-sm font-bold text-[#111]">Create New Project Workspace</h3>
                    <p className="text-xs text-[#111]/50 mt-0.5">
                      Group related conversations and research under a single workspace
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111]/70 mb-1">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={newProjName}
                      onChange={(e) => setNewProjName(e.target.value)}
                      placeholder="e.g., Marketing Strategy 2026"
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E4DF] text-xs text-[#111] outline-none focus:border-[#00C8FF]"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111]/70 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      value={newProjDesc}
                      onChange={(e) => setNewProjDesc(e.target.value)}
                      placeholder="What is this workspace focused on?"
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E4DF] text-xs text-[#111] outline-none focus:border-[#00C8FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111]/70 mb-1.5">
                      Color Tag
                    </label>
                    <div className="flex items-center gap-2">
                      {PROJECT_COLOR_OPTIONS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setNewProjColor(c)}
                          className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                          style={{ backgroundColor: c }}
                        >
                          {newProjColor === c && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={!newProjName.trim()}
                      className="px-4 py-2 rounded-xl bg-[#111] hover:bg-black text-white text-xs font-semibold shadow-xs disabled:opacity-40"
                    >
                      Create Project
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCreating(false)}
                      className="px-3 py-2 rounded-xl text-xs font-medium text-[#111]/60 hover:text-[#111]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : activeProject ? (
                /* Project Details & Assigned Chats */
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between pb-4 border-b border-[#E5E4DF]">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: activeProject.color || '#00C8FF' }}
                      />
                      <div>
                        <h3 className="text-base font-bold text-[#111]">{activeProject.name}</h3>
                        <p className="text-xs text-[#111]/50 mt-0.5">
                          {activeProject.description || 'No description provided.'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteProject(activeProject.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 text-xs flex items-center gap-1"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Chats Assigned to this Project */}
                  <div className="flex-1 overflow-y-auto py-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#111]/45 mb-2">
                      Chats in this Project ({projectSessions.length})
                    </div>

                    {projectSessions.length === 0 ? (
                      <div className="py-8 text-center bg-[#F9F8F5] rounded-xl border border-dashed border-[#E5E4DF] p-4">
                        <MessageSquare className="w-6 h-6 text-[#111]/30 mx-auto mb-1.5" />
                        <p className="text-xs font-semibold text-[#111]/60">No chats in this folder yet</p>
                        <p className="text-[11px] text-[#111]/40 mt-0.5">
                          Assign existing chats below or start fresh in this workspace
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {projectSessions.map((session) => (
                          <div
                            key={session.id}
                            className="flex items-center justify-between p-2.5 rounded-xl border border-[#E5E4DF] hover:bg-[#F9F8F5] transition-colors"
                          >
                            <div
                              onClick={() => {
                                onSelectSession(session.id);
                                onClose();
                              }}
                              className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
                            >
                              <MessageSquare className="w-4 h-4 text-[#00C8FF] shrink-0" />
                              <span className="text-xs font-medium text-[#111] truncate">
                                {session.title}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => onRemoveSession(activeProject.id, session.id)}
                              className="p-1 rounded-md text-[#111]/40 hover:text-rose-500 hover:bg-rose-50"
                              title="Remove from project"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick Add Existing Session Dropdown */}
                    {availableSessionsToAssign.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[#E5E4DF]">
                        <div className="text-[11px] font-bold text-[#111]/50 mb-1.5">
                          Add other chats into this project:
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                          {availableSessionsToAssign.slice(0, 8).map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => onAssignSession(activeProject.id, s.id)}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F4F3EE] hover:bg-[#EAE8E2] text-xs text-[#111] border border-[#E5E4DF]"
                            >
                              <Plus className="w-3 h-3 text-[#00C8FF]" />
                              <span className="max-w-[140px] truncate">{s.title}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
