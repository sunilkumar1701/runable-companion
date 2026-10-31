# Runable Companion — Phase 1, 2 & 3

A Chromium browser extension providing an AI-powered companion side panel.
Built using **React 19**, **Vite**, **Tailwind CSS v4**, and **Chrome Extension Manifest V3**.

> **Demo & Privacy Notice:** All AI responses, conversation replies, accounts, scheduled tasks, artifacts, notes, and plugin connections are **local dummy data**. No external LLM, backend, or cloud service is contacted. Phase 4 (full webpage summarization) is deliberately excluded.

---

## Capabilities by Phase

### Phase 1 — UI & Side Panel Foundation
- Pixel-accurate recreation of the Runable Companion side panel with warm off-white palette (`#faf8f5`).
- Fixed header with R logo tile, product title, `+` New chat, and `⋮` More options.
- Welcome section with 4-point sparkle icon and personalized greeting.
- 4 quick-action cards in a responsive row.
- Bottom chat composer with multiline auto-expand, attachment button, Agent selector, Model selector, and microphone button.

### Phase 2 — Ask with Runable
- Real Chromium selection context menu (`contexts: ["selection"]`) registered via background service worker.
- Right-clicking selected text on any webpage displays **Ask with Runable**.
- Clicking opens the side panel, temporarily stores the selected text, page URL, and page title in `chrome.storage.session` (with local storage fallback).
- Renders **Selected from webpage** card near top with text and external link.
- Quick-action cards are hidden during selected-text conversations.
- Empty conversation area starts clean; when the user submits a message, the exact deterministic demo response is appended:  
  **"This is a dummy response for demo purpose."**
- Clicking the `✕` on the **Selected from webpage** card removes the webpage context from the UI and session storage, while preserving already-sent conversation messages.
- New chat resets conversation and clears active context.

### Phase 3 — Keyboard Shortcut & Subpages
- Configured Chromium command `open-runable-panel` mapped by default to **`Alt + Shift + R`**.
- Opens the Runable Companion side panel from any focused webpage tab.
- Configurable via `chrome://extensions/shortcuts` or `edge://extensions/shortcuts`.
- Corrected More Options dropdown: closed by default on fresh load, opens/closes via ellipsis button or Escape/outside click.
- 6 complete in-extension dummy pages accessible from More Options:
  1. **Artifacts**: Document, presentation, and report cards with local detail preview.
  2. **Scheduled tasks**: Recurring research workflows with local toggle switches.
  3. **Plugins**: Google Drive, Gmail, Slack, and Notion with local Connect/Connected state.
  4. **Notetaker**: Meeting notes with participants, summaries, action items, and New note creation.
  5. **Settings**: Theme and notification demo toggles + keyboard shortcut customization guide.
  6. **Account**: Profile card for Sunil with demo plan and sign-out action.

---

## Folder Structure

```text
runable-companion/
├── public/
│   ├── icons/               # 16, 48, 128 px PNG icons
│   ├── manifest.json         # Manifest V3 (sidePanel, contextMenus, commands, storage, tabs)
│   └── service-worker.js     # Background worker (context menu, shortcuts, sidePanel)
├── src/
│   ├── components/
│   │   ├── Header/           # Logo, title, +, ⋮, ✕
│   │   ├── MoreOptionsMenu/  # Floating dropdown menu (closed by default)
│   │   ├── WelcomeSection/   # 4-point sparkle + greeting
│   │   ├── QuickActions/     # 4 quick action cards
│   │   ├── ChatComposer/     # Multiline input + toolbar
│   │   ├── SelectedContextCard/ # Inset card for webpage selected text & URL
│   │   ├── ConversationView/ # User & assistant message bubbles
│   │   ├── MenuPageLayout/   # Reusable subpage header with back button
│   │   ├── Dropdown/         # Reusable floating selector
│   │   └── Toast/            # Animated notification alerts
│   ├── pages/
│   │   ├── ArtifactsPage.jsx
│   │   ├── ScheduledTasksPage.jsx
│   │   ├── PluginsPage.jsx
│   │   ├── NotetakerPage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── AccountPage.jsx
│   ├── services/
│   │   ├── browserApi.js     # Safe Chrome API wrappers & fallback layer
│   │   └── mockRunableService.js # Local deterministic demo responses
│   ├── data/
│   │   ├── demoData.js       # Action cards, menu items, dropdowns
│   │   ├── menuPagesData.js  # Static data for the 6 subpages
│   │   └── mockResponses.js  # Fixed dummy response strings
│   ├── hooks/
│   │   └── useOutsideClick.js # Outside click & Escape key listener
│   ├── styles/
│   │   ├── global.css        # Tailwind v4 import & custom scrollbar
│   │   └── variables.css     # CSS design tokens & color palette
│   ├── App.jsx               # Main state orchestrator
│   └── main.jsx              # React 19 entry point
├── scripts/
│   └── generate-icons.mjs    # Pure-Node PNG generator
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Installation & Development

### 1. Install Dependencies
```bash
cd runable-companion
npm install
```

### 2. Development Preview
```bash
npm run dev
```
Preview at `http://localhost:5173`. Resize your viewport to 360–540px to simulate side-panel dimensions.

### 3. Build Extension
```bash
npm run build
```
Creates the production distribution bundle in `dist/`.

---

## How to Load in Browsers

### Google Chrome
1. Navigate to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in upper right).
3. Click **Load unpacked** (upper left).
4. Select the `runable-companion/dist` folder.
5. Highlight any text on a webpage, right-click, and select **Ask with Runable**, or press **Alt + Shift + R**.

### Microsoft Edge
1. Navigate to `edge://extensions/`.
2. Enable **Developer mode** (toggle in bottom left sidebar).
3. Click **Load unpacked** (top).
4. Select the `runable-companion/dist` folder.
5. Highlight text, right-click, and select **Ask with Runable**, or press **Alt + Shift + R**.

---

## Keyboard Shortcut Configuration

- **Default Shortcut:** `Alt + Shift + R` (avoids conflicts with browser hard reload `Ctrl + Shift + R`).
- **To customize in Chrome:** Navigate to `chrome://extensions/shortcuts` and configure "Open Runable Companion side panel".
- **To customize in Edge:** Navigate to `edge://extensions/shortcuts` and set your preferred shortcut.

---

## Manifest Permissions Explanation

- `sidePanel`: Grants access to `chrome.sidePanel.open` to programmatically open the companion panel on action clicks, context menu actions, and shortcut triggers.
- `contextMenus`: Used to register the "Ask with Runable" entry on text selection (`contexts: ["selection"]`).
- `storage`: Temporarily retains selected snippet text, title, and page URL in `chrome.storage.session` until consumed or dismissed by the user.
- `commands`: Declares the `open-runable-panel` keyboard shortcut trigger.
- `tabs`: Allows the service worker to identify active tab URLs, titles, and IDs when right-clicking or triggering shortcut commands without requesting broad host permissions.
