import { useState } from 'react';
import { Clock, Calendar } from 'lucide-react';
import MenuPageLayout from '../components/MenuPageLayout/MenuPageLayout';
import { sampleScheduledTasks } from '../data/menuPagesData';

export default function ScheduledTasksPage({ onBack, showToast }) {
  const [tasks, setTasks] = useState(sampleScheduledTasks);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.enabled;
          showToast(`Task "${t.name}" ${nextState ? 'enabled' : 'paused'} (Demo)`);
          return { ...t, enabled: nextState };
        }
        return t;
      })
    );
  };

  return (
    <MenuPageLayout title="Scheduled tasks" icon={Clock} onBack={onBack}>
      <div className="space-y-3 w-full max-w-full min-w-0">
        <p className="text-xs text-[var(--text-secondary)] mb-3">
          Automations and recurring research workflows managed by Runable.
        </p>

        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-3.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xs space-y-2.5 min-w-0"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium text-[var(--text-primary)] break-words">
                  {task.name}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed break-words">
                  {task.description}
                </p>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                role="switch"
                aria-checked={task.enabled}
                aria-label={`Toggle ${task.name}`}
                onClick={() => toggleTask(task.id)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden mt-0.5 ${
                  task.enabled ? 'bg-[var(--accent-brown)]' : 'bg-[var(--border)]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    task.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between text-[11px] pt-1.5 border-t border-[var(--border)]/60 text-[var(--text-muted)] gap-2">
              <span className="flex items-center gap-1 shrink-0">
                <Calendar size={12} />
                {task.cadence}
              </span>
              <span className={`shrink-0 ${task.enabled ? 'text-[var(--text-secondary)] font-medium' : 'text-gray-400'}`}>
                Next: {task.enabled ? task.nextRun : 'Paused'}
              </span>
            </div>
          </div>
        ))}

        <div className="pt-2 text-center text-xs text-[var(--text-muted)]">
          Local demo toggles only — no background cron is executed.
        </div>
      </div>
    </MenuPageLayout>
  );
}
