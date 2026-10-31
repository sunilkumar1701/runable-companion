import './SummaryLoadingState.css';

/**
 * Compact progress banner displayed while page content is being read and summarized.
 */
export default function SummaryLoadingState() {
  return (
    <div className="summary-loading-banner" role="status" aria-live="polite">
      <div className="summary-loading-spinner" aria-hidden="true" />
      <div className="summary-loading-text">
        <span className="summary-loading-title">Summarizing this page...</span>
        <span className="summary-loading-desc">Reading page content and generating a summary...</span>
      </div>
    </div>
  );
}

