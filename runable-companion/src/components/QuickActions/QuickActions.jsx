import { quickActions } from '../../data/demoData';
import './QuickActions.css';

/**
 * Four quick-action cards in a horizontal row.
 */
export default function QuickActions({ onAction, onSummarize, activeAction }) {
  const handleClick = (action) => {
    if (action.id === 'summarize') {
      if (onSummarize) {
        onSummarize();
      }
    } else {
      if (onAction) {
        onAction(action.toast);
      }
    }
  };

  return (
    <section className="quick-actions" aria-label="Quick actions">
      <div className="quick-actions-grid">
        {quickActions.map((action) => {
          const Icon = action.icon;
          const isActive = activeAction === action.id;

          return (
            <button
              key={action.id}
              type="button"
              className={`quick-action-card ${isActive ? 'quick-action-card--active' : ''}`}
              onClick={() => handleClick(action)}
              aria-label={action.label}
              aria-pressed={isActive}
            >
              <div className={`quick-action-icon ${action.accentClass}`}>
                <Icon size={22} strokeWidth={1.6} />
              </div>
              <span className="quick-action-label">{action.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
