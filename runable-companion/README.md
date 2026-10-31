# Runable Companion — Phase 1

A Chromium browser extension that provides an AI-powered companion side panel.  
**Phase 1** delivers a pixel-accurate static UI with local dummy data and demo interactions.

## Tech Stack

- **React 19** with JavaScript/JSX
- **Vite** (build tooling)
- **Tailwind CSS v4** (primary styling)
- **Lucide React** (icons)
- **Chrome Extension Manifest V3**

## Folder Structure

```
runable-companion/
├── public/
│   ├── icons/               # Extension icons (16, 48, 128 px PNGs)
│   ├── manifest.json         # Manifest V3 config
│   └── service-worker.js     # Opens side panel on icon click
├── src/
│   ├── components/
│   │   ├── Header/           # Logo, product name, +, ellipsis
│   │   ├── MoreOptionsMenu/  # Floating dropdown menu
│   │   ├── WelcomeSection/   # Sparkle + greeting + subtext
│   │   ├── QuickActions/     # Four action cards row
│   │   ├── ChatComposer/     # Input + toolbar (Agent, Auto, mic)
│   │   ├── Dropdown/         # Reusable dropdown
│   │   └── Toast/            # Demo feedback notifications
│   ├── data/
│   │   └── demoData.js       # All static labels, icons, options
│   ├── hooks/
│   │   └── useOutsideClick.js
│   ├── styles/
│   │   ├── global.css        # Tailwind imports + base resets
│   │   └── variables.css     # Design tokens / CSS variables
│   ├── App.jsx               # Root layout
│   └── main.jsx              # React entry point
├── scripts/
│   └── generate-icons.mjs    # Generate extension icon PNGs
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Chrome or Microsoft Edge

### Install Dependencies

```bash
cd runable-companion
npm install
```

### Development Preview

Start the Vite dev server to preview the panel UI in a browser tab:

```bash
npm run dev
```

Open http://localhost:5173 — resize your browser window to ~520px wide to simulate the side panel.

### Build the Extension

```bash
npm run build
```

This creates the `dist/` folder with all files ready for extension loading.

### Load as Unpacked Extension

#### Google Chrome

1. Navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `dist/` folder inside `runable-companion`
5. Click the extension icon in the toolbar — the side panel opens

#### Microsoft Edge

1. Navigate to `edge://extensions/`
2. Enable **Developer mode** (toggle in bottom left)
3. Click **Load unpacked**
4. Select the `dist/` folder inside `runable-companion`
5. Click the extension icon in the toolbar — the side panel opens

## Phase 1 Acceptance Checklist

- [x] UI visually matches the supplied Runable Companion screenshot
- [x] Panel fills available side-panel height
- [x] Header: R logo tile, "Runable Companion" title, + button, ellipsis button
- [x] More Options menu: all 8 items in correct order with icons & divider
- [x] Welcome section: "Good afternoon, Sunil" + "How can Runable help you today?"
- [x] Four action cards in one row with correct labels and accent colors
- [x] Bottom composer: placeholder, +, Agent selector, Auto selector, mic button
- [x] More Options opens/closes (click, outside click, Escape)
- [x] Dropdowns and buttons show demo interactions (toasts)
- [x] No real backend, AI, page reading, summarization, context menu, or shortcut
- [x] Code is componentized with reusable components
- [x] Production build succeeds and loads as unpacked Chromium extension

## Known Limitations

- Extension icons are programmatically generated simple bitmaps (not a professional logo)
- Google Fonts (Inter) requires network access; falls back to system fonts offline
- The "More Options" menu opens by default on first load (per spec, to match screenshot)

## What's Next (Not Implemented)

- **Phase 2:** Ask with Runable (AI chat integration)
- **Phase 3:** Keyboard shortcut to open the side panel
- **Phase 4:** Summarize this page (webpage content extraction)

