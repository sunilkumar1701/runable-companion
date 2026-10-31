import { useState } from 'react';
import { Settings, Command, Bell, SunMoon, ExternalLink, Keyboard } from 'lucide-react';
import MenuPageLayout from '../components/MenuPageLayout/MenuPageLayout';
import { openShortcutSettings } from '../services/browserApi';

export default function SettingsPage({ onBack, showToast }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [themeMode, setThemeMode] = useState('light');

  const handleOpenShortcuts = () => {
    openShortcutSettings();
    showToast('Opening browser shortcut configuration...');
  };

  return (
    <MenuPageLayout title="Settings" icon={Settings} onBack={onBack}>
      <div className="space-y-4">
        {/* Appearance Section */}
        <div className="p-3.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
            <SunMoon size={16} />
            <span>Appearance (Demo)</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-secondary)]">Theme mode</span>
            <div className="inline-flex rounded-lg border border-[var(--border)] p-0.5 bg-[var(--surface-soft)]">
              {['light', 'dark', 'system'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setThemeMode(mode);
                    showToast(`Theme changed to ${mode} (Demo)`);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-colors ${
                    themeMode === mode
                      ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="p-3.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
            <Bell size={16} />
            <span>Notifications (Demo)</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-secondary)]">Show completion alerts</span>
            <button
              type="button"
              role="switch"
              aria-checked={notificationsEnabled}
              onClick={() => {
                const nextState = !notificationsEnabled;
                setNotificationsEnabled(nextState);
                showToast(`Notifications ${nextState ? 'enabled' : 'disabled'} (Demo)`);
              }}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                notificationsEnabled ? 'bg-[var(--accent-brown)]' : 'bg-[var(--border)]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  notificationsEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Keyboard Shortcut Section (Phase 3) */}
        <div className="p-3.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
            <Keyboard size={16} />
            <span>Keyboard Shortcut (Phase 3)</span>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Open the Runable Companion side panel from any active webpage with the configured shortcut:
          </p>

          <div className="flex items-center justify-between p-2.5 bg-[var(--surface-soft)] rounded-lg text-xs">
            <span className="text-[var(--text-secondary)]">Default shortcut</span>
            <kbd className="px-2 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-md font-mono text-[11px] font-semibold text-[var(--accent-brown)] shadow-xs">
              Alt + Shift + R
            </kbd>
          </div>

          <div className="text-xs text-[var(--text-secondary)] space-y-1.5 pt-1">
            <p className="font-medium text-[var(--text-primary)]">How to customize this shortcut:</p>
            <ol className="list-decimal pl-4 space-y-1 text-[11px] text-[var(--text-muted)]">
              <li>In Chrome, navigate to <code className="text-[var(--text-primary)] font-mono">chrome://extensions/shortcuts</code></li>
              <li>In Edge, navigate to <code className="text-[var(--text-primary)] font-mono">edge://extensions/shortcuts</code></li>
              <li>Find <strong>Runable Companion</strong> and assign your preferred key combination.</li>
            </ol>
          </div>

          <button
            type="button"
            onClick={handleOpenShortcuts}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-[var(--surface-soft)] hover:bg-[var(--border)] text-[var(--text-primary)] rounded-lg border border-[var(--border)] transition-colors"
          >
            <ExternalLink size={13} />
            <span>Configure in Browser Settings</span>
          </button>
        </div>

        <div className="pt-1 text-center text-xs text-[var(--text-muted)]">
          Local demo preferences — browser commands are managed via browser extension settings.
        </div>
      </div>
    </MenuPageLayout>
  );
}

