import { FileText, Globe, ExternalLink } from 'lucide-react';
import { openExternalUrl } from '../../services/browserApi';
import './PageSummaryCard.css';

/**
 * Renders the structured page summary with source URL, summary paragraph,
 * and key takeaways bullet list.
 */
export default function PageSummaryCard({ summaryData }) {
  if (!summaryData) return null;

  const { title, sourceUrl, summary, keyTakeaways } = summaryData;

  const handleLinkClick = (e) => {
    e.preventDefault();
    if (sourceUrl) {
      openExternalUrl(sourceUrl);
    }
  };

  return (
    <section className="page-summary-card" aria-label="Page summary">
      {/* Header title */}
      <div className="page-summary-header">
        <FileText size={17} strokeWidth={1.8} className="page-summary-icon" />
        <h3 className="page-summary-title">Page summary</h3>
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

      {/* Inset summary paragraph */}
      <div className="page-summary-inset">
        <p className="page-summary-paragraph">{summary}</p>
      </div>

      {/* Key takeaways */}
      {keyTakeaways && keyTakeaways.length > 0 && (
        <div className="page-summary-takeaways-wrap">
          <h4 className="page-summary-takeaways-title">Key takeaways</h4>
          <ul className="page-summary-takeaways-list">
            {keyTakeaways.map((item, idx) => (
              <li key={idx} className="page-summary-takeaway-item">
                <span className="page-summary-bullet" aria-hidden="true">•</span>
                <span className="page-summary-takeaway-text">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

