import { useState, useCallback } from 'react';
import Header from './components/Header/Header';
import MoreOptionsMenu from './components/MoreOptionsMenu/MoreOptionsMenu';
import WelcomeSection from './components/WelcomeSection/WelcomeSection';
import QuickActions from './components/QuickActions/QuickActions';
import ChatComposer from './components/ChatComposer/ChatComposer';
import Toast, { useToast } from './components/Toast/Toast';
import './components/Toast/Toast.css';

export default function App() {
  // Menu open by default on first load per spec
  const [menuOpen, setMenuOpen] = useState(true);
  const [toast, showToast] = useToast();

  const handleToggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const handleNewChat = useCallback(() => {
    setMenuOpen(false);
    showToast('New chat started');
  }, [showToast]);

  const handleMenuAction = useCallback(
    (action) => {
      if (action === 'reset') {
        handleNewChat();
      }
    },
    [handleNewChat]
  );

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden bg-[var(--panel-bg)]">
      {/* Header */}
      <Header
        onNewChat={handleNewChat}
        onToggleMenu={handleToggleMenu}
        menuOpen={menuOpen}
      />

      {/* More options menu */}
      {menuOpen && (
        <MoreOptionsMenu
          onClose={handleCloseMenu}
          onAction={handleMenuAction}
          showToast={showToast}
        />
      )}

      {/* Scrollable main content area */}
      <main className="flex flex-col flex-1 min-h-0 overflow-y-auto main-scroll">
        <WelcomeSection />
        <QuickActions onAction={showToast} />
      </main>

      {/* Chat composer anchored to bottom */}
      <ChatComposer showToast={showToast} />

      {/* Toast notifications */}
      <Toast message={toast} />
    </div>
  );
}

