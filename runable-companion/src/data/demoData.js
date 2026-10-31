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

/** Agent selector dropdown options */
export const agentOptions = [
  { id: 'agent', label: 'Agent', default: true },
  { id: 'researcher', label: 'Researcher' },
  { id: 'coder', label: 'Coder' },
  { id: 'writer', label: 'Writer' },
];

/** Model selector dropdown options */
export const modelOptions = [
  { id: 'auto', label: 'Auto', default: true },
  { id: 'fast', label: 'Fast' },
  { id: 'balanced', label: 'Balanced' },
  { id: 'precise', label: 'Precise' },
];

