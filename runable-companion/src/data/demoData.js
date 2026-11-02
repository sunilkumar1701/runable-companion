import {
  FileText,
  Presentation,
  LineChart,
  LayoutGrid,
  Plus,
  Box,
  Clock,
  AtSign,
  Contact,
  Settings,
  User,
} from 'lucide-react';

/** Static user name for Phase 1 demo */
export const USER_NAME = 'Sunil';

/** Product name */
export const PRODUCT_NAME = 'Runable Companion';

/** More-options menu items (order matters) */
export const menuItems = [
  { id: 'new-chat', label: 'New chat', icon: Plus, action: 'reset' },
  { id: 'artifacts', label: 'Artifacts', icon: Box },
  { id: 'scheduled-tasks', label: 'Scheduled tasks', icon: Clock },
  { id: 'plugins', label: 'Plugins', icon: AtSign },
  { id: 'notetaker', label: 'Notetaker', icon: Contact },
  { id: 'divider', type: 'divider' },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'account', label: 'Account', icon: User },
];

/** Quick-action cards */
export const quickActions = [
  {
    id: 'summarize',
    label: 'Summarize this page',
    icon: FileText,
    accentClass: 'text-[var(--accent-brown)]',
    toast: 'Summarize this page — coming in Phase 4',
  },
  {
    id: 'slides',
    label: 'Create slides',
    icon: Presentation,
    accentClass: 'text-[var(--accent-orange)]',
    toast: 'Create slides — demo placeholder',
  },
  {
    id: 'report',
    label: 'Create report',
    icon: LineChart,
    accentClass: 'text-[var(--accent-blue)]',
    toast: 'Create report — demo placeholder',
  },
  {
    id: 'more-tools',
    label: 'More tools',
    icon: LayoutGrid,
    accentClass: 'text-[var(--accent-brown)]',
    toast: 'More tools — demo placeholder',
  },
];

/** Initial demo projects for Choose Project dropdown */
export const initialProjects = [
  { id: 'proj-1', name: 'My First Project' },
  { id: 'proj-2', name: 'Runable Companion' },
  { id: 'proj-3', name: 'Website Redesign' },
];

/** Plugin categories for quick dropdown below composer */
export const pluginQuickCategories = [
  {
    id: 'website-data',
    name: 'Website Data',
    iconType: 'website',
    badgeBg: '#e0f2fe',
    badgeColor: '#0284c7',
  },
  {
    id: 'people-data',
    name: 'People Data',
    iconType: 'people',
    badgeBg: '#dcfce7',
    badgeColor: '#16a34a',
  },
  {
    id: 'company-data',
    name: 'Company Data',
    iconType: 'company',
    badgeBg: '#fef3c7',
    badgeColor: '#d97706',
  },
  {
    id: 'smb-data',
    name: 'SMB Data',
    iconType: 'smb',
    badgeBg: '#ffedd5',
    badgeColor: '#ea580c',
  },
  {
    id: 'social-data',
    name: 'Social Data',
    iconType: 'social',
    badgeBg: '#ede9fe',
    badgeColor: '#7c3aed',
  },
  {
    id: 'ecommerce-data',
    name: 'E-commerce Data',
    iconType: 'ecommerce',
    badgeBg: '#cffafe',
    badgeColor: '#0891b2',
  },
];

/** More Tools categories: Code, Productivity, Content Creation */
export const moreToolsCategories = [
  {
    id: 'code',
    title: 'Code',
    columns: 2,
    items: [
      {
        id: 'websites',
        title: 'Websites',
        iconType: 'websites',
        color: '#2563eb',
        prompt: 'Build a modern responsive website for ',
      },
      {
        id: 'apps',
        title: 'Apps',
        iconType: 'apps',
        color: '#7c3aed',
        prompt: 'Create a full-stack web application with ',
      },
    ],
  },
  {
    id: 'productivity',
    title: 'Productivity',
    columns: 4,
    items: [
      {
        id: 'slides',
        title: 'Slides',
        iconType: 'slides',
        color: '#ea580c',
        prompt: 'Create presentation slides about ',
      },
      {
        id: 'report',
        title: 'Report',
        iconType: 'report',
        color: '#2563eb',
        prompt: 'Generate an analysis report on ',
      },
      {
        id: 'sheets',
        title: 'Sheets',
        iconType: 'sheets',
        color: '#16a34a',
        prompt: 'Create a spreadsheet model for ',
      },
      {
        id: 'workflows',
        title: 'Workflows',
        iconType: 'workflows',
        color: '#7c3aed',
        prompt: 'Automate a multi-step workflow for ',
      },
    ],
  },
  {
    id: 'content-creation',
    title: 'Content Creation',
    columns: 4,
    items: [
      {
        id: 'video',
        title: 'Video',
        iconType: 'video',
        color: '#e11d48',
        prompt: 'Create a video storyboard and script for ',
      },
      {
        id: 'image',
        title: 'Image',
        iconType: 'image',
        color: '#d946ef',
        prompt: 'Generate a high-quality image of ',
      },
      {
        id: 'audio',
        title: 'Audio',
        iconType: 'audio',
        color: '#ea580c',
        prompt: 'Generate an audio podcast script about ',
      },
      {
        id: 'carousels',
        title: 'Carousels',
        iconType: 'carousels',
        color: '#0891b2',
        prompt: 'Create an engaging social carousel about ',
      },
    ],
  },
];

