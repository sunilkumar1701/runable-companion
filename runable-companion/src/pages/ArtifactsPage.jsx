import { useState } from 'react';
import { Box, FileText, Presentation, LineChart, X } from 'lucide-react';
import MenuPageLayout from '../components/MenuPageLayout/MenuPageLayout';
import { sampleArtifacts } from '../data/menuPagesData';

export default function ArtifactsPage({ onBack, showToast }) {
  const [selectedArtifact, setSelectedArtifact] = useState(null);

  const getIcon = (type) => {
    switch (type) {
      case 'Presentation':
        return <Presentation size={18} className="text-[var(--accent-orange)] shrink-0" />;
      case 'Report':
        return <LineChart size={18} className="text-[var(--accent-blue)] shrink-0" />;
      default:
        return <FileText size={18} className="text-[var(--accent-brown)] shrink-0" />;
    }
  };

  return (
    <MenuPageLayout title="Artifacts" icon={Box} onBack={onBack}>
      <div className="space-y-3 w-full max-w-full min-w-0">
        <p className="text-xs text-[var(--text-secondary)] mb-3">
          Structured deliverables generated during your assistant workflows.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {sampleArtifacts.map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArtifact(art)}
              className="p-3.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:bg-[var(--surface-soft)] cursor-pointer transition-colors shadow-xs flex flex-col justify-between min-w-0"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    {getIcon(art.type)}
                    <h3 className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {art.title}
                    </h3>
                  </div>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                      art.status === 'Ready'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {art.status}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-2">
                  {art.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-2 border-t border-[var(--border)]/50">
                <span>{art.type}</span>
                <span>{art.created}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center text-xs text-[var(--text-muted)]">
          Demo data only — no real files are stored.
        </div>
      </div>

      {/* Artifact Local Detail Preview Modal */}
      {selectedArtifact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                {getIcon(selectedArtifact.type)}
                <h4 className="text-sm font-semibold text-[var(--text-primary)] truncate">
                  {selectedArtifact.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArtifact(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-md"
                aria-label="Close preview"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {selectedArtifact.description}
            </p>

            <div className="p-3 bg-[var(--surface-soft)] rounded-lg text-xs space-y-1.5 border border-[var(--border)]/60">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Type:</span>
                <span className="font-medium text-[var(--text-primary)]">{selectedArtifact.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Status:</span>
                <span className="font-medium text-[var(--text-primary)]">{selectedArtifact.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Created:</span>
                <span className="font-medium text-[var(--text-primary)]">{selectedArtifact.created}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  showToast('Export — demo placeholder');
                  setSelectedArtifact(null);
                }}
                className="px-3 py-1.5 text-xs font-medium bg-[var(--accent-brown)] text-white rounded-lg hover:opacity-90"
              >
                Export
              </button>
              <button
                type="button"
                onClick={() => setSelectedArtifact(null)}
                className="px-3 py-1.5 text-xs font-medium border border-[var(--border)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--surface-soft)]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </MenuPageLayout>
  );
}
