import { useRef } from 'react';
import { Zap } from 'lucide-react';

/**
 * Custom SVG icons matching Reference Image 2 exactly.
 */
function UploadBoxIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="attachment-menu-icon"
    >
      <rect width="18" height="18" x="3" y="3" rx="4" />
      <path d="M12 16V8" />
      <path d="m8 12 4-4 4 4" />
    </svg>
  );
}

function NotetakerDocIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="attachment-menu-icon"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="13" y2="17" />
    </svg>
  );
}

function SoundWaveBoxIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="attachment-menu-icon"
    >
      <rect width="18" height="14" x="3" y="5" rx="3" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="16" y1="10" x2="16" y2="14" />
    </svg>
  );
}

function DesignSystemIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="attachment-menu-icon"
    >
      <circle cx="12" cy="7" r="3.5" />
      <circle cx="7" cy="17" r="3.5" />
      <circle cx="17" cy="17" r="3.5" />
    </svg>
  );
}

function ImportProjectIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="attachment-menu-icon"
    >
      <rect width="18" height="18" x="3" y="3" rx="4" />
      <path d="M12 8v8" />
      <path d="m8 12 4 4 4-4" />
    </svg>
  );
}

/**
 * Attachment popover menu triggered by the '+' button in ChatComposer.
 * Matches Reference Image 2.
 */
export default function AttachmentMenu({
  onSelectAction,
  onAttachFile,
  onClose,
}) {
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (onAttachFile) {
        onAttachFile(file);
      }
      if (onClose) onClose();
    }
  };

  const handleActionClick = (actionId) => {
    if (onSelectAction) {
      onSelectAction(actionId);
    }
    if (onClose) onClose();
  };

  return (
    <div
      className="attachment-menu-popover"
      role="menu"
      aria-label="Attachment options menu"
    >
      {/* Hidden file input for real file attachment */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />

      {/* Section 1: Add */}
      <div className="attachment-menu-section-header">Add</div>

      <div className="attachment-menu-list">
        {/* 1. Attach file */}
        <button
          type="button"
          className="attachment-menu-item attachment-menu-item--highlighted"
          onClick={handleFileClick}
        >
          <UploadBoxIcon />
          <span className="attachment-menu-item-label">Attach file</span>
        </button>

        {/* 2. Start AI Notetaker */}
        <button
          type="button"
          className="attachment-menu-item"
          onClick={() => handleActionClick('notetaker')}
        >
          <NotetakerDocIcon />
          <span className="attachment-menu-item-label">Start AI Notetaker</span>
        </button>

        {/* 3. Clone a voice */}
        <button
          type="button"
          className="attachment-menu-item"
          onClick={() => handleActionClick('clone-voice')}
        >
          <SoundWaveBoxIcon />
          <span className="attachment-menu-item-label">Clone a voice</span>
        </button>

        {/* 4. Create a skill */}
        <button
          type="button"
          className="attachment-menu-item"
          onClick={() => handleActionClick('create-skill')}
        >
          <Zap size={16} strokeWidth={1.8} className="attachment-menu-icon" />
          <span className="attachment-menu-item-label">Create a skill</span>
        </button>

        {/* 5. Create a design system */}
        <button
          type="button"
          className="attachment-menu-item"
          onClick={() => handleActionClick('design-system')}
        >
          <DesignSystemIcon />
          <span className="attachment-menu-item-label">Create a design system</span>
        </button>

        {/* 6. Import existing project */}
        <button
          type="button"
          className="attachment-menu-item"
          onClick={() => handleActionClick('import-project')}
        >
          <ImportProjectIcon />
          <span className="attachment-menu-item-label">Import existing project</span>
        </button>
      </div>

      {/* Section 2: Skills */}
      <div className="attachment-menu-section-header" style={{ marginTop: '6px' }}>
        Skills
      </div>

      <div className="attachment-menu-list">
        {/* ad-creative skill */}
        <button
          type="button"
          className="attachment-menu-item attachment-menu-item--skill"
          onClick={() => handleActionClick('skill-ad-creative')}
        >
          <Zap size={16} strokeWidth={1.8} className="attachment-menu-icon" />
          <div className="attachment-menu-skill-info">
            <span className="attachment-menu-skill-name">ad-creative</span>
            <span className="attachment-menu-skill-desc">
              Full-stack ad creative production — copy, static images, video ads with sc...
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

