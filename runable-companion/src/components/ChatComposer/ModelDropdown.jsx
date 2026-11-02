import { Sparkles, Check, Crown } from 'lucide-react';
import { modelChoices } from '../../data/demoData';

/**
 * Claude Starburst / Asterisk icon matching Reference Image 2.
 */
function ClaudeAsteriskIcon({ size = 16, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#c25e36"
      strokeWidth="2.6"
      strokeLinecap="round"
      className={className}
    >
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
    </svg>
  );
}

/**
 * OpenAI Swirl icon matching Reference Image 2.
 */
function OpenAISwirlIcon({ size = 16, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#171717"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2a10 10 0 0 1 10 10c0 4-2.5 7.5-6 9" />
      <path d="M12 6a6 6 0 0 1 6 6c0 2.5-1.5 4.5-3.5 5.5" />
      <path d="M12 10a2 2 0 0 1 2 2" />
      <circle cx="12" cy="12" r="1.5" fill="#171717" />
    </svg>
  );
}

/**
 * Model selector dropdown matching Reference Image 2.
 */
export default function ModelDropdown({
  selected = 'auto',
  onSelect,
  onClose,
}) {
  const handleSelect = (modelId) => {
    if (onSelect) {
      onSelect(modelId);
    }
    if (onClose) onClose();
  };

  const isAutoSelected = selected === 'auto';

  return (
    <div
      className="model-select-dropdown"
      role="menu"
      aria-label="Model selection menu"
    >
      {/* Top Header */}
      <div className="model-select-header">Select model</div>

      {/* Auto Recommended Card matching Reference Image 2 */}
      <button
        type="button"
        className={`model-auto-card ${
          isAutoSelected ? 'model-auto-card--selected' : ''
        }`}
        onClick={() => handleSelect('auto')}
      >
        <div className="model-auto-card-left">
          <div className="model-auto-card-icon">
            <Sparkles size={16} strokeWidth={2} />
          </div>
          <div className="model-auto-card-content">
            <div className="model-auto-title-row">
              <span className="model-auto-title">Auto</span>
              <span className="model-auto-badge">Recommended</span>
            </div>
            <span className="model-auto-subtitle">
              {modelChoices.recommended.description}
            </span>
          </div>
        </div>
        {isAutoSelected && (
          <Check size={18} strokeWidth={2.5} className="model-auto-check" />
        )}
      </button>

      {/* Section 2: Choose Model */}
      <div className="model-choose-header-wrap">
        <div className="model-choose-title">Choose model</div>
        <div className="model-choose-subtitle">
          Pick the right model for your task
        </div>
      </div>

      {/* Models List */}
      <div className="model-items-list">
        {modelChoices.list.map((m) => {
          const isSelected = selected === m.id;
          return (
            <button
              key={m.id}
              type="button"
              className={`model-list-row ${
                isSelected ? 'model-list-row--selected' : ''
              }`}
              onClick={() => handleSelect(m.id)}
            >
              <div className="model-list-row-left">
                <div className="model-list-row-icon">
                  {m.provider === 'claude' ? (
                    <ClaudeAsteriskIcon size={16} />
                  ) : (
                    <OpenAISwirlIcon size={16} />
                  )}
                </div>
                <span className="model-list-row-name">{m.name}</span>
              </div>

              <div className="model-list-row-right">
                {m.isPro && (
                  <Crown
                    size={15}
                    strokeWidth={1.8}
                    className="model-list-crown-icon"
                  />
                )}
                {isSelected && (
                  <Check size={16} strokeWidth={2.5} className="model-list-check" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

