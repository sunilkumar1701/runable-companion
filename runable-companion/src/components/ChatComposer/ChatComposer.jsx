import { useState, useRef, useCallback } from 'react';
import { Plus, Mic, ChevronDown, Smile, Send } from 'lucide-react';
import Dropdown from '../Dropdown/Dropdown';
import { agentOptions, modelOptions } from '../../data/demoData';
import './ChatComposer.css';

/**
 * Chat composer anchored to the bottom of the panel.
 * Includes multiline input, plus, agent selector, model selector, and microphone.
 */
export default function ChatComposer({
  onSendMessage,
  showToast,
  placeholder = 'Ask Runable anything...',
}) {
  const [value, setValue] = useState('');
  const [agentOpen, setAgentOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('agent');
  const [selectedModel, setSelectedModel] = useState('auto');
  const textareaRef = useRef(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;

    if (onSendMessage) {
      onSendMessage(trimmed);
    } else if (showToast) {
      showToast(`Demo message: "${trimmed.slice(0, 60)}"`);
    }

    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, onSendMessage, showToast]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleInput = (e) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const currentAgent = agentOptions.find((a) => a.id === selectedAgent);
  const currentModel = modelOptions.find((m) => m.id === selectedModel);

  return (
    <div className="composer-wrapper">
      <div className="composer">
        <textarea
          ref={textareaRef}
          className="composer-input"
          placeholder={placeholder}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          aria-label="Chat message input"
        />

        <div className="composer-toolbar">
          {/* Plus button */}
          <button
            type="button"
            className="composer-btn composer-btn--circle"
            onClick={() => showToast && showToast('Attach — demo placeholder')}
            aria-label="Add attachment"
            title="Add attachment"
          >
            <Plus size={18} strokeWidth={2} />
          </button>

          {/* Agent selector */}
          <div className="composer-selector-wrap">
            <button
              type="button"
              className="composer-btn composer-btn--pill"
              onClick={() => {
                setAgentOpen(!agentOpen);
                setModelOpen(false);
              }}
              aria-label="Select agent"
              aria-expanded={agentOpen}
              aria-haspopup="listbox"
            >
              <Smile size={16} strokeWidth={1.8} />
              <span>{currentAgent?.label}</span>
              <ChevronDown size={14} strokeWidth={2} />
            </button>
            {agentOpen && (
              <Dropdown
                options={agentOptions}
                selected={selectedAgent}
                onSelect={setSelectedAgent}
                onClose={() => setAgentOpen(false)}
                className="composer-dropdown composer-dropdown--left"
              />
            )}
          </div>

          <div className="composer-spacer" />

          {/* Model selector */}
          <div className="composer-selector-wrap">
            <button
              type="button"
              className="composer-btn composer-btn--compact"
              onClick={() => {
                setModelOpen(!modelOpen);
                setAgentOpen(false);
              }}
              aria-label="Select model"
              aria-expanded={modelOpen}
              aria-haspopup="listbox"
            >
              <span>{currentModel?.label}</span>
              <ChevronDown size={14} strokeWidth={2} />
            </button>
            {modelOpen && (
              <Dropdown
                options={modelOptions}
                selected={selectedModel}
                onSelect={setSelectedModel}
                onClose={() => setModelOpen(false)}
                className="composer-dropdown composer-dropdown--right"
              />
            )}
          </div>

          {/* Send or Microphone button */}
          {value.trim() ? (
            <button
              type="button"
              className="composer-btn composer-btn--circle composer-btn--send"
              onClick={handleSend}
              aria-label="Send message"
              title="Send message"
            >
              <Send size={16} strokeWidth={2} />
            </button>
          ) : (
            <button
              type="button"
              className="composer-btn composer-btn--circle"
              onClick={() => showToast && showToast('Voice input — demo placeholder')}
              aria-label="Voice input"
              title="Voice input"
            >
              <Mic size={18} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
