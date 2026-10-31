import { useState } from 'react';
import { AtSign, Check, ExternalLink } from 'lucide-react';
import MenuPageLayout from '../components/MenuPageLayout/MenuPageLayout';
import { samplePlugins } from '../data/menuPagesData';

export default function PluginsPage({ onBack, showToast }) {
  const [plugins, setPlugins] = useState(samplePlugins);

  const toggleConnect = (id, name) => {
    setPlugins((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextState = !p.connected;
          showToast(`${name} ${nextState ? 'connected' : 'disconnected'} (Demo)`);
          return { ...p, connected: nextState };
        }
        return p;
      })
    );
  };

  return (
    <MenuPageLayout title="Plugins" icon={AtSign} onBack={onBack}>
      <div className="space-y-3">
        <p className="text-xs text-[var(--text-secondary)] mb-4">
          Connect external productivity tools and developer environments.
        </p>

        {plugins.map((plugin) => (
          <div
            key={plugin.id}
            className="p-3.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xs flex items-center justify-between gap-3"
          >
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium text-[var(--text-primary)]">
                {plugin.name}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                {plugin.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggleConnect(plugin.id, plugin.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                plugin.connected
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-[var(--surface-soft)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--border)]'
              }`}
            >
              {plugin.connected ? (
                <span className="flex items-center gap-1">
                  <Check size={12} strokeWidth={2.5} />
                  Connected
                </span>
              ) : (
                'Connect'
              )}
            </button>
          </div>
        ))}

        <div className="pt-2 text-center text-xs text-[var(--text-muted)]">
          Demo placeholder — no OAuth or real account credentials required.
        </div>
      </div>
    </MenuPageLayout>
  );
}

