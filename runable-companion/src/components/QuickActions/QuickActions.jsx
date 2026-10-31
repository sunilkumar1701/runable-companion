import { useState } from 'react';
import { quickActions } from '../../data/demoData';
import MoreToolsSection from './MoreToolsSection';
import './QuickActions.css';

/**
 * Four quick-action cards in a horizontal row, or expanded More Tools categories
 * (Code, Productivity, Content Creation) matching Reference Images 3 and 4.
 */
export default function QuickActions({
  onAction,
  onSummarize,
  onSelectTool,
  activeAction,
}) {
  const [isMoreToolsOpen, setIsMoreToolsOpen] = useState(false);

  const handleClick = (action) => {
    if (action.id === 'summarize') {
      if (onSummarize) {
        onSummarize();
      }
    } else if (action.id === 'more-tools') {
      setIsMoreToolsOpen(true);
    } else {
      if (onAction) {
        onAction(action.toast);
      }
    }
  };

  const handleToolSelection = (tool) => {
    if (tool.id === 'slides') {
      if (onAction) onAction('Create slides — demo placeholder');
    } else if (tool.id === 'report') {
      if (onAction) onAction('Create report — demo placeholder');
    } else if (onSelectTool) {
      onSelectTool(tool);
    } else if (onAction) {
      onAction(`Tool selected: ${tool.title} (Demo)`);
    }
  };

  // If More Tools is open, display the 3 category accordions (Reference Images 3 & 4)
  if (isMoreToolsOpen) {
    return (
      <section className="quick-actions-more-section" aria-label="More tools">
        <MoreToolsSection
          onBack={() => setIsMoreToolsOpen(false)}
          onSelectTool={handleToolSelection}
          onAction={onAction}
        />
      </section>
    );
  }

  // Standard 4 quick action cards
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
