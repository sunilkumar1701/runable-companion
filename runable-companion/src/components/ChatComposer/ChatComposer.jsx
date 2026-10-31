import { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, Mic, ChevronDown, Smile, Send, Folder, Paperclip, X } from 'lucide-react';
import Dropdown from '../Dropdown/Dropdown';
import ProjectDropdown from './ProjectDropdown';
import PluginsQuickDropdown from './PluginsQuickDropdown';
import AttachmentMenu from './AttachmentMenu';
import { agentOptions, modelOptions, initialProjects } from '../../data/demoData';
import './ChatComposer.css';

/**
 * Interlocking Link/Plug icon matching Reference Images 1 & 2 for Plugins.
 */
function InterlockingLinkIcon({ size = 14, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

/**
 * Chat composer anchored to the bottom of the panel.
 * Includes:
 * 1. Main composer textarea with toolbar (+, Agent, Auto, Mic/Send)
 * 2. Attachment Menu popover matching Reference Image 2 (replaces toast on '+' click)
 * 3. Bottom sub-toolbar with "Choose project" and "Plugins" pills (Reference Images 1 & 2)
 */
export default function ChatComposer({
  onSendMessage,
  showToast,
  onNavigate,
  placeholder = 'Ask Runable anything...',
}) {
  const [value, setValue] = useState('');
  const [agentOpen, setAgentOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('agent');
  const [selectedModel, setSelectedModel] = useState('auto');
  const textareaRef = useRef(null);

  // Attachment Menu state (Reference Image 2)
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const attachWrapRef = useRef(null);

  // Sub-toolbar state for "Choose project" and "Plugins" (Reference Image 1)
  const [activeSubMenu, setActiveSubMenu] = useState(null); // 'project' | 'plugins' | null
  const [projects, setProjects] = useState(initialProjects);
  const [selectedProject, setSelectedProject] = useState(null);
  const subToolbarRef = useRef(null);

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (subToolbarRef.current && !subToolbarRef.current.contains(event.target)) {
        setActiveSubMenu(null);
      }
      if (attachWrapRef.current && !attachWrapRef.current.contains(event.target)) {
        setAttachmentMenuOpen(false);
      }
    }

    if (activeSubMenu || attachmentMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeSubMenu, attachmentMenuOpen]);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed && attachedFiles.length === 0) return;

    const fullMessage = attachedFiles.length > 0
      ? `${trimmed ? trimmed + ' ' : ''}[Attached: ${attachedFiles.map((f) => f.name).join(', ')}]`
      : trimmed;

    if (onSendMessage) {
      onSendMessage(fullMessage);
    } else if (showToast) {
      showToast(`Demo message: "${fullMessage.slice(0, 60)}"`);
    }

    setValue('');
    setAttachedFiles([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, attachedFiles, onSendMessage, showToast]);

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

  const handleCreateProject = (name) => {
    const newProj = {
      id: `proj-${Date.now()}`,
      name,
    };
    setProjects((prev) => [newProj, ...prev]);
    setSelectedProject(newProj);
    setActiveSubMenu(null);
    if (showToast) showToast(`Project created: "${name}"`);
  };

  const handleSelectProject = (proj) => {
    setSelectedProject(proj);
    setActiveSubMenu(null);
    if (showToast) showToast(`Switched to "${proj.name}"`);
  };

  const handleSelectPluginCategory = (cat) => {
    setActiveSubMenu(null);
    if (showToast) showToast(`${cat.name} — demo placeholder`);
  };

  const handleConnectPlugins = () => {
    setActiveSubMenu(null);
    if (onNavigate) {
      onNavigate('plugins');
    } else if (showToast) {
      showToast('Opening Plugins...');
    }
  };

  const handleAttachmentAction = (actionId) => {
    setAttachmentMenuOpen(false);

    if (actionId === 'notetaker') {
      if (onNavigate) {
        onNavigate('notetaker');
      } else if (showToast) {
        showToast('Opening AI Notetaker...');
      }
    } else if (actionId === 'clone-voice') {
      setValue('Clone a voice: Please analyze my voice sample and configure narration style for ');
      if (textareaRef.current) textareaRef.current.focus();
    } else if (actionId === 'create-skill') {
      setValue('Create a new custom skill for ');
      if (textareaRef.current) textareaRef.current.focus();
    } else if (actionId === 'design-system') {
      setValue('Create a design system with components, color palette, and typography for ');
      if (textareaRef.current) textareaRef.current.focus();
    } else if (actionId === 'import-project') {
      setActiveSubMenu('project');
    } else if (actionId === 'skill-ad-creative') {
      setValue('Generate an ad-creative campaign including copy, static images, and video ad concepts for ');
      if (textareaRef.current) textareaRef.current.focus();
    }
  };

  const currentAgent = agentOptions.find((a) => a.id === selectedAgent);
  const currentModel = modelOptions.find((m) => m.id === selectedModel);

  return (
    <div className="composer-wrapper">
      {/* Main Composer Box */}
      <div className="composer">
        {/* Attached files preview chips */}
        {attachedFiles.length > 0 && (
          <div className="composer-attachments-row">
            {attachedFiles.map((file, idx) => (
              <div key={idx} className="composer-attachment-chip">
                <Paperclip size={12} strokeWidth={2} />
                <span className="composer-attachment-name">{file.name}</span>
                <button
                  type="button"
                  className="composer-attachment-remove"
                  onClick={() => setAttachedFiles((prev) => prev.filter((_, i) => i !== idx))}
                  title="Remove attachment"
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>
        )}

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
          {/* Plus button + Attachment Menu (Reference Image 2) - NO TOAST */}
          <div className="composer-attach-wrap" ref={attachWrapRef}>
            <button
              type="button"
              className={`composer-btn composer-btn--circle ${
                attachmentMenuOpen ? 'composer-btn--circle-active' : ''
              }`}
              onClick={() => {
                setAttachmentMenuOpen((prev) => !prev);
                setAgentOpen(false);
                setModelOpen(false);
                setActiveSubMenu(null);
              }}
              aria-label="Add attachment"
              aria-expanded={attachmentMenuOpen}
              title="Add attachment"
            >
              <Plus size={18} strokeWidth={2} />
            </button>

            {attachmentMenuOpen && (
              <AttachmentMenu
                onAttachFile={(file) => {
                  setAttachedFiles((prev) => [...prev, file]);
                  setAttachmentMenuOpen(false);
                }}
                onSelectAction={handleAttachmentAction}
                onClose={() => setAttachmentMenuOpen(false)}
              />
            )}
          </div>

          {/* Agent selector */}
          <div className="composer-selector-wrap">
            <button
              type="button"
              className="composer-btn composer-btn--pill"
              onClick={() => {
                setAgentOpen(!agentOpen);
                setModelOpen(false);
                setActiveSubMenu(null);
                setAttachmentMenuOpen(false);
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
                setActiveSubMenu(null);
                setAttachmentMenuOpen(false);
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
          {value.trim() || attachedFiles.length > 0 ? (
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

      {/* Sub-toolbar below chatbox matching Reference Image 1 & 2 */}
      <div className="composer-sub-toolbar" ref={subToolbarRef}>
        {/* Choose project Pill */}
        <div className="composer-sub-btn-wrap">
          <button
            type="button"
            className={`composer-sub-btn ${
              activeSubMenu === 'project' ? 'composer-sub-btn--active' : ''
            }`}
            onClick={() => {
              setActiveSubMenu((prev) => (prev === 'project' ? null : 'project'));
              setAgentOpen(false);
              setModelOpen(false);
              setAttachmentMenuOpen(false);
            }}
            aria-expanded={activeSubMenu === 'project'}
            aria-label="Choose project"
          >
            <Folder size={14} strokeWidth={1.8} />
            <span>{selectedProject ? selectedProject.name : 'Choose project'}</span>
          </button>

          {activeSubMenu === 'project' && (
            <ProjectDropdown
              projects={projects}
              selectedProject={selectedProject}
              onSelectProject={handleSelectProject}
              onCreateProject={handleCreateProject}
              onClose={() => setActiveSubMenu(null)}
            />
          )}
        </div>

        {/* Plugins Pill */}
        <div className="composer-sub-btn-wrap">
          <button
            type="button"
            className={`composer-sub-btn ${
              activeSubMenu === 'plugins' ? 'composer-sub-btn--active' : ''
            }`}
            onClick={() => {
              setActiveSubMenu((prev) => (prev === 'plugins' ? null : 'plugins'));
              setAgentOpen(false);
              setModelOpen(false);
              setAttachmentMenuOpen(false);
            }}
            aria-expanded={activeSubMenu === 'plugins'}
            aria-label="Plugins"
          >
            <InterlockingLinkIcon size={14} />
            <span>Plugins</span>
          </button>

          {activeSubMenu === 'plugins' && (
            <PluginsQuickDropdown
              onSelectCategory={handleSelectPluginCategory}
              onConnectPlugins={handleConnectPlugins}
              onClose={() => setActiveSubMenu(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