/** Agent selector modes matching Reference Image 1 */
export const agentModes = [
  {
    id: 'agent',
    label: 'Agent',
    subtitle: 'Long, complex work',
    iconType: 'smile',
  },
  {
    id: 'ask',
    label: 'Ask',
    subtitle: 'Fast Q&A, plugins, and images',
    iconType: 'chat',
  },
  {
    id: 'plan',
    label: 'Plan',
    subtitle: 'Draft a plan before building',
    iconType: 'plan',
  },
];

/** Compatibility alias */
export const agentOptions = agentModes;

/** Model selector choices matching Reference Image 2 */
export const modelChoices = {
  recommended: {
    id: 'auto',
    name: 'Auto',
    badge: 'Recommended',
    description: 'Always selects the best model',
  },
  list: [
    {
      id: 'fable-5.1',
      name: 'Fable 5.1',
      provider: 'claude',
      isPro: true,
    },
    {
      id: 'gpt-6-astra',
      name: 'GPT 6 Astra',
      provider: 'openai',
      isPro: true,
    },
    {
      id: 'opus-5.5',
      name: 'Opus 5.5',
      provider: 'claude',
      isPro: true,
    },
    {
      id: 'sonnet-5.5',
      name: 'Sonnet 5.5',
      provider: 'claude',
      isPro: false,
    },
    {
      id: 'gpt-6.1-sol',
      name: 'GPT 6.1 Sol',
      provider: 'openai',
      isPro: true,
    },
    {
      id: 'haiku-5.5',
      name: 'Haiku 5.5',
      provider: 'claude',
      isPro: false,
    },
  ],
};

/** Compatibility alias */
export const modelOptions = [
  { id: 'auto', label: 'Auto', default: true },
  ...modelChoices.list.map((m) => ({ id: m.id, label: m.name })),
];

/** Sample initial chat history for the left-side drawer */
export const sampleChatHistory = [
  {
    id: 'chat-1',
    title: 'The future of AI agents',
    dateGroup: 'Today',
    timestamp: Date.now() - 1000 * 60 * 35,
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Explain this in simple terms and give real-world examples.',
        timestamp: Date.now() - 1000 * 60 * 35,
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content:
          'In simple terms, AI agents can take a goal, figure out the steps needed, use tools (like web search, apps, or code), and complete the work for you.\n\nReal-world examples:\n1. Research: An agent can search the web, read multiple sources, and create a summary report.\n2. Content creation: It can write a blog post, generate slides, or create documents based on a topic.\n3. Web development: It can build and deploy a website from your description.\n4. Data analysis: It can collect data, analyze it, and generate charts or reports.\n5. Automation: It can handle multi-step workflows like sending emails, updating spreadsheets, or managing tasks.',
        timestamp: Date.now() - 1000 * 60 * 34,
      },
    ],
    selectedContext: {
      selectedText:
        'AI agents are transforming how we work by taking complex tasks and turning them into completed results. From researching information to building websites and generating reports, agents can now handle multi-step workflows autonomously.',
      pageUrl: 'https://example.com/ai-agents',
      pageTitle: 'The future of AI agents | Blog',
    },
  },
  {
    id: 'chat-2',
    title: 'Competitive landscape research',
    dateGroup: 'Previous 7 Days',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    messages: [
      {
        id: 'msg-201',
        role: 'user',
        content: 'Compare top AI agent tools and their key differentiators.',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
      },
      {
        id: 'msg-202',
        role: 'assistant',
        content:
          'Top AI agent platforms differ primarily in autonomy level, execution sandboxes, tool integrations, and human-in-the-loop controls. Runable specializes in multi-modal workspace companions with browser context awareness.',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2 + 5000,
      },
    ],
  },
  {
    id: 'chat-3',
    title: 'Executive pitch deck outline',
    dateGroup: 'Previous 7 Days',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4,
    messages: [
      {
        id: 'msg-301',
        role: 'user',
        content: 'Draft an 8-slide pitch deck structure for our Series A fundraising.',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4,
      },
      {
        id: 'msg-302',
        role: 'assistant',
        content:
          'Here is an 8-slide executive pitch deck outline:\n1. Vision & Problem Statement\n2. The Solution: Autonomous Browser AI\n3. Market Opportunity & Tailwinds\n4. Product Architecture & Demo\n5. Traction & Growth Metrics\n6. Business Model & Unit Economics\n7. Competitive Moat\n8. The Team & Ask',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4 + 6000,
      },
    ],
  },
];
