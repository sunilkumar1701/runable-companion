import { useState } from 'react';
import { Plus, Folder, Check, X } from 'lucide-react';

/**
 * Dropdown menu for selecting or creating a project.
 * Matches Reference Image 1.
 */
export default function ProjectDropdown({
  projects = [],
  selectedProject,
  onSelectProject,
  onCreateProject,
  onClose,
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const trimmed = newProjectName.trim();
    if (trimmed) {
      if (onCreateProject) {
        onCreateProject(trimmed);
      }
      setNewProjectName('');
      setIsCreating(false);
    }
  };

  return (
    <div
      className="project-dropdown"
      role="menu"
      aria-label="Project selection menu"
    >
      {/* "+ New project" action row */}
      {!isCreating ? (
        <button
          type="button"
          className="project-dropdown-action-btn"
          onClick={() => setIsCreating(true)}
        >
          <Plus size={16} strokeWidth={2} />
          <span>New project</span>
        </button>
      ) : (
        <form onSubmit={handleCreateSubmit} className="project-dropdown-new-form">
          <input
            type="text"
            autoFocus
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Project name..."
            className="project-dropdown-new-input"
          />
          <div className="project-dropdown-new-btns">
            <button
              type="submit"
              className="project-dropdown-confirm-btn"
              title="Create project"
              disabled={!newProjectName.trim()}
            >
              <Check size={14} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              className="project-dropdown-cancel-btn"
              title="Cancel"
              onClick={() => {
                setIsCreating(false);
                setNewProjectName('');
              }}
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>
        </form>
      )}

      {/* Divider */}
      {projects.length > 0 && <div className="project-dropdown-divider" />}

      {/* Project list */}
      <div className="project-dropdown-list">
        {projects.map((proj) => {
          const isSelected = selectedProject?.id === proj.id;
          return (
            <button
              key={proj.id}
              type="button"
              className={`project-dropdown-item ${isSelected ? 'project-dropdown-item--selected' : ''}`}
              onClick={() => {
                onSelectProject(proj);
                if (onClose) onClose();
              }}
            >
              <div className="project-dropdown-item-info">
                <Folder size={14} strokeWidth={1.8} className="project-dropdown-item-icon" />
                <span className="project-dropdown-item-name">{proj.name}</span>
              </div>
              {isSelected && <Check size={14} strokeWidth={2.5} className="project-dropdown-item-check" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

