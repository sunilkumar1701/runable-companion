import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header/Header';
import HistorySidebar from './components/HistorySidebar/HistorySidebar';
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
import { streamChat, summarizeWebpage } from './services/backendApi';
import { getPageSummary } from './services/mockSummaryService';
import { sampleChatHistory } from './data/demoData';

import './components/Toast/Toast.css';

export default function App() {
  // Navigation & dropdown state (closed by default)
  const [menuOpen, setMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
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
  const [activeChatId, setActiveChatId] = useState(null);
  const [toast, showToast] = useToast();
  const [composerPlaceholderOverride, setComposerPlaceholderOverride] = useState(null);
  const [isSending, setIsSending] = useState(false);

  // Chat history state persisted in localStorage
  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('runable_chat_history');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return sampleChatHistory;
  });

  // Persist chat history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('runable_chat_history', JSON.stringify(chatHistory));
    } catch (_) {}
  }, [chatHistory]);

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
    setHistoryOpen(false);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const handleToggleHistory = useCallback(() => {
    setHistoryOpen((prev) => !prev);
    setMenuOpen(false);
  }, []);

  // New Chat resets all active contexts and returns to home
  const handleNewChat = useCallback(() => {
    setMenuOpen(false);
    setHistoryOpen(false);
    setActiveChatId(null);
    setSelectedContext(null);
    setSummaryState({ status: 'idle', data: null });
    setMessages([]);
    setComposerPlaceholderOverride(null);
    setActivePage('home');
    clearPendingContext();
    showToast('New chat started');
  }, [showToast]);

  // Handle selecting a chat from the History drawer
  const handleSelectHistoricalChat = useCallback(
    (chat) => {
      setActiveChatId(chat.id);
      setMessages(chat.messages || []);
      setSelectedContext(chat.selectedContext || null);
      setSummaryState({ status: 'idle', data: null });
      setComposerPlaceholderOverride(null);
      setActivePage('home');
      setHistoryOpen(false);
      setMenuOpen(false);
      showToast(`Loaded: "${chat.title}"`);
    },
    [showToast]
  );

  // Handle deleting a chat from history
  const handleDeleteHistoricalChat = useCallback(
    (chatId) => {
      setChatHistory((prev) => prev.filter((c) => c.id !== chatId));
      if (activeChatId === chatId) {
        setActiveChatId(null);
        setMessages([]);
        setSelectedContext(null);
        setSummaryState({ status: 'idle', data: null });
      }
      showToast('Chat deleted');
    },
    [activeChatId, showToast]
  );

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

  // Summarize This Page handler (Phase 4 + Real AI Backend)
  const handleSummarizeThisPage = useCallback(async () => {
    if (summaryState.status === 'loading') return;

    // Reset selection context and existing messages for a clean summary session
    setSelectedContext(null);
    clearPendingContext();
    setMessages([]);
    setActiveChatId(null);
    setSummaryState({ status: 'loading', data: null });

    try {
      // 1. Get actual active tab URL & title
      const tabInfo = await getActiveTabInfo();

      // 2. Safely read readable page text locally if available
      const pageText = await extractActivePageText(tabInfo.id);

      // 3. Generate page summary via FastAPI backend (or graceful local fallback)
      const summaryResult = await summarizeWebpage({
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

  // Send message handler (supports streaming real AI responses, selection context & follow-ups)
  const handleSendMessage = useCallback(
    async (text) => {
      const trimmed = (text || '').trim();
      if (!trimmed || isSending) return;

      setIsSending(true);

      const currentChatId = activeChatId || `chat-${Date.now()}`;
      if (!activeChatId) {
        setActiveChatId(currentChatId);
      }

      const userMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      };

      const assistantMsgId = `assistant_${Date.now()}`;
      const placeholderAssistantMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        isStreaming: true,
        timestamp: Date.now(),
      };

      // Add user message + streaming placeholder immediately
      setMessages((prev) => [...prev, userMessage, placeholderAssistantMessage]);

      // Determine context and mode
      const isSummaryFollowUp = summaryState.status === 'completed' && Boolean(summaryState.data);
      const mode = isSummaryFollowUp
        ? 'page_followup'
        : selectedContext
        ? 'ask_selection'
        : 'chat';

      const pageContext = isSummaryFollowUp
        ? {
            title: summaryState.data.title || '',
            url: summaryState.data.sourceUrl || '',
            text: summaryState.data.summary || '',
          }
        : selectedContext;

      // Prepare conversation history (up to last 6 messages)
      const historyForApi = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));
      historyForApi.push({ role: 'user', content: trimmed });

      let accumulatedContent = '';

      const onToken = (chunk) => {
        accumulatedContent += chunk;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? { ...msg, content: accumulatedContent, isStreaming: true }
              : msg
          )
        );
      };

      const onDone = (meta) => {
        setIsSending(false);
        const finalAssistantMessage = {
          id: assistantMsgId,
          role: 'assistant',
          content: accumulatedContent,
          isStreaming: false,
          timestamp: Date.now(),
          model: meta?.model || 'gpt-6.1-sol',
        };

        setMessages((prev) => {
          const updated = prev.map((msg) =>
            msg.id === assistantMsgId ? finalAssistantMessage : msg
          );

          // Sync with chatHistory
          setChatHistory((prevHistory) => {
            const existing = prevHistory.find((c) => c.id === currentChatId);
            if (existing) {
              return prevHistory.map((c) =>
                c.id === currentChatId
                  ? { ...c, messages: updated, timestamp: Date.now() }
                  : c
              );
            } else {
              const title = trimmed.slice(0, 36) || 'New Conversation';
              const newChat = {
                id: currentChatId,
                title,
                dateGroup: 'Today',
                timestamp: Date.now(),
                messages: updated,
                selectedContext,
              };
              return [newChat, ...prevHistory];
            }
          });

          return updated;
        });
      };

      const onError = (err) => {
        setIsSending(false);
        const errorContent =
          accumulatedContent ||
          'Sorry, I encountered an issue connecting to the AI service. Please ensure the backend is running and your API key is configured.';
        showToast(err.message || 'Error communicating with AI service');

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  content: errorContent,
                  isStreaming: false,
                  isError: true,
                }
              : msg
          )
        );
      };

      await streamChat({
        messages: historyForApi,
        pageContext,
        mode,
        onToken,
        onDone,
        onError,
      });
    },
    [isSending, activeChatId, messages, summaryState, selectedContext, showToast]
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
            onToggleHistory={handleToggleHistory}
            historyOpen={historyOpen}
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

      {/* Left Slide-out History Drawer (ChatGPT / Claude style) */}
      <HistorySidebar
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        chatHistory={chatHistory}
        activeChatId={activeChatId}
        onSelectChat={handleSelectHistoricalChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteHistoricalChat}
      />

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
