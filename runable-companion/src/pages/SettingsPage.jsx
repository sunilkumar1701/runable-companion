import { useState } from 'react';
import {
  X,
  CircleUserRound,
  Receipt,
  Coins,
  UserCheck,
  AtSign,
  Zap,
  Wrench,
  Activity,
  Bot,
  Terminal,
  ChevronRight,
  ArrowRight,
  Keyboard,
  ExternalLink,
} from 'lucide-react';
import { openShortcutSettings } from '../services/browserApi';

export default function SettingsPage({ onBack, showToast, onNavigate }) {
  const [selectedRow, setSelectedRow] = useState('account');

  const handleRowClick = (id) => {
    setSelectedRow(id);
    if (id === 'account' && onNavigate) {
      onNavigate('account');
    } else if (id === 'plugins' && onNavigate) {
      onNavigate('plugins');
    } else if (id === 'notetaker' && onNavigate) {
      onNavigate('notetaker');
    } else {
      if (showToast) showToast(`${id} — demo placeholder`);
    }
  };

  const handleOpenShortcuts = () => {
    openShortcutSettings();
    if (showToast) showToast('Opening browser shortcut configuration...');
  };

  return (
    <div className="subpage-container">
      {/* Top Header Row with Settings title & Close X button */}
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <button
          type="button"
          onClick={onBack}
          className="subpage-circle-btn"
          style={{ width: '30px', height: '30px' }}
          aria-label="Close settings"
        >
          <X size={16} strokeWidth={2} />
        </button>
      </div>

      {/* Scrollable Navigation Groups */}
      <div className="subpage-body main-scroll" style={{ padding: '10px 14px 24px' }}>
        {/* Group 1: Account */}
        <div className="settings-group">
          <div className="settings-group-label">Account</div>

          {/* Account (Selected) */}
          <button
            type="button"
            onClick={() => handleRowClick('account')}
            className={`settings-nav-row ${selectedRow === 'account' ? 'settings-nav-row--selected' : ''}`}
          >
            <div className="settings-nav-left">
              <CircleUserRound size={17} strokeWidth={1.8} />
              <span>Account</span>
            </div>
            <div className="settings-nav-right">
              <ChevronRight size={15} />
            </div>
          </button>

          {/* Billing */}
          <button
            type="button"
            onClick={() => handleRowClick('billing')}
            className={`settings-nav-row ${selectedRow === 'billing' ? 'settings-nav-row--selected' : ''}`}
          >
            <div className="settings-nav-left">
              <Receipt size={17} strokeWidth={1.8} />
              <span>Billing</span>
            </div>
            <div className="settings-nav-right">
              <ChevronRight size={15} />
            </div>
          </button>

          {/* Token Usage */}
          <button
            type="button"
            onClick={() => handleRowClick('tokens')}
            className={`settings-nav-row ${selectedRow === 'tokens' ? 'settings-nav-row--selected' : ''}`}
          >
            <div className="settings-nav-left">
              <Coins size={17} strokeWidth={1.8} />
              <span>Token Usage</span>
            </div>
            <div className="settings-nav-right">
              <ChevronRight size={15} />
            </div>
          </button>
        </div>

        {/* Group 2: Customize */}
        <div className="settings-group">
          <div className="settings-group-label">Customize</div>

          {/* Personalization */}
          <button
            type="button"
            onClick={() => handleRowClick('personalization')}
            className={`settings-nav-row ${selectedRow === 'personalization' ? 'settings-nav-row--selected' : ''}`}
          >
            <div className="settings-nav-left">
              <UserCheck size={17} strokeWidth={1.8} />
              <span>Personalization</span>
            </div>
            <div className="settings-nav-right">
              <ArrowRight size={15} />
            </div>
          </button>

          {/* Plugins */}
          <button
            type="button"
            onClick={() => handleRowClick('plugins')}
            className={`settings-nav-row ${selectedRow === 'plugins' ? 'settings-nav-row--selected' : ''}`}
          >
            <div className="settings-nav-left">
              <AtSign size={17} strokeWidth={1.8} />
              <span>Plugins</span>
            </div>
            <div className="settings-nav-right">
              <ArrowRight size={15} />
            </div>
          </button>

          {/* Agent Skills */}
          <button
            type="button"
            onClick={() => handleRowClick('skills')}
            className={`settings-nav-row ${selectedRow === 'skills' ? 'settings-nav-row--selected' : ''}`}
          >
            <div className="settings-nav-left">
              <Zap size={17} strokeWidth={1.8} />
              <span>Agent Skills</span>
            </div>
            <div className="settings-nav-right">
              <ArrowRight size={15} />
            </div>
          </button>
        </div>

        {/* Group 3: Other */}
        <div className="settings-group">
          <div className="settings-group-label">Other</div>

          {/* Claw */}
          <button
            type="button"
            onClick={() => handleRowClick('claw')}
            className={`settings-nav-row ${selectedRow === 'claw' ? 'settings-nav-row--selected' : ''}`}
          >
            <div className="settings-nav-left">
              <Wrench size={17} strokeWidth={1.8} />
              <span>Claw</span>
            </div>
            <div className="settings-nav-right">
              <ChevronRight size={15} />
            </div>
          </button>

          {/* Flow */}
          <button
            type="button"
            onClick={() => handleRowClick('flow')}
            className={`settings-nav-row ${selectedRow === 'flow' ? 'settings-nav-row--selected' : ''}`}
          >
            <div className="settings-nav-left">
              <Activity size={17} strokeWidth={1.8} />
              <span>Flow</span>
            </div>
            <div className="settings-nav-right">
              <ChevronRight size={15} />
            </div>
          </button>

          {/* Notetaker */}
          <button
            type="button"
            onClick={() => handleRowClick('notetaker')}
            className={`settings-nav-row ${selectedRow === 'notetaker' ? 'settings-nav-row--selected' : ''}`}
          >
            <div className="settings-nav-left">
              <Bot size={17} strokeWidth={1.8} />
              <span>Notetaker</span>
            </div>
            <div className="settings-nav-right">
              <ChevronRight size={15} />
            </div>
          </button>

          {/* MCP */}
          <button
            type="button"
            onClick={() => handleRowClick('mcp')}
            className={`settings-nav-row ${selectedRow === 'mcp' ? 'settings-nav-row--selected' : ''}`}
          >
            <div className="settings-nav-left">
              <Terminal size={17} strokeWidth={1.8} />
              <span>MCP</span>
            </div>
            <div className="settings-nav-right">
              <ChevronRight size={15} />
            </div>
          </button>
        </div>

        {/* Group 4: Shortcuts (Preserved Phase 3 configuration) */}
        <div className="settings-group">
          <div className="settings-group-label">Keyboard Shortcuts</div>

          <div
            className="plugin-workspace-card"
            style={{ padding: '12px 14px', marginBottom: 0 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Keyboard size={16} style={{ color: '#171717' }} />
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#171717' }}>Open Side Panel</span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  color: '#1c1815',
                  backgroundColor: '#f1ebe5',
                  border: '1px solid #ded6cc',
                  padding: '2px 8px',
                  borderRadius: '6px',
                }}
              >
                Alt + R
              </span>
            </div>
            <p style={{ fontSize: '11.5px', color: '#776b61', margin: '4px 0 10px 0', lineHeight: 1.4 }}>
              Toggle the Runable Companion side panel from any browser tab without conflicting with Edge or Chrome shortcuts.
            </p>
            <button
              type="button"
              onClick={handleOpenShortcuts}
              className="subpage-btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>Configure Shortcuts in Browser</span>
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
