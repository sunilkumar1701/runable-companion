import { useState } from 'react';
import { Contact, Plus, CheckSquare, Calendar, Users, X } from 'lucide-react';
import MenuPageLayout from '../components/MenuPageLayout/MenuPageLayout';
import { sampleNotes } from '../data/menuPagesData';

export default function NotetakerPage({ onBack, showToast }) {
  const [notes, setNotes] = useState(sampleNotes);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newNoteObj = {
      id: `note-${Date.now()}`,
      title: newTitle.trim(),
      date: 'Just now • 15 min',
      participants: 'Sunil',
      summary: 'Quick notes recorded via Runable Companion Notetaker.',
      actionItems: ['Review follow-up points'],
    };

    setNotes([newNoteObj, ...notes]);
    setNewTitle('');
    setShowAddForm(false);
    showToast('New note added (Demo)');
  };

  return (
    <MenuPageLayout title="Notetaker" icon={Contact} onBack={onBack}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[var(--text-secondary)]">
            Automated transcripts, meeting summaries, and action items.
          </p>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 text-xs font-medium text-[var(--accent-brown)] bg-[var(--surface-soft)] hover:bg-[var(--border)] px-2.5 py-1.5 rounded-lg border border-[var(--border)] transition-colors shrink-0"
          >
            <Plus size={14} />
            New note
          </button>
        </div>

        {/* Add Note Modal/Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddNote}
            className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl space-y-2 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text-primary)]">Quick Note</span>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X size={14} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Meeting or discussion title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-primary)] focus:outline-hidden"
              autoFocus
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs px-2.5 py-1 border border-[var(--border)] rounded-md text-[var(--text-secondary)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-xs px-2.5 py-1 bg-[var(--accent-brown)] text-white rounded-md font-medium"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* Notes list */}
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-3.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xs space-y-2.5"
          >
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                {note.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--text-muted)] mt-1">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {note.date}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {note.participants}
                </span>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed bg-[var(--surface-soft)] p-2.5 rounded-lg">
              {note.summary}
            </p>

            {note.actionItems?.length > 0 && (
              <div className="space-y-1 pt-1">
                <div className="text-[11px] font-medium text-[var(--text-muted)] flex items-center gap-1">
                  <CheckSquare size={12} />
                  Action items:
                </div>
                <ul className="text-xs text-[var(--text-secondary)] space-y-1 pl-4 list-disc">
                  {note.actionItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        <div className="pt-2 text-center text-xs text-[var(--text-muted)]">
          Demo data only — no real microphones or meeting feeds are monitored.
        </div>
      </div>
    </MenuPageLayout>
  );
}

