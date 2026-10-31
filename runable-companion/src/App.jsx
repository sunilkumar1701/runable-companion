import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header/Header';
import MoreOptionsMenu from './components/MoreOptionsMenu/MoreOptionsMenu';
import WelcomeSection from './components/WelcomeSection/WelcomeSection';
import QuickActions from './components/QuickActions/QuickActions';
import ChatComposer from './components/ChatComposer/ChatComposer';
import SelectedContextCard from './components/SelectedContextCard/SelectedContextCard';
import ConversationView from './components/ConversationView/ConversationView';
import SummaryLoadingState from './components/PageSummary/SummaryLoadingState';
import PageSummaryCard from './components/PageSummary/PageSummaryCard';
import Toast, { useToast } from './components/Toast/Toast';

import ArtifactsPage from './pages/ArtifactsPage';
import ScheduledTasksPage from './pages/ScheduledTasksPage';
import PluginsPage from './pages/PluginsPage';
import NotetakerPage from './pages/NotetakerPage';
import SettingsPage from './pages/SettingsPage';
import AccountPage from './pages/AccountPage';

import {
  getPendingContext,
  clearPendingContext,
  onContextChange,
  getActiveTabInfo,
  extractActivePageText,
} from './services/browserApi';
import { getAssistantResponse } from './services/mockRunableService';
import { getPageSummary, getSummaryFollowUpResponse } from './services/mockSummaryService';

import './components/Toast/Toast.css';

