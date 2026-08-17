'use client'

import { useState, useCallback, useEffect } from 'react'
import { ChatWindow } from './layout/ChatWindow'
import { ChatSidebar } from './layout/Sidebar'
import { PageNav } from './nav/PageNav'
import { useChat } from '@/hooks/useChat'
import { useChatHistory } from '@/hooks/useChatHistory'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { AuthModal, AuthModalView } from '@/components/auth/AuthModal'
import { SoftGateModal } from '@/components/auth/SoftGateModal'
import { SearchModal } from './modals/SearchModal'
import { ProjectsModal } from './modals/ProjectsModal'
import { MemoryModal } from './modals/MemoryModal'
import { FilesModal } from './modals/FilesModal'
import { SettingsModal } from './modals/SettingsModal'
import { useMemory } from '@/hooks/useMemory'
import { useProjects } from '@/hooks/useProjects'
import { Artifact } from '@/types'

function ZeroChatContent() {
  const { user } = useAuth()
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false)
  const [pageNavOpen, setPageNavOpen] = useState(false)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)

  // Modals active state
  const [activeModal, setActiveModal] = useState<'search' | 'projects' | 'memory' | 'files' | 'settings' | null>(null)

  // Auth Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalView, setAuthModalView] = useState<AuthModalView>('login')
  const [softGateOpen, setSoftGateOpen] = useState(false)

  // Multi-session history
  const {
    sessions,
    groupedSessions,
    isLoading: isHistoryLoading,
    searchQuery,
    setSearchQuery,
    createSession,
    renameSession,
    deleteSession,
    updateSessionMetadata,
    refreshSessions,
  } = useChatHistory(user?.id)

  // Memory hook
  const {
    memories,
    memoryEnabled,
    customInstructions,
    addMemory,
    removeMemory,
    clearAllMemories,
    toggleMemoryEnabled,
    updateCustomInstructions,
  } = useMemory(user?.id)

  // Projects hook
  const {
    projects,
    createProject,
    deleteProject,
    assignSessionToProject,
    removeSessionFromProject,
  } = useProjects(user?.id)

  // Auto-detect password recovery in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))

      if (urlParams.get('view') === 'reset-password' || hashParams.get('type') === 'recovery') {
        setAuthModalView('reset-password')
        setAuthModalOpen(true)
      }
    }
  }, [])

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K for Search, Cmd+, for Settings)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setActiveModal(prev => (prev === 'search' ? null : 'search'))
      } else if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault()
        setActiveModal(prev => (prev === 'settings' ? null : 'settings'))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Refetch sessions when user logs in or out
  useEffect(() => {
    refreshSessions()
  }, [user, refreshSessions])

  const handleSessionCreated = useCallback((newId: string, initialTitle: string) => {
    setActiveSessionId(newId)
    updateSessionMetadata(newId, { title: initialTitle, message_count: 1 })
  }, [updateSessionMetadata])

  const handleTitleGenerated = useCallback((targetId: string, title: string) => {
    updateSessionMetadata(targetId, { title })
  }, [updateSessionMetadata])

  const chatState = useChat({
    sessionId: activeSessionId,
    onSessionCreated: handleSessionCreated,
    onTitleGenerated: handleTitleGenerated,
  })

  // Intercept send to track 5-question soft gate for guest users
  const handleSendMessage = useCallback(async (text: string, modelName?: string, webSearch?: boolean) => {
    if (!user) {
      try {
        const rawCount = localStorage.getItem('zero_guest_msg_count') || '0'
        const count = parseInt(rawCount, 10) + 1
        localStorage.setItem('zero_guest_msg_count', count.toString())

        const isDismissed = localStorage.getItem('zero_soft_gate_dismissed') === 'true'

        if (count >= 5 && !isDismissed) {
          setSoftGateOpen(true)
        }
      } catch { }
    }

    return chatState.send(text, modelName, webSearch)
  }, [user, chatState])

  const handleNewChat = useCallback(async () => {
    const newId = await createSession('New Chat')
    setActiveSessionId(newId)
    chatState.setMessages([])
    chatState.setActiveArtifact(null)
  }, [createSession, chatState])

  const handleSelectSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId)
  }, [])

  const handleDeleteSession = useCallback((id: string) => {
    deleteSession(id)
    if (activeSessionId === id) {
      setActiveSessionId(null)
      chatState.setMessages([])
      chatState.setActiveArtifact(null)
    }
  }, [deleteSession, activeSessionId, chatState])

  const handleClearAllHistory = useCallback(() => {
    sessions.forEach(s => deleteSession(s.id))
    setActiveSessionId(null)
    chatState.setMessages([])
    chatState.setActiveArtifact(null)
  }, [sessions, deleteSession, chatState])

  const handleSoftGateSignIn = () => {
    setSoftGateOpen(false)
    setAuthModalView('signup')
    setAuthModalOpen(true)
  }

  const handleSoftGateSignInLater = () => {
    setSoftGateOpen(false)
    try {
      localStorage.setItem('zero_soft_gate_dismissed', 'true')
    } catch { }
  }

  const handleOpenArtifact = useCallback((artifact: Artifact) => {
    chatState.setActiveArtifact(artifact)
  }, [chatState])

  return (
    <div className="flex h-[100dvh] w-full bg-[#F8F7F3] overflow-hidden text-[#111111] font-sans selection:bg-[#22C8FF] selection:text-white">
      {/* Left: collapsible chat panel with full multi-session history & profile avatar */}
      <ChatSidebar
        open={chatSidebarOpen}
        onClose={() => setChatSidebarOpen(false)}
        activeSessionId={activeSessionId}
        onSessionSelect={handleSelectSession}
        onNewChat={handleNewChat}
        sessions={sessions}
        groupedSessions={groupedSessions}
        onRenameSession={renameSession}
        onDeleteSession={handleDeleteSession}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isLoading={isHistoryLoading}
        onOpenAuthModal={() => {
          setAuthModalView('login')
          setAuthModalOpen(true)
        }}
        onToolClick={(toolId) => setActiveModal(toolId)}
      />

      {/* Right: page navigation (Zero Ring, Cowork, API, Research) */}
      <PageNav open={pageNavOpen} onClose={() => setPageNavOpen(false)} />

      {/* Full-width chat window */}
      <ChatWindow
        sidebarOpen={chatSidebarOpen}
        onChatMenuClick={() => setChatSidebarOpen(prev => !prev)}
        onPageNavClick={() => setPageNavOpen(true)}
        chatState={{
          ...chatState,
          sendMessage: handleSendMessage,
          send: handleSendMessage,
        }}
        onNewChat={handleNewChat}
      />

      {/* ── Feature Modals ── */}
      <SearchModal
        isOpen={activeModal === 'search'}
        onClose={() => setActiveModal(null)}
        sessions={sessions}
        onSelectSession={handleSelectSession}
      />

      <ProjectsModal
        isOpen={activeModal === 'projects'}
        onClose={() => setActiveModal(null)}
        projects={projects}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onCreateProject={createProject}
        onDeleteProject={deleteProject}
        onAssignSession={assignSessionToProject}
        onRemoveSession={removeSessionFromProject}
        onSelectSession={handleSelectSession}
      />

      <MemoryModal
        isOpen={activeModal === 'memory'}
        onClose={() => setActiveModal(null)}
        memories={memories}
        memoryEnabled={memoryEnabled}
        customInstructions={customInstructions}
        onAddMemory={addMemory}
        onRemoveMemory={removeMemory}
        onClearAll={clearAllMemories}
        onToggleEnabled={toggleMemoryEnabled}
        onUpdateInstructions={updateCustomInstructions}
      />

      <FilesModal
        isOpen={activeModal === 'files'}
        onClose={() => setActiveModal(null)}
        sessions={sessions}
        onOpenArtifact={handleOpenArtifact}
      />

      <SettingsModal
        isOpen={activeModal === 'settings'}
        onClose={() => setActiveModal(null)}
        onClearHistory={handleClearAllHistory}
      />

      {/* ── Soft Gate Prompt (Appears on 5th question for guests) ── */}
      <SoftGateModal
        isOpen={softGateOpen}
        onSignIn={handleSoftGateSignIn}
        onSignInLater={handleSoftGateSignInLater}
      />

      {/* ── Production Authentication Modal (Login / Signup / Forgot Password) ── */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialView={authModalView}
        onSuccess={() => {
          refreshSessions()
        }}
      />
    </div>
  )
}

export function ZeroChat() {
  return (
    <AuthProvider>
      <ZeroChatContent />
    </AuthProvider>
  )
}
