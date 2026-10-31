import { FileText, X, Globe, ExternalLink } from 'lucide-react';
import { openExternalUrl } from '../../services/browserApi';
import './SelectedContextCard.css';

/**
 * Displays the selected text snippet and source webpage link.
 */
export default function SelectedContextCard({ context, onClose }) {
  if (!context || !context.selectedText) return null;

  const { selectedText, pageUrl, pageTitle } = context;

  const handleLinkClick = (e) => {
    e.preventDefault();
    if (pageUrl) {
      openExternalUrl(pageUrl);
    }
  };

  return (
    <div className="selected-context-card" role="region" aria-label="Selected from webpage">
      {/* Top Header */}
      <div className="selected-context-header">
        <div className="selected-context-title-wrap">
          <FileText size={17} strokeWidth={1.8} className="selected-context-doc-icon" />
          <span className="selected-context-title">Selected from webpage</span>
        </div>
        <button
          type="button"
          className="selected-context-close-btn"
          onClick={onClose}
          aria-label="Remove webpage context"
          title="Remove webpage context"
        >
          <X size={15} strokeWidth={2} />
        </button>
      </div>

      {/* Selected text content */}
      <div className="selected-context-body">
        <p className="selected-context-text">{selectedText}</p>
      </div>

      {/* Source URL row */}
      {pageUrl && (
        <div className="selected-context-footer">
          <Globe size={14} strokeWidth={1.8} className="selected-context-globe-icon" />
          <a
            href={pageUrl}
            onClick={handleLinkClick}
            className="selected-context-url"
            title={pageTitle || pageUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="selected-context-url-text">{pageUrl}</span>
            <ExternalLink size={12} strokeWidth={1.8} className="selected-context-ext-icon" />
          </a>
        </div>
      )}
    </div>
  );
}

