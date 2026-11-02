import { FileText, Globe, ExternalLink, AlertTriangle } from 'lucide-react';
import { openExternalUrl } from '../../services/browserApi';
import './PageSummaryCard.css';

/**
 * Parses markdown bold (**bold**) into React <strong> tags
 * and cleans up any stray markdown tokens.
 */
function formatInlineBold(text) {
  if (!text || typeof text !== 'string') return text;
  // If no bold markup, return clean string
  if (!text.includes('**')) {
    return text.replace(/[#\s]+$/, '').trim();
  }

  const parts = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <strong key={match.index} className="page-summary-bold">
        {match[1]}
      </strong>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

/**
 * Renders the structured page summary with source URL, summary paragraph,
 * and key takeaways bullet list.
 */
export default function PageSummaryCard({ summaryData }) {
  if (!summaryData) return null;

  const { title, sourceUrl, summary, keyTakeaways, warning, contentType } = summaryData;

  const handleLinkClick = (e) => {
    e.preventDefault();
    if (sourceUrl) {
      openExternalUrl(sourceUrl);
    }
  };

  // Strip trailing ## or # symbols
  const cleanSummary = (summary || '').replace(/[#\s]+$/, '').trim();

  return (
    <section className="page-summary-card" aria-label="Page summary">
      {/* Header title */}
      <div className="page-summary-header">
        <FileText size={17} strokeWidth={1.8} className="page-summary-icon" />
        <h3 className="page-summary-title">
          {contentType === 'pdf' ? 'PDF document summary' : 'Page summary'}
        </h3>
      </div>

      {/* Source URL row */}
      {sourceUrl && (
        <div className="page-summary-url-row">
          <Globe size={14} strokeWidth={1.8} className="page-summary-globe" />
          <a
            href={sourceUrl}
            onClick={handleLinkClick}
            className="page-summary-url"
            title={title || sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="page-summary-url-text">{sourceUrl}</span>
            <ExternalLink size={12} strokeWidth={1.8} className="page-summary-ext-icon" />
          </a>
        </div>
      )}

      {/* Warning banner if present (e.g. login required, scanned PDF, file:// permissions) */}
      {warning && (
        <div className="page-summary-warning-banner" role="status">
          <AlertTriangle size={14} className="page-summary-warning-icon" />
          <span className="page-summary-warning-text">{warning}</span>
        </div>
      )}

      {/* Inset summary paragraph */}
      {cleanSummary && (
        <div className="page-summary-inset">
          <p className="page-summary-paragraph">{formatInlineBold(cleanSummary)}</p>
        </div>
      )}

      {/* Key takeaways */}
      {keyTakeaways && keyTakeaways.length > 0 && (
        <div className="page-summary-takeaways-wrap">
          <h4 className="page-summary-takeaways-title">Key takeaways</h4>
          <ul className="page-summary-takeaways-list">
            {keyTakeaways.map((item, idx) => {
              const cleanItem = (item || '').replace(/^[•*-]\s*/, '').trim();
              return (
                <li key={idx} className="page-summary-takeaway-item">
                  <span className="page-summary-bullet" aria-hidden="true">•</span>
                  <span className="page-summary-takeaway-text">
                    {formatInlineBold(cleanItem)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
