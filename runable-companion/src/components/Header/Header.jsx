import { History, MoreVertical, X } from 'lucide-react';
import { PRODUCT_NAME } from '../../data/demoData';
import './Header.css';

/**
 * Header bar with logo, product name, chat history button (replaces + icon),
 * more-options menu button, and side panel close button.
 */
export default function Header({
  onToggleHistory,
  historyOpen,
  onToggleMenu,
  menuOpen,
}) {
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
        {/* Replaced '+' icon with History icon matching Reference Image 4 */}
        <button
          type="button"
          className={`header-icon-btn ${historyOpen ? 'header-icon-btn--active' : ''}`}
          onClick={onToggleHistory}
          aria-label="Chat history"
          aria-expanded={historyOpen}
          title="Chat history"
        >
          <History size={18} strokeWidth={1.8} />
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
