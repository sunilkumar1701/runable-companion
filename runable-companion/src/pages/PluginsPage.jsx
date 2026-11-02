import { useState } from 'react';
import { ArrowLeft, Search, ListFilter, Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PluginsPage({ onBack }) {
  const [activeTab, setActiveTab] = useState('Plugins');
  const [activeFilter, setActiveFilter] = useState('Discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [googleConnected, setGoogleConnected] = useState(false);
  const [msConnected, setMsConnected] = useState(false);
  const [linkedinConnected, setLinkedinConnected] = useState(false);

  const filterChips = ['Discover', 'Connected', 'Included with Runable'];

  const toggleConnect = (provider, state, setter) => {
    setter(!state);
  };

  return (
    <div className="subpage-container">
      {/* Top Row: Back button + Add Custom Plugin */}
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
          className="subpage-btn-primary"
        >
          Add Custom Plugin
        </button>
      </div>

      {/* Main Scrollable Content Body */}
      <div className="subpage-body main-scroll">
        {/* Navigation Tabs: Plugins, Workflows, Skills */}
        <div className="plugins-tabs-row">
          {['Plugins', 'Workflows', 'Skills'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`plugins-tab-btn ${isActive ? 'plugins-tab-btn--active' : ''}`}
              >
                {tab}
              </button>
            );
          })}
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
            placeholder="Search"
            className="subpage-search-input"
          />
        </div>

        {/* Filter Chips Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '14px' }}>
          <div className="subpage-chips-row" style={{ marginBottom: 0, flex: 1 }}>
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

          <button
            type="button"
            className="subpage-circle-btn"
            style={{ width: '30px', height: '30px' }}
            aria-label="Filter"
            title="Filter"
          >
            <ListFilter size={14} />
          </button>
        </div>

        {/* Workspaces Section */}
        <div>
          <h2 className="subpage-section-title">Workspaces</h2>

          {/* Google Card */}
          <div className="plugin-workspace-card">
            <div className="plugin-workspace-card-header">
              {/* Google G Logo Tile */}
              <div className="plugin-logo-tile">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.31 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.21 0 10.05 0 12s.46 3.79 1.27 5.42l4.01-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              </div>

              <button
                type="button"
                onClick={() => toggleConnect('Google', googleConnected, setGoogleConnected)}
                className="subpage-btn-secondary"
              >
                {googleConnected ? (
                  <>
                    <Check size={13} style={{ color: '#10b981' }} />
                    <span>Connected</span>
                  </>
                ) : (
                  <span>Connect</span>
                )}
              </button>
            </div>

            <h3 className="plugin-workspace-title">Google</h3>
            <p className="plugin-workspace-desc">
              Connect once — Gmail, Drive, Docs, Sheets, Calendar and more.
            </p>
          </div>

          {/* Microsoft Card */}
          <div className="plugin-workspace-card">
            <div className="plugin-workspace-card-header">
              {/* Microsoft 4-Color Logo Tile */}
              <div className="plugin-logo-tile">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2px', width: '18px', height: '18px' }}>
                  <span style={{ backgroundColor: '#f25022', borderRadius: '1px' }} />
                  <span style={{ backgroundColor: '#7fba00', borderRadius: '1px' }} />
                  <span style={{ backgroundColor: '#00a4ef', borderRadius: '1px' }} />
                  <span style={{ backgroundColor: '#ffb900', borderRadius: '1px' }} />
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleConnect('Microsoft', msConnected, setMsConnected)}
                className="subpage-btn-secondary"
              >
                {msConnected ? (
                  <>
                    <Check size={13} style={{ color: '#10b981' }} />
                    <span>Connected</span>
                  </>
                ) : (
                  <span>Connect</span>
                )}
              </button>
            </div>

            <h3 className="plugin-workspace-title">Microsoft</h3>
            <p className="plugin-workspace-desc">
              Connect once — Outlook, Calendar, OneDrive and Excel.
            </p>
          </div>
        </div>

        {/* Social Section */}
        <div>
          <div className="plugins-social-header">
            <h2 className="subpage-section-title" style={{ margin: 0 }}>Social</h2>
            <div className="plugins-social-actions">
              <button
                type="button"
                className="plugins-view-all-btn"
              >
                View all
              </button>
              <button
                type="button"
                className="plugins-nav-btn"
                aria-label="Previous"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                className="plugins-nav-btn"
                aria-label="Next"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* LinkedIn Integration Row */}
          <div className="plugin-social-item">
            <div className="plugin-social-left">
              <div className="plugin-social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </div>
              <span className="plugin-social-name">LinkedIn</span>
            </div>

            <button
              type="button"
              onClick={() => toggleConnect('LinkedIn', linkedinConnected, setLinkedinConnected)}
              className="subpage-circle-btn"
              style={{ width: '30px', height: '30px' }}
              aria-label="Connect LinkedIn"
            >
              {linkedinConnected ? (
                <Check size={14} style={{ color: '#10b981' }} />
              ) : (
                <Plus size={15} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
