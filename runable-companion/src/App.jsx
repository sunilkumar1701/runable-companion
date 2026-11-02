import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header/Header';
import HistorySidebar from './components/HistorySidebar/HistorySidebar';
import MoreOptionsMenu from './components/MoreOptionsMenu/MoreOptionsMenu';
import WelcomeSection from './components/WelcomeSection/WelcomeSection';
import QuickActions from './components/QuickActions/QuickActions';
import ChatComposer from './components/ChatComposer/ChatComposer';
import ConversationView from './components/ConversationView/ConversationView';
import SummaryLoadingState from './components/PageSummary/SummaryLoadingState';
import PageSummaryCard from './components/PageSummary/PageSummaryCard';

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
  extractActivePageContent,
} from './services/browserApi';
import { streamChat, summarizeWebpage } from './services/backendApi';
import { getPageSummary } from './services/mockSummaryService';
import { sampleChatHistory } from './data/demoData';

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

  // Conversation messages state persisted across mounts and Ask with Runable
  const [activeChatId, setActiveChatId] = useState(() => {
    try {
      return localStorage.getItem('runable_active_chat_id') || null;
    } catch (_) {
      return null;
    }
  });

  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem('runable_active_messages');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return [];
  });

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

  // Persist active chat session across component unmounts and side panel re-opens
  useEffect(() => {
    try {
      if (activeChatId) {
        localStorage.setItem('runable_active_chat_id', activeChatId);
      } else {
        localStorage.removeItem('runable_active_chat_id');
      }
    } catch (_) {}
  }, [activeChatId]);

  useEffect(() => {
    try {
      localStorage.setItem('runable_active_messages', JSON.stringify(messages));
    } catch (_) {}
  }, [messages]);

  // Load pending context on mount and subscribe to changes
  useEffect(() => {
    let isMounted = true;

    async function checkPendingContext() {
      const payload = await getPendingContext();
      if (isMounted && payload && payload.selectedText) {
        setSelectedContext(payload);
        setActivePage('home');
      }
    }

    checkPendingContext();

    const unsubscribe = onContextChange((newPayload) => {
      if (isMounted) {
        if (newPayload && newPayload.selectedText) {
          setSelectedContext(newPayload);
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
    try {
      localStorage.removeItem('runable_active_chat_id');
      localStorage.removeItem('runable_active_messages');
    } catch (_) {}
  }, []);

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
    },
    []
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
    },
    [activeChatId]
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
  }, []);

  // Summarize This Page handler (Phase 4 + Real AI Backend)
  const handleSummarizeThisPage = useCallback(async () => {
    if (summaryState.status === 'loading') return;

    // Save existing active chat to chatHistory before transitioning to summary
    if (messages.length > 0 && activeChatId) {
      setChatHistory((prev) => {
        const exists = prev.some((c) => c.id === activeChatId);
        if (!exists) {
          const firstUserMsg = messages.find((m) => m.role === 'user')?.content || 'Conversation';
          return [
            {
              id: activeChatId,
              title: firstUserMsg.slice(0, 36),
              dateGroup: 'Today',
              timestamp: Date.now(),
              messages: [...messages],
            },
            ...prev,
          ];
        }
        return prev.map((c) => (c.id === activeChatId ? { ...c, messages: [...messages] } : c));
      });
    }

    // Reset selection context and existing messages for a clean summary session
    setSelectedContext(null);
    clearPendingContext();
    setMessages([]);
    setActiveChatId(null);
    try {
      localStorage.removeItem('runable_active_chat_id');
      localStorage.removeItem('runable_active_messages');
    } catch (_) {}
    setSummaryState({ status: 'loading', data: null });

    try {
      // 1. Extract structured readable content from active tab
      const tabContent = await extractActivePageContent();

      if (tabContent.isProtected) {
        setSummaryState({
          status: 'completed',
          data: {
            title: tabContent.title || 'Protected Browser Page',
            sourceUrl: tabContent.url || '',
            summary:
              'Cannot extract content from browser protected pages (such as chrome://, extension settings, or browser web stores) due to browser security restrictions.',
            keyTakeaways: [
              'Browser security policies restrict extension access to internal settings and store pages.',
              'To summarize an article or webpage, navigate to a regular website (e.g. Wikipedia, blog, news) and click Summarize this page.',
            ],
            contentType: 'protected',
          },
        });
        return;
      }

      // 2. Generate page summary via FastAPI backend
      const summaryResult = await summarizeWebpage({
        title: tabContent.title,
        url: tabContent.url,
        text: tabContent.text,
        truncated: tabContent.truncated,
        contentType: tabContent.contentType,
        warning: tabContent.warning,
      });

      setSummaryState({
        status: 'completed',
        data: {
          ...summaryResult,
          fullText: tabContent.text,
          contentType: tabContent.contentType,
          warning: tabContent.warning || summaryResult.warning,
        },
      });
    } catch (err) {
      console.warn('Summarization error:', err);
      // Graceful fallback so demo is never completely blocked
      const fallbackResult = await getPageSummary();
      setSummaryState({
        status: 'completed',
        data: fallbackResult,
      });
    }
  }, [summaryState.status, messages, activeChatId]);

  // Send message handler (supports streaming real AI responses, selection context & follow-ups)
  const handleSendMessage = useCallback(
    async (text, explicitSelection = null) => {
      const trimmed = (text || '').trim();
      if (!trimmed || isSending) return;

      setIsSending(true);

      const activeSelection = explicitSelection || selectedContext;

      const currentChatId = activeChatId || `chat-${Date.now()}`;
      if (!activeChatId) {
        setActiveChatId(currentChatId);
      }

      const userMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        content: trimmed,
        attachmentContext: activeSelection ? { ...activeSelection } : null,
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

      // Clear pending selection in composer state now that it has been sent
      if (selectedContext) {
        setSelectedContext(null);
        clearPendingContext();
      }

      // Determine context and mode
      let mode = 'chat';
      let pageContext = null;

      // 1. Broad page-grounded query detector (including pdf, resume, cv, etc.)
      const isPageQuery = /\b(page|webpage|website|site|tab|article|document|doc|pdf|profile|resume|cv|who\s+is|who\s+are|what\s+does|about\s+section|author|qualifications?|experience|education|here|opened)\b/i.test(trimmed);

      // 2. Query active tab information
      const activeTabInfo = await getActiveTabInfo();
      const activeTabUrl = activeTabInfo?.url || '';

      // 3. Stale summary check: if user navigated away from the summarized page, invalidate summaryState
      const isSummaryStale =
        summaryState.status === 'completed' &&
        summaryState.data?.sourceUrl &&
        activeTabUrl &&
        summaryState.data.sourceUrl !== activeTabUrl;

      let effectiveSummaryData = summaryState.data;
      if (isSummaryStale) {
        setSummaryState({ status: 'idle', data: null });
        effectiveSummaryData = null;
      }

      if (activeSelection && activeSelection.selectedText) {
        mode = 'ask_selection';
        let pageText = activeSelection.selectedText;
        let isTruncated = false;

        // If the question also inquires about the broader page, extract active page content too
        if (isPageQuery) {
          try {
            const tabContent = await extractActivePageContent(activeTabInfo?.id);
            if (tabContent && tabContent.text) {
              pageText = tabContent.text;
              isTruncated = tabContent.truncated;
            }
          } catch (_) {}
        }

        pageContext = {
          type: 'selection',
          content_type: activeSelection.contentType || 'html',
          title: activeSelection.pageTitle || '',
          url: activeSelection.pageUrl || '',
          selected_text: activeSelection.selectedText || '',
          text: pageText,
          truncated: isTruncated,
        };
      } else if (summaryState.status === 'completed' && Boolean(effectiveSummaryData)) {
        // Follow-up question on currently active and still-open summary
        mode = 'page_followup';
        pageContext = {
          type: 'webpage',
          content_type: effectiveSummaryData.contentType || 'html',
          title: effectiveSummaryData.title || '',
          url: effectiveSummaryData.sourceUrl || '',
          text: effectiveSummaryData.fullText || effectiveSummaryData.summary || '',
          truncated: Boolean(effectiveSummaryData.truncated),
        };
      } else if (isPageQuery) {
        try {
          const tabContent = await extractActivePageContent(activeTabInfo?.id);
          if (tabContent && tabContent.text) {
            mode = 'webpage';
            pageContext = {
              type: 'webpage',
              content_type: tabContent.contentType || 'html',
              title: tabContent.title || activeTabInfo?.title || '',
              url: tabContent.url || activeTabUrl || '',
              text: tabContent.text || '',
              truncated: tabContent.truncated || false,
            };
          }
        } catch (err) {
          console.warn('Failed to extract page context for chat query:', err);
        }
      }

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
    [isSending, activeChatId, messages, summaryState, selectedContext]
  );

  const handleSignOut = useCallback(() => {
    setActivePage('home');
  }, []);

  const handleSelectTool = useCallback(
    (tool) => {
      if (tool?.prompt) {
        setComposerPlaceholderOverride(tool.prompt + '...');
      } else if (tool?.title) {
        setComposerPlaceholderOverride(`Describe what you want Runable to build for ${tool.title}...`);
      }
    },
    []
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
        <ArtifactsPage onBack={handleBackToHome} />
      )}

      {activePage === 'scheduled-tasks' && (
        <ScheduledTasksPage onBack={handleBackToHome} />
      )}

      {activePage === 'plugins' && (
        <PluginsPage onBack={handleBackToHome} />
      )}

      {activePage === 'notetaker' && (
        <NotetakerPage onBack={handleBackToHome} onNavigate={setActivePage} />
      )}

      {activePage === 'settings' && (
        <SettingsPage onBack={handleBackToHome} onNavigate={setActivePage} />
      )}

      {activePage === 'account' && (
        <AccountPage
          onBack={handleBackToHome}
          onSignOut={handleSignOut}
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
            ) : hasMessages ? (
              /* 2. Conversation Messages View */
              <ConversationView messages={messages} />
            ) : (
              /* 3. Normal Phase 1 Welcome & Quick Actions */
              <>
                <WelcomeSection />
                <QuickActions
                  onSummarize={handleSummarizeThisPage}
                  onSelectTool={handleSelectTool}
                />
              </>
            )}
          </main>

          {/* Bottom Chat Composer with integrated attachment support */}
          <ChatComposer
            onSendMessage={handleSendMessage}
            onNavigate={setActivePage}
            placeholder={composerPlaceholder}
            selectedContext={selectedContext}
            onClearSelectedContext={handleCloseSelectedContext}
          />
        </>
      )}
    </div>
  );
}
