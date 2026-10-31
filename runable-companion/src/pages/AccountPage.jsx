import { useState } from 'react';
import {
  X,
  Coins,
  Gift,
  CircleDollarSign,
  Headphones,
  Contrast,
  Settings,
  LogOut,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';
import { defaultAccountData } from '../data/menuPagesData';

export default function AccountPage({ onBack, onSignOut, showToast, onNavigate }) {
  const [appearanceTheme, setAppearanceTheme] = useState('System');

  const handleRowClick = (action) => {
    if (action === 'invite') {
      if (showToast) showToast('Referral link copied to clipboard (Demo)');
    } else if (action === 'affiliate') {
      if (showToast) showToast('Opening Runable Affiliate Program (Demo)');
    } else if (action === 'help') {
      if (showToast) showToast('Opening Help & Documentation (Demo)');
    } else if (action === 'appearance') {
      const next = appearanceTheme === 'System' ? 'Dark' : appearanceTheme === 'Dark' ? 'Light' : 'System';
      setAppearanceTheme(next);
      if (showToast) showToast(`Theme set to ${next} (Demo)`);
    } else if (action === 'settings') {
      if (onNavigate) {
        onNavigate('settings');
      } else if (showToast) {
        showToast('Navigating to Settings...');
      }
    }
  };

  return (
    <div className="subpage-container">
      {/* Scrollable Container Body */}
      <div className="subpage-body main-scroll" style={{ paddingTop: '16px' }}>
        {/* Profile Header Row with Close action */}
        <div className="account-profile-header">
          <div className="account-profile-info">
            {/* Avatar Circle */}
            <div className="account-avatar">
              SK
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <h2 className="account-user-name">
                {defaultAccountData.name}
              </h2>
              <p className="account-user-email">
                {defaultAccountData.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="subpage-circle-btn"
            style={{ width: '32px', height: '32px' }}
            aria-label="Close account view"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Credits Card */}
        <div className="account-credits-card">
          {/* Top row: Icon + Credits, Balance right */}
          <div className="account-credits-top">
            <div className="account-credits-label">
              <Coins size={17} strokeWidth={2} />
              <span>Credits</span>
            </div>
            <span className="account-credits-balance">
              {defaultAccountData.credits || '0 left'}
            </span>
          </div>

          {/* Bottom row: Usage and Upgrade buttons */}
          <div className="account-credits-actions">
            <button
              type="button"
              onClick={() => showToast && showToast('Credits Usage: 0 / 100k used (Demo)')}
              className="account-btn-usage"
            >
              Usage
            </button>
            <button
              type="button"
              onClick={() => showToast && showToast('Upgrade to Pro plan (Demo)')}
              className="account-btn-upgrade"
            >
              Upgrade
            </button>
          </div>
        </div>

        {/* Account Menu Navigation Rows */}
        <div className="account-menu-list">
          {/* 1. Invite */}
          <button
            type="button"
            onClick={() => handleRowClick('invite')}
            className="account-menu-row"
          >
            <div className="account-menu-left">
              <Gift size={17} strokeWidth={1.8} style={{ color: '#3a342f' }} />
              <span>Invite</span>
            </div>
            <span className="account-badge-credits">
              Earn 20k credits
            </span>
          </button>

          {/* 2. Affiliate */}
          <button
            type="button"
            onClick={() => handleRowClick('affiliate')}
            className="account-menu-row"
          >
            <div className="account-menu-left">
              <CircleDollarSign size={17} strokeWidth={1.8} style={{ color: '#3a342f' }} />
              <span>Affiliate</span>
            </div>
            <ArrowUpRight size={15} style={{ color: '#8c827a' }} />
          </button>

          {/* 3. Help */}
          <button
            type="button"
            onClick={() => handleRowClick('help')}
            className="account-menu-row"
          >
            <div className="account-menu-left">
              <Headphones size={17} strokeWidth={1.8} style={{ color: '#3a342f' }} />
              <span>Help</span>
            </div>
            <ChevronRight size={15} style={{ color: '#8c827a' }} />
          </button>

          {/* 4. Appearance */}
          <button
            type="button"
            onClick={() => handleRowClick('appearance')}
            className="account-menu-row"
          >
            <div className="account-menu-left">
              <Contrast size={17} strokeWidth={1.8} style={{ color: '#3a342f' }} />
              <span>Appearance</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '11.5px', color: '#8c827a' }}>{appearanceTheme}</span>
              <ChevronRight size={15} style={{ color: '#8c827a' }} />
            </div>
          </button>

          {/* 5. Settings */}
          <button
            type="button"
            onClick={() => handleRowClick('settings')}
            className="account-menu-row"
          >
            <div className="account-menu-left">
              <Settings size={17} strokeWidth={1.8} style={{ color: '#3a342f' }} />
              <span>Settings</span>
            </div>
            <ChevronRight size={15} style={{ color: '#8c827a' }} />
          </button>
        </div>

        {/* Separator before Log out */}
        <div className="subpage-divider" style={{ margin: '8px 0 12px' }} />

        {/* Log Out Row */}
        <div>
          <button
            type="button"
            onClick={onSignOut}
            className="account-logout-btn"
          >
            <LogOut size={16} strokeWidth={1.8} style={{ color: '#d9534f' }} />
            <span>Log out</span>
          </button>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '16px', textAlign: 'center', fontSize: '10.5px', color: '#8c827a' }}>
          Chromium Extension Demo • Runable v1.4
        </div>
      </div>
    </div>
  );
}
