import { User, LogOut } from 'lucide-react';
import MenuPageLayout from '../components/MenuPageLayout/MenuPageLayout';
import { defaultAccountData } from '../data/menuPagesData';

export default function AccountPage({ onBack, onSignOut }) {
  return (
    <MenuPageLayout title="Account" icon={User} onBack={onBack}>
      <div className="space-y-4 w-full max-w-full min-w-0">
        {/* User Card */}
        <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xs flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-full bg-[var(--accent-brown)] text-white flex items-center justify-center font-bold text-base shrink-0">
            S
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
              {defaultAccountData.name}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] truncate">
              {defaultAccountData.email}
            </p>
            <span className="inline-block mt-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Active Member
            </span>
          </div>
        </div>

        {/* Subscription & Details */}
        <div className="p-3.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xs space-y-2.5 text-xs min-w-0">
          <div className="flex items-center justify-between py-1 border-b border-[var(--border)]/60 gap-2">
            <span className="text-[var(--text-secondary)] shrink-0">Current Plan</span>
            <span className="font-medium text-[var(--text-primary)] truncate text-right">
              {defaultAccountData.plan}
            </span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-[var(--border)]/60 gap-2">
            <span className="text-[var(--text-secondary)] shrink-0">Member Since</span>
            <span className="text-[var(--text-primary)] shrink-0">{defaultAccountData.joined}</span>
          </div>
          <div className="flex items-center justify-between py-1 gap-2">
            <span className="text-[var(--text-secondary)] shrink-0">Environment</span>
            <span className="text-[var(--text-primary)] truncate text-right">
              Chromium Extension Sandbox
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onSignOut}
            className="w-full flex items-center justify-center gap-2 p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign out (Demo mode)</span>
          </button>
        </div>

        <div className="pt-2 text-center text-xs text-[var(--text-muted)]">
          Demo data only — no real session or auth token is maintained.
        </div>
      </div>
    </MenuPageLayout>
  );
}
