/**
 * Static dummy data for More Options pages (Phase 2 & Phase 3)
 *
 * NOTE: All information in this module is static local demo data.
 * No external accounts, tasks, plugins, or files are accessed.
 */

export const sampleArtifacts = [
  {
    id: 'art-1',
    title: 'Q3 Enterprise Strategy Brief',
    type: 'Document',
    created: 'Oct 28, 2026',
    status: 'Ready',
    description: 'Executive summary covering quarterly product milestones and market adoption metrics.',
  },
  {
    id: 'art-2',
    title: 'Autonomous Agents Roadmap 2027',
    type: 'Presentation',
    created: 'Oct 24, 2026',
    status: 'Draft',
    description: '14-slide deck outlining multi-step orchestration workflows and runtime environments.',
  },
  {
    id: 'art-3',
    title: 'Q4 Competitive Market Intelligence',
    type: 'Report',
    created: 'Oct 19, 2026',
    status: 'Ready',
    description: 'In-depth benchmark analysis of Chromium-based agent assistants and developer tooling.',
  },
];

export const sampleScheduledTasks = [
  {
    id: 'task-1',
    name: 'Daily Tech News Digest',
    description: 'Summarizes top engineering articles from tech blogs and news feeds.',
    cadence: 'Daily at 8:00 AM',
    nextRun: 'Tomorrow, 8:00 AM',
    enabled: true,
  },
  {
    id: 'task-2',
    name: 'Weekly Research Papers Digest',
    description: 'Gathers and summarizes recent AI research papers relevant to autonomous assistants.',
    cadence: 'Every Friday at 5:00 PM',
    nextRun: 'Nov 6, 5:00 PM',
    enabled: true,
  },
  {
    id: 'task-3',
    name: 'Monthly Competitive Landscape Scan',
    description: 'Scans release logs and announcements across major browser extension ecosystems.',
    cadence: '1st of every month',
    nextRun: 'Nov 1, 9:00 AM',
    enabled: false,
  },
];

export const samplePlugins = [
  {
    id: 'plug-gdrive',
    name: 'Google Drive',
    description: 'Search, reference, and attach Drive documents directly within Runable discussions.',
    connected: true,
  },
  {
    id: 'plug-gmail',
    name: 'Gmail',
    description: 'Draft context-aware replies and quickly look up important conversation threads.',
    connected: false,
  },
  {
    id: 'plug-slack',
    name: 'Slack',
    description: 'Share summaries, draft channel announcements, and read team updates.',
    connected: false,
  },
  {
    id: 'plug-notion',
    name: 'Notion',
    description: 'Export notes, generated tasks, and meeting highlights to your Notion workspace.',
    connected: false,
  },
];

export const sampleNotes = [
  {
    id: 'note-1',
    title: 'Sprint 42 Architecture Review',
    date: 'Oct 30, 2026 • 45 min',
    participants: 'Sunil, Sarah, Michael, Priya',
    summary:
      'Reviewed Chromium extension side panel architecture and Manifest V3 compatibility. Decided on local session storage for context passing and pure CSS design tokens for UI consistency.',
    actionItems: [
      'Finalize Phase 2 context-menu handler with storage.session fallback',
      'Configure Alt + R command in manifest.json and test across Chrome/Edge',
      'Verify responsive layout down to 320px minimum viewport width',
    ],
  },
  {
    id: 'note-2',
    title: 'Agentic Workflows & Multi-Step Execution',
    date: 'Oct 26, 2026 • 30 min',
    participants: 'Sunil, Alex, Elena',
    summary:
      'Explored future capabilities for multi-modal browser assistance, including DOM-aware summarization and offline action runners.',
    actionItems: [
      'Document Phase 4 requirements and security boundaries',
      'Prepare test fixtures for edge-case HTML pages',
    ],
  },
];

export const defaultAccountData = {
  name: 'Sunil kumar',
  email: 'sunilprakash1701@gmail.com',
  credits: '0 left',
  plan: 'Demo Account (Phase 2 & 3)',
  joined: 'October 2026',
};

