import { useState } from 'react';
import { ArrowLeft, Search, PlusCircle, X, FileText, Presentation, LineChart } from 'lucide-react';
import { sampleArtifacts } from '../data/menuPagesData';

export default function ArtifactsPage({ onBack }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Artifacts');
  const [artifactsList, setArtifactsList] = useState([]);
  const [selectedArtifact, setSelectedArtifact] = useState(null);

  const categories = ['All Artifacts', 'Images', 'Videos', 'Websites'];

  const handleCreateArtifact = () => {
    const newArt = {
      id: `art-${Date.now()}`,
      title: 'New Strategy Deck',
      type: 'Presentation',
      created: 'Just now',
      status: 'Draft',
      description: 'Auto-generated presentation deck from your active workspace discussion.',
    };
    setArtifactsList([newArt, ...artifactsList]);
  };

  const filteredArtifacts = artifactsList.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedCategory === 'All Artifacts') return matchesSearch;
    if (selectedCategory === 'Images') return matchesSearch && art.type === 'Image';
    if (selectedCategory === 'Videos') return matchesSearch && art.type === 'Video';
    if (selectedCategory === 'Websites') return matchesSearch && art.type === 'Website';
    return matchesSearch;
  });

  return (
    <div className="subpage-container">
      {/* Top Bar with back navigation */}
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
      </div>

      {/* Scrollable Content Body */}
      <div className="subpage-body main-scroll">
        {/* Title & Subtitle */}
        <div className="subpage-header-text">
          <h1 className="subpage-title">Artifacts</h1>
          <p className="subpage-subtitle">
            Reports, slides, sheets, sites, and media Runable has made for you.
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
            placeholder="Search artifacts"
            className="subpage-search-input"
          />
        </div>

        {/* Category Chips */}
        <div className="subpage-chips-row">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`subpage-chip ${isSelected ? 'subpage-chip--active' : ''}`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Content View: Empty State or Artifacts List */}
        {filteredArtifacts.length === 0 ? (
          <div className="subpage-empty-state">
            {/* Centered Archive Tray Outline Icon */}
            <div className="subpage-empty-icon">
              <svg
                width="50"
                height="50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-8Z" />
                <path d="M4 14h4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2h4" />
                <path d="M7 6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2" />
                <path d="M9 2h6" />
              </svg>
            </div>

            <h2 className="subpage-empty-title">Your artifacts will live here</h2>
            <p className="subpage-empty-desc">
              Images, videos, websites, slides, and files from your chats will appear here.
            </p>

            <button
              type="button"
              onClick={handleCreateArtifact}
              className="subpage-btn-primary"
            >
              <PlusCircle size={14} strokeWidth={2} />
              <span>Create artifact</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredArtifacts.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArtifact(art)}
                className="plugin-workspace-card"
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', color: '#776b61' }}>{art.type}</span>
                  <span style={{ fontSize: '11px', color: '#776b61' }}>{art.created}</span>
                </div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: '#171717', margin: '0 0 4px 0' }}>
                  {art.title}
                </h3>
                <p style={{ fontSize: '12px', color: '#776b61', margin: 0, lineHeight: 1.4 }}>
                  {art.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Artifact Preview Modal (demo) */}
      {selectedArtifact && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 50,
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '20px',
              width: '100%',
              maxWidth: '380px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#776b61', textTransform: 'uppercase' }}>
                {selectedArtifact.type}
              </span>
              <button
                type="button"
                onClick={() => setSelectedArtifact(null)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#776b61' }}
              >
                <X size={18} />
              </button>
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#171717', marginBottom: '8px' }}>
              {selectedArtifact.title}
            </h3>
            <p style={{ fontSize: '12.5px', color: '#776b61', lineHeight: 1.5, marginBottom: '16px' }}>
              {selectedArtifact.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setSelectedArtifact(null)}
                className="subpage-btn-primary"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
