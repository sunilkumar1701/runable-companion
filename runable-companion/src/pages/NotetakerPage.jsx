import { useState } from 'react';
import {
  ArrowLeft,
  Settings,
  Calendar,
  CheckCircle2,
  Play,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Users,
} from 'lucide-react';
import { sampleNotes } from '../data/menuPagesData';

export default function NotetakerPage({ onBack, showToast, onNavigate }) {
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [showSavedNotes, setShowSavedNotes] = useState(false);

  const handleConnectCalendar = () => {
    const nextState = !calendarConnected;
    setCalendarConnected(nextState);
    if (showToast) {
      showToast(
        nextState
          ? 'Calendar connected successfully (Demo)'
          : 'Calendar disconnected (Demo)'
      );
    }
  };

  const handleOpenSettings = () => {
    if (onNavigate) {
      onNavigate('settings');
    } else if (showToast) {
      showToast('Opening Notetaker settings...');
    }
  };

  return (
    <div className="subpage-container">
      {/* Top Row: Back button on left + Settings button on right */}
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
          onClick={handleOpenSettings}
          className="subpage-circle-btn"
          aria-label="Notetaker Settings"
          title="Notetaker Settings"
        >
          <Settings size={16} strokeWidth={1.8} />
        </button>
      </div>

      {/* Main Scrollable Content Body */}
      <div className="subpage-body main-scroll" style={{ alignItems: 'center' }}>
        {/* Centered Hero Icon Tile */}
        <div className="notetaker-hero-tile">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
            <path d="M8 22h8" />
          </svg>
        </div>

        {/* Large Centered Heading */}
        <h1 className="notetaker-heading">Notetaker</h1>

        {/* Centered Explanatory Copy */}
        <p className="notetaker-desc">
          Notetaker joins your calls and turns them into notes, summaries, and action items. Automatically.
        </p>

        {/* Dark Connect Calendar Pill Button */}
        <button
          type="button"
          onClick={handleConnectCalendar}
          className="subpage-btn-primary notetaker-connect-btn"
        >
          <Calendar size={14} strokeWidth={2} />
          <span>{calendarConnected ? '✓ Calendar Connected' : 'Connect Calendar'}</span>
        </button>

        {/* Large Rounded Dark Preview Area */}
        <div className="notetaker-preview-container">
          {/* Header row with status badge */}
          <div className="notetaker-preview-header">
            <div className="notetaker-live-badge">
              <span className="notetaker-live-dot" />
              <span>Google Meet • Sprint 42 Sync</span>
            </div>
            <span className="notetaker-time-badge">24m 12s</span>
          </div>

          {/* Dialogue snippet simulation */}
          <div className="notetaker-dialogue-card">
            <div className="notetaker-speaker-sarah">Sarah (Product Lead)</div>
            <p className="notetaker-dialogue-text">
              “Let's summarize key architectural decisions and generate follow-up tasks directly for engineering.”
            </p>
          </div>

          <div className="notetaker-dialogue-card">
            <div className="notetaker-speaker-sunil">Sunil (Lead Engineer)</div>
            <p className="notetaker-dialogue-text">
              “Agreed. All state stays local within the Chromium session with offline fallback for tabs.”
            </p>
          </div>

          {/* Action items container */}
          <div className="notetaker-action-items-card">
            <div className="notetaker-action-items-header">
              <CheckCircle2 size={13} style={{ color: '#34d399' }} />
              <span>Extracted Action Items</span>
            </div>
            <ul className="notetaker-action-list">
              <li className="notetaker-action-item">
                <span className="notetaker-check-icon">✓</span>
                <span>Finalize Manifest V3 side panel architecture & offline storage</span>
              </li>
              <li className="notetaker-action-item">
                <span className="notetaker-check-icon">✓</span>
                <span>Verify Alt + R keyboard shortcut across Chrome and Edge</span>
              </li>
              <li className="notetaker-action-item">
                <span className="notetaker-check-icon">✓</span>
                <span>Review responsive layouts down to 320px minimum width</span>
              </li>
            </ul>
          </div>

          {/* Audio Scrubber / Waveform Mockup */}
          <div className="notetaker-scrubber-row">
            <div className="notetaker-play-circle">
              <Play size={10} fill="currentColor" />
            </div>
            <div className="notetaker-waveform">
              {[40, 70, 30, 90, 60, 100, 45, 80, 50, 75, 95, 35, 60, 85, 40, 70, 50, 30].map(
                (h, idx) => (
                  <span
                    key={idx}
                    className="notetaker-waveform-bar"
                    style={{ height: `${h}%` }}
                  />
                )
              )}
            </div>
            <span className="notetaker-scrubber-time">14:20 / 24:12</span>
          </div>
        </div>

        {/* Trusted-By Section with Soft Gradient Transition */}
        <div className="notetaker-trusted-box">
          <div className="notetaker-trusted-label">Trusted by</div>

          <div className="notetaker-trusted-logos">
            {/* Google */}
            <div className="notetaker-brand-item">
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </div>

            {/* Microsoft */}
            <div className="notetaker-brand-item">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5px', width: '13px', height: '13px' }}>
                <span style={{ backgroundColor: '#f25022', borderRadius: '0.5px' }} />
                <span style={{ backgroundColor: '#7fba00', borderRadius: '0.5px' }} />
                <span style={{ backgroundColor: '#00a4ef', borderRadius: '0.5px' }} />
                <span style={{ backgroundColor: '#ffb900', borderRadius: '0.5px' }} />
              </div>
              <span>Microsoft</span>
            </div>

            {/* Cisco */}
            <div className="notetaker-brand-item">
              <svg width="15" height="12" viewBox="0 0 24 18" fill="#049fd9">
                <rect x="1" y="8" width="2" height="10" rx="1" />
                <rect x="5" y="4" width="2" height="14" rx="1" />
                <rect x="9" y="1" width="2" height="17" rx="1" />
                <rect x="13" y="1" width="2" height="17" rx="1" />
                <rect x="17" y="4" width="2" height="14" rx="1" />
                <rect x="21" y="8" width="2" height="10" rx="1" />
              </svg>
              <span>CISCO</span>
            </div>

            {/* Vercel */}
            <div className="notetaker-brand-item">
              <svg width="13" height="11" viewBox="0 0 75 65" fill="#000000">
                <path d="M37.5 0L75 65H0z" />
              </svg>
              <span>Vercel</span>
            </div>
          </div>
        </div>

        {/* Optional Collapsible Past Notes Drawer to preserve Phase 2/3 notes */}
        <div style={{ width: '100%', paddingTop: '4px' }}>
          <button
            type="button"
            onClick={() => setShowSavedNotes(!showSavedNotes)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 14px',
              borderRadius: '12px',
              border: '1px solid #ede8e3',
              backgroundColor: '#ffffff',
              fontSize: '12px',
              fontWeight: 500,
              color: '#776b61',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={14} />
              <span>Saved Meeting Notes ({sampleNotes.length})</span>
            </div>
            {showSavedNotes ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showSavedNotes && (
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', textAlign: 'left' }}>
              {sampleNotes.map((note) => (
                <div
                  key={note.id}
                  className="plugin-workspace-card"
                  style={{ padding: '12px 14px', marginBottom: 0 }}
                >
                  <h3 style={{ fontSize: '12.5px', fontWeight: 600, color: '#171717', margin: '0 0 4px 0' }}>
                    {note.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#776b61', marginBottom: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} />
                      {note.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={11} />
                      {note.participants}
                    </span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: '#554e48', lineHeight: 1.45, margin: 0 }}>
                    {note.summary}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
