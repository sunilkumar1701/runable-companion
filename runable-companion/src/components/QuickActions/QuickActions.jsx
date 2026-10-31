import { quickActions } from '../../data/demoData';
import './QuickActions.css';

/**
 * Four quick-action cards in a horizontal row.
 */
export default function QuickActions({ onAction }) {
  return (
    <section className="quick-actions" aria-label="Quick actions">
      <div className="quick-actions-grid">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              className="quick-action-card"
              onClick={() => onAction(action.toast)}
              aria-label={action.label}
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

