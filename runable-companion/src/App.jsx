import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header/Header';
import MoreOptionsMenu from './components/MoreOptionsMenu/MoreOptionsMenu';
import WelcomeSection from './components/WelcomeSection/WelcomeSection';
import QuickActions from './components/QuickActions/QuickActions';
import ChatComposer from './components/ChatComposer/ChatComposer';
import SelectedContextCard from './components/SelectedContextCard/SelectedContextCard';
import ConversationView from './components/ConversationView/ConversationView';
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
} from './services/browserApi';
import { getAssistantResponse } from './services/mockRunableService';

import './components/Toast/Toast.css';

export default function App() {
  // Corrected for Phase 2 & 3: dropdown closed by default on fresh load
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [selectedContext, setSelectedContext] = useState(null);
  const [messages, setMessages] = useState([]);
  const [toast, showToast] = useToast();

  // Load pending context on mount and listen for runtime changes
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
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  // New Chat resets conversation, clears selected context, and returns to home
  const handleNewChat = useCallback(() => {
    setMenuOpen(false);
    setSelectedContext(null);
    setMessages([]);
    setActivePage('home');
    clearPendingContext();
    showToast('New chat started');
  }, [showToast]);

  // Handle menu navigation and actions
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

  // Closing the selected context card removes webpage context but preserves messages
  const handleCloseSelectedContext = useCallback(() => {
    setSelectedContext(null);
    clearPendingContext();
    showToast('Webpage context removed');
  }, [showToast]);

  // Sending a message
  const handleSendMessage = useCallback(
    async (text) => {
      const userMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Obtain deterministic dummy assistant response
      const assistantReply = await getAssistantResponse(text, selectedContext);

      const assistantMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: assistantReply.content,
        timestamp: assistantReply.timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    },
    [selectedContext]
  );

  const handleSignOut = useCallback(() => {
    setActivePage('home');
    showToast('Signed out (Demo mode)');
  }, [showToast]);

  // Determine whether to show selected conversation mode or regular welcome mode
  const isConversationMode = Boolean(selectedContext || messages.length > 0);

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden bg-[var(--panel-bg)]">
      {/* Shared Header */}
      <Header
        onNewChat={handleNewChat}
        onToggleMenu={handleToggleMenu}
        menuOpen={menuOpen}
      />

      {/* More Options Dropdown */}
      {menuOpen && (
        <MoreOptionsMenu
          onClose={handleCloseMenu}
          onAction={handleMenuAction}
        />
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
        <NotetakerPage onBack={handleBackToHome} showToast={showToast} />
      )}

      {activePage === 'settings' && (
        <SettingsPage onBack={handleBackToHome} showToast={showToast} />
      )}

      {activePage === 'account' && (
        <AccountPage onBack={handleBackToHome} onSignOut={handleSignOut} />
      )}

      {/* Primary Home / Chat View */}
      {activePage === 'home' && (
        <>
          <main className="flex flex-col flex-1 min-h-0 overflow-y-auto main-scroll">
            {isConversationMode ? (
              <>
                {/* Selected from webpage card */}
                {selectedContext && (
                  <SelectedContextCard
                    context={selectedContext}
                    onClose={handleCloseSelectedContext}
                  />
                )}

                {/* Conversation area (shows messages only when user sends one) */}
                <ConversationView messages={messages} />
              </>
            ) : (
              <>
                {/* Standard Phase 1 Home Welcome & 4 Quick Actions */}
                <WelcomeSection />
                <QuickActions onAction={showToast} />
              </>
            )}
          </main>

          {/* Bottom Chat Composer */}
          <ChatComposer
            onSendMessage={handleSendMessage}
            showToast={showToast}
          />
        </>
      )}

      {/* Floating Demo Toasts */}
      <Toast message={toast} />
    </div>
  );
}
