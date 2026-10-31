import { Plus, MoreVertical, X } from 'lucide-react';
import { PRODUCT_NAME } from '../../data/demoData';
import './Header.css';

/**
 * Header bar with logo, product name, new-chat button, more-options button,
 * and side panel close button.
 */
export default function Header({ onNewChat, onToggleMenu, menuOpen }) {
  const handleClosePanel = () => {
    try {
      window.close();
    } catch (_) {}
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo" aria-hidden="true">
          R
        </div>
        <span className="header-title">{PRODUCT_NAME}</span>
      </div>

      <div className="header-right">
        <button
          type="button"
          className="header-icon-btn"
          onClick={onNewChat}
          aria-label="New chat"
          title="New chat"
        >
          <Plus size={18} strokeWidth={2} />
        </button>
        <button
          type="button"
          className={`header-icon-btn ${menuOpen ? 'header-icon-btn--active' : ''}`}
          onClick={onToggleMenu}
          aria-label="More options"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          title="More options"
        >
          <MoreVertical size={18} strokeWidth={2} />
        </button>
        <button
          type="button"
          className="header-icon-btn"
          onClick={handleClosePanel}
          aria-label="Close side panel"
          title="Close side panel"
        >
          <X size={18} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