export default function App() {
  // Navigation & dropdown state (closed by default)
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');

  // Selected-text context state (Phase 2)
  const [selectedContext, setSelectedContext] = useState(null);

  // Page Summary state (Phase 4)
  const [summaryState, setSummaryState] = useState({
    status: 'idle', // 'idle' | 'loading' | 'completed'
    data: null,
  });

  // Conversation messages state
  const [messages, setMessages] = useState([]);
  const [toast, showToast] = useToast();
  const [composerPlaceholderOverride, setComposerPlaceholderOverride] = useState(null);

  // Load pending context on mount and subscribe to changes
  useEffect(() => {
    let isMounted = true;

    async function checkPendingContext() {
      const payload = await getPendingContext();
      if (isMounted && payload && payload.selectedText) {
        setSelectedContext(payload);
        setSummaryState({ status: 'idle', data: null });
        setActivePage('home');
      }
    }

    checkPendingContext();

    const unsubscribe = onContextChange((newPayload) => {
      if (isMounted) {
        if (newPayload && newPayload.selectedText) {
          setSelectedContext(newPayload);
          setSummaryState({ status: 'idle', data: null });
          setActivePage('home');
        } else {
          setSelectedContext(null);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleToggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  // New Chat resets all active contexts and returns to home
  const handleNewChat = useCallback(() => {
    setMenuOpen(false);
    setSelectedContext(null);
    setSummaryState({ status: 'idle', data: null });
    setMessages([]);
    setComposerPlaceholderOverride(null);
    setActivePage('home');
    clearPendingContext();
    showToast('New chat started');
  }, [showToast]);

  // Handle menu navigation
  const handleMenuAction = useCallback(
    (action, targetPageId) => {
      setMenuOpen(false);
      if (action === 'new-chat') {
        handleNewChat();
      } else if (action === 'navigate' && targetPageId) {
        setActivePage(targetPageId);
      }
    },
    [handleNewChat]
  );

  const handleBackToHome = useCallback(() => {
    setActivePage('home');
  }, []);

  // Remove selected context card without losing existing conversation messages
  const handleCloseSelectedContext = useCallback(() => {
    setSelectedContext(null);
    clearPendingContext();
    showToast('Webpage context removed');
  }, [showToast]);

  // Summarize This Page handler (Phase 4)
  const handleSummarizeThisPage = useCallback(async () => {
    if (summaryState.status === 'loading') return;

    // Reset selection context and existing messages for a clean summary session
    setSelectedContext(null);
    clearPendingContext();
    setMessages([]);
    setSummaryState({ status: 'loading', data: null });

    try {
      // 1. Get actual active tab URL & title
      const tabInfo = await getActiveTabInfo();

      // 2. Safely read readable page text locally if available
      const pageText = await extractActivePageText(tabInfo.id);

      // 3. Generate deterministic local page summary
      const summaryResult = await getPageSummary({
        title: tabInfo.title,
        url: tabInfo.url,
        text: pageText,
      });

      setSummaryState({
        status: 'completed',
        data: summaryResult,
      });
    } catch (err) {
      console.warn('Summarization fallback error:', err);
      // Graceful fallback so demo is never blocked
      const fallbackResult = await getPageSummary();
      setSummaryState({
        status: 'completed',
        data: fallbackResult,
      });
    }
  }, [summaryState.status]);

  // Send message handler (supports both Ask with Runable & Summary follow-ups)
  const handleSendMessage = useCallback(
    async (text) => {
      const userMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);

      let assistantReply;

      if (summaryState.status === 'completed' && summaryState.data) {
        // Summary follow-up response
        assistantReply = await getSummaryFollowUpResponse(text, summaryState.data);
      } else {
        // Ask with Runable response
        assistantReply = await getAssistantResponse(text, selectedContext);
      }

      const assistantMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: assistantReply.content,
        timestamp: assistantReply.timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    },
    [selectedContext, summaryState]
  );

  const handleSignOut = useCallback(() => {
    setActivePage('home');
    showToast('Signed out (Demo mode)');
  }, [showToast]);

  const handleSelectTool = useCallback(
    (tool) => {
      if (tool?.prompt) {
        setComposerPlaceholderOverride(tool.prompt + '...');
      } else if (tool?.title) {
        setComposerPlaceholderOverride(`Describe what you want Runable to build for ${tool.title}...`);
      }
      showToast(`Selected tool: ${tool.title}`);
    },
    [showToast]
  );

  // View state conditions
  const isSummaryActive = summaryState.status !== 'idle';
  const isSelectionActive = Boolean(selectedContext);
  const hasMessages = messages.length > 0;

  // Dynamic placeholder for composer
  const composerPlaceholder = composerPlaceholderOverride
    ? composerPlaceholderOverride
    : isSummaryActive
    ? 'Ask a follow-up question...'
    : 'Ask Runable anything...';

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden bg-[var(--panel-bg)]">
      {/* Top Navigation Header & More Options Menu (Home only) */}
      {activePage === 'home' && (
        <>
          <Header
            onNewChat={handleNewChat}
            onToggleMenu={handleToggleMenu}
            menuOpen={menuOpen}
          />

          {menuOpen && (
            <MoreOptionsMenu
              onClose={handleCloseMenu}
              onAction={handleMenuAction}
            />
          )}
        </>
      )}

      {/* Subpages routed from More Options */}
      {activePage === 'artifacts' && (
        <ArtifactsPage onBack={handleBackToHome} showToast={showToast} />
      )}

      {activePage === 'scheduled-tasks' && (
        <ScheduledTasksPage onBack={handleBackToHome} showToast={showToast} />
      )}

      {activePage === 'plugins' && (
        <PluginsPage onBack={handleBackToHome} showToast={showToast} />
      )}

      {activePage === 'notetaker' && (
        <NotetakerPage onBack={handleBackToHome} showToast={showToast} onNavigate={setActivePage} />
      )}

      {activePage === 'settings' && (
        <SettingsPage onBack={handleBackToHome} showToast={showToast} onNavigate={setActivePage} />
      )}

      {activePage === 'account' && (
        <AccountPage
          onBack={handleBackToHome}
          onSignOut={handleSignOut}
          showToast={showToast}
          onNavigate={setActivePage}
        />
      )}

      {/* Main Home / Chat View */}
      {activePage === 'home' && (
        <>
          <main className="flex flex-col flex-1 min-h-0 overflow-y-auto main-scroll">
            {/* 1. Summary Workflow Active (Phase 4) */}
            {isSummaryActive ? (
              <>
                {/* Four quick action cards remain at top with Summarize active */}
                <QuickActions
                  onAction={showToast}
                  onSummarize={handleSummarizeThisPage}
                  activeAction="summarize"
                />

                {/* Progress banner shown during summarization */}
                {summaryState.status === 'loading' && <SummaryLoadingState />}

                {/* Page summary result card */}
                {summaryState.status === 'completed' && (
                  <>
                    <PageSummaryCard summaryData={summaryState.data} />
                    {/* Follow-up conversation */}
                    <ConversationView messages={messages} />
                  </>
                )}
              </>
            ) : isSelectionActive || hasMessages ? (
              /* 2. Ask with Runable Selection Workflow (Phase 2) */
              <>
                {selectedContext && (
                  <SelectedContextCard
                    context={selectedContext}
                    onClose={handleCloseSelectedContext}
                  />
                )}
                <ConversationView messages={messages} />
              </>
            ) : (
              /* 3. Normal Phase 1 Welcome & Quick Actions */
              <>
                <WelcomeSection />
                <QuickActions
                  onAction={showToast}
                  onSummarize={handleSummarizeThisPage}
                  onSelectTool={handleSelectTool}
                />
              </>
            )}
          </main>

          {/* Bottom Chat Composer */}
          <ChatComposer
            onSendMessage={handleSendMessage}
            showToast={showToast}
            onNavigate={setActivePage}
            placeholder={composerPlaceholder}
          />
        </>
      )}

      {/* Floating Demo Toast */}
      <Toast message={toast} />
    </div>
  );
}
