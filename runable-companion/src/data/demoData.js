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
