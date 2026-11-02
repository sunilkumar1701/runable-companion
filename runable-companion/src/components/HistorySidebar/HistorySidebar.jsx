import { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  X,
  Search,
  MessageSquare,
  Trash2,
} from 'lucide-react';
import './HistorySidebar.css';

/**
 * Left Slide-Out History Sidebar Drawer (ChatGPT / Claude style).
 * Displays stored chat history sessions and allows switching or starting new chats.
 */
export default function HistorySidebar({
  isOpen,
  onClose,
  chatHistory = [],
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter chats by search query
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chatHistory;
    const q = searchQuery.toLowerCase().trim();
    return chatHistory.filter((c) =>
      c.title ? c.title.toLowerCase().includes(q) : false
    );
  }, [chatHistory, searchQuery]);

  // Group chats by dateGroup
  const groupedChats = useMemo(() => {
    const groups = {};
    for (const chat of filteredChats) {
      const g = chat.dateGroup || 'Recent';
      if (!groups[g]) groups[g] = [];
      groups[g].push(chat);
    }
    return groups;
  }, [filteredChats]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="history-drawer-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Sidebar Drawer from the Left */}
      <aside
        className="history-drawer"
        role="dialog"
        aria-label="Chat history drawer"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="history-drawer-header">
          <div className="history-drawer-header-left">
            <div className="history-drawer-logo">R</div>
            <div className="history-drawer-title-wrap">
              <span className="history-drawer-title">Chat history</span>
            </div>
          </div>

          <div className="history-drawer-header-actions">
            <button
              type="button"
              className="history-new-chat-btn"
              onClick={() => {
                onNewChat();
                onClose();
              }}
              aria-label="Start new chat"
              title="New chat"
            >
              <Plus size={14} strokeWidth={2.2} />
              <span>New</span>
            </button>

            <button
              type="button"
              className="history-close-btn"
              onClick={onClose}
              aria-label="Close history"
              title="Close"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="history-search-wrap">
          <Search size={14} strokeWidth={2} className="history-search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="history-search-input"
          />
        </div>

        {/* Chat History List */}
        <div className="history-list main-scroll">
          {Object.keys(groupedChats).length > 0 ? (
            Object.entries(groupedChats).map(([groupTitle, chats]) => (
              <div key={groupTitle} className="history-group">
                <div className="history-group-label">{groupTitle}</div>
                <div className="history-group-items">
                  {chats.map((chat) => {
                    const isActive = activeChatId === chat.id;
                    return (
                      <div
                        key={chat.id}
                        className={`history-chat-row ${
                          isActive ? 'history-chat-row--active' : ''
                        }`}
                      >
                        <button
                          type="button"
                          className="history-chat-item-btn"
                          onClick={() => {
                            onSelectChat(chat);
                            onClose();
                          }}
                        >
                          <MessageSquare
                            size={14}
                            strokeWidth={1.8}
                            className="history-chat-icon"
                          />
                          <span className="history-chat-title">{chat.title}</span>
                        </button>

                        <button
                          type="button"
                          className="history-chat-delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onDeleteChat) onDeleteChat(chat.id);
                          }}
                          aria-label={`Delete chat ${chat.title}`}
                          title="Delete chat"
                        >
                          <Trash2 size={13} strokeWidth={1.8} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="history-empty">
              {searchQuery ? `No chats match "${searchQuery}"` : 'No chat history yet'}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
