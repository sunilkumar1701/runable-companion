import { useState } from 'react';
import { ArrowLeft, Search, Clock, ChevronDown, Bell, Calendar, Plus } from 'lucide-react';

export default function ScheduledTasksPage({ onBack }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState([]);

  const filterChips = ['All', 'Active', 'Paused', 'Completed'];

  const handleCreateTask = () => {
    // Action handled without toast popup
  };

  return (
    <div className="subpage-container">
      {/* Top Row: Back button + Create button */}
      <div className="subpage-top-bar">
        <button
          type="button"
          onClick={onBack}
          className="subpage-circle-btn"
          aria-label="Back to home"
          title="Back"
        >
          <ArrowLeft size={16} strokeWidth={2} />
        </button>

        <button
          type="button"
          onClick={handleCreateTask}
          className="subpage-btn-primary"
        >
          <span>Create</span>
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Main Scrollable Content Body */}
      <div className="subpage-body main-scroll">
        {/* Title & Subtitle */}
        <div className="subpage-header-text">
          <h1 className="subpage-title">Scheduled tasks</h1>
          <p className="subpage-subtitle">
            Ask Runable to schedule tasks, set reminders, or monitor for updates.
          </p>
        </div>

        {/* Search Field */}
        <div className="subpage-search-wrap">
          <div className="subpage-search-icon">
            <Search size={16} strokeWidth={2} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scheduled tasks"
            className="subpage-search-input"
          />
        </div>

        {/* Filter Chips */}
        <div className="subpage-chips-row">
          {filterChips.map((chip) => {
            const isSelected = activeFilter === chip;
            return (
              <button
                key={chip}
                type="button"
                onClick={() => setActiveFilter(chip)}
                className={`subpage-chip ${isSelected ? 'subpage-chip--active' : ''}`}
              >
                {chip}
              </button>
            );
          })}
        </div>

        {/* Centered Empty State */}
        <div className="subpage-empty-state">
          <div className="subpage-empty-icon">
            <Clock size={40} strokeWidth={1.7} />
          </div>
          <h2 className="subpage-empty-title">No scheduled tasks yet</h2>
          <p className="subpage-empty-desc">
            Schedule a task and Runable will run it for you automatically.
          </p>
          <button
            type="button"
            onClick={handleCreateTask}
            className="subpage-btn-secondary"
          >
            New Task
          </button>
        </div>

        {/* Thin Divider */}
        <div className="subpage-divider" />

        {/* Suggestions Section */}
        <div>
          <h2 className="subpage-section-title">Suggestions</h2>

          <div className="suggestions-list">
            {/* Suggestion 1: Daily brief */}
            <div className="suggestion-row">
              <div className="suggestion-icon-wrap" style={{ color: '#e07a2a', backgroundColor: '#fef3eb' }}>
                <Bell size={16} strokeWidth={2} />
              </div>
              <div className="suggestion-content">
                <div className="suggestion-header-line">
                  <span className="suggestion-title">Daily brief</span>
                  <span className="suggestion-cadence">Weekdays at 8:00 AM</span>
                </div>
                <p className="suggestion-desc">
                  Start each weekday with a summary of your calendar, unread email, and priorities.
                </p>
              </div>
            </div>

            {/* Suggestion 2: Weekly review */}
            <div className="suggestion-row">
              <div className="suggestion-icon-wrap" style={{ color: '#7c3aed', backgroundColor: '#f5f3ff' }}>
                <Calendar size={16} strokeWidth={2} />
              </div>
              <div className="suggestion-content">
                <div className="suggestion-header-line">
                  <span className="suggestion-title">Weekly review</span>
                  <span className="suggestion-cadence">Weekly at 4:00 PM</span>
                </div>
                <p className="suggestion-desc">
                  Turn your recent work into a concise weekly update.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
