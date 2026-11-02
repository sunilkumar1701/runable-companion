import { Smile, MessageSquare } from 'lucide-react';
import { agentModes } from '../../data/demoData';

/**
 * 4-bar Plan icon matching Reference Image 1.
 */
function PlanFourBarsIcon({ size = 16, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="10.5" x2="20" y2="10.5" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="4" y1="19.5" x2="20" y2="19.5" />
    </svg>
  );
}

/**
 * Dropdown menu for switching agent modes (Agent, Ask, Plan).
 * Matches Reference Image 1.
 */
export default function AgentDropdown({
  selected = 'agent',
  onSelect,
  onClose,
}) {
  const getModeIcon = (iconType) => {
    switch (iconType) {
      case 'smile':
        return <Smile size={18} strokeWidth={1.8} />;
      case 'chat':
        return <MessageSquare size={17} strokeWidth={1.8} />;
      case 'plan':
        return <PlanFourBarsIcon size={17} />;
      default:
        return <Smile size={18} strokeWidth={1.8} />;
    }
  };

  const handleSelect = (modeId) => {
    if (onSelect) {
      onSelect(modeId);
    }
    if (onClose) onClose();
  };

  return (
    <div
      className="agent-mode-dropdown"
      role="menu"
      aria-label="Agent mode selection"
    >
      <div className="agent-mode-list">
        {agentModes.map((mode) => {
          const isSelected = selected === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              className={`agent-mode-item ${
                isSelected ? 'agent-mode-item--selected' : ''
              }`}
              onClick={() => handleSelect(mode.id)}
            >
              <div className="agent-mode-item-left">
                <div className="agent-mode-item-icon">
                  {getModeIcon(mode.iconType)}
                </div>
                <div className="agent-mode-item-content">
                  <span className="agent-mode-item-title">{mode.label}</span>
                  <span className="agent-mode-item-subtitle">{mode.subtitle}</span>
                </div>
              </div>
              {isSelected && <span className="agent-mode-item-dot" />}
            </button>
          );
        })}
      </div>

      {/* Footer line with shortcut hint matching Reference Image 1 */}
      <div className="agent-mode-footer">
        <span className="agent-mode-footer-label">Switch mode</span>
        <span className="agent-mode-footer-shortcut">Ctrl Shift A</span>
      </div>
    </div>
  );
}

