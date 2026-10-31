import { ArrowLeft } from 'lucide-react';
import './MenuPageLayout.css';

/**
 * Reusable page wrapper for in-extension pages navigated from the More options menu.
 */
export default function MenuPageLayout({ title, icon: Icon, onBack, children }) {
  return (
    <div className="menu-page-container">
      {/* Subpage Header */}
      <header className="menu-page-header">
        <button
          type="button"
          className="menu-page-back-btn"
          onClick={onBack}
          aria-label="Go back to chat"
          title="Go back"
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </button>

        <div className="menu-page-title-wrap">
          {Icon && <Icon size={18} strokeWidth={1.8} className="menu-page-title-icon" />}
          <h2 className="menu-page-title">{title}</h2>
        </div>
      </header>

      {/* Scrollable Subpage Body */}
      <div className="menu-page-body main-scroll">{children}</div>
    </div>
  );
}

