# Runable Companion — Phase 1, 2, 3 & 4

A Chromium browser extension providing an AI-powered companion side panel.
Built using **React 19**, **Vite**, **Tailwind CSS v4**, and **Chrome Extension Manifest V3**.

> **Demo & Privacy Notice:** All AI summaries, conversation replies, accounts, scheduled tasks, artifacts, notes, and plugin connections are **local dummy data**. No external LLM, backend, or cloud service is contacted.

---

## Capabilities by Phase

### Phase 1 — UI & Side Panel Foundation
- Pixel-accurate recreation of the Runable Companion side panel with warm off-white palette (`#faf8f5`).
- Fixed header with R logo tile, product title, `+` New chat, `⋮` More options, and `✕` close button.
- Welcome section with 4-point sparkle icon and personalized greeting.
- 4 quick-action cards in a responsive row.
- Bottom chat composer with multiline auto-expand, attachment button, Agent selector, Model selector, and microphone button.

### Phase 2 — Ask with Runable
- Real Chromium selection context menu (`contexts: ["selection"]`) registered via background service worker.
- Right-clicking selected text on any webpage displays **Ask with Runable**.
- Opens side panel, saves selected snippet in `chrome.storage.session`, and renders the **Selected from webpage** card near top.
- Right-aligned user messages and left-aligned assistant responses.
- Clicking the `✕` on the **Selected from webpage** card clears active context and session storage while preserving already-sent conversation messages.

### Phase 3 — Keyboard Shortcut & Subpages
- Configured Chromium command `open-runable-panel` mapped by default to **`Alt + Shift + R`**.
- Opens the Runable Companion side panel from any focused webpage tab.
- More Options dropdown closed by default on initial load; opens/closes via ellipsis button or Escape/outside click.
- 6 complete in-extension subpages styled consistently with Tailwind CSS:
  1. **Artifacts**: Document, presentation, and report cards with local detail preview modal.
  2. **Scheduled tasks**: Recurring research workflows with local interactive toggle switches.
  3. **Plugins**: Google Drive, Gmail, Slack, and Notion with local Connect/Connected state.
  4. **Notetaker**: Meeting notes with participants, summaries, action items, and New note creation.
  5. **Settings**: Theme and notification demo toggles + keyboard shortcut customization guide.
  6. **Account**: Profile card for Sunil with demo plan and sign-out action.

### Phase 4 — Summarize This Page & UI Enhancements
- Dedicated **Summarize this page** workflow initiated from the existing quick-action card.
- Displays an active card highlight on "Summarize this page" and a compact progress banner:  
  **"Summarizing this page... / Reading page content and generating a summary..."**
- Captures active tab URL and title, reading readable page text locally if permitted.
- Renders **Page summary** card with:
  - Source URL with globe icon and external link.
  - Soft inset summary paragraph.
  - **Key takeaways** section with bullet points.
- Composer automatically updates placeholder to **"Ask a follow-up question..."**.
- User follow-up messages are right-aligned, assistant responses are left-aligned with enriched multi-paragraph demo explanations.
- Starting a **New chat** clears the summary, resets messages, and returns to the default home screen.
- All six More options subpages reflow smoothly at narrow side-panel widths (320px–1024px).

---

## Folder Structure

```text
runable-companion/
├── public/
│   ├── icons/               # 16, 48, 128 px PNG icons
│   ├── manifest.json         # Manifest V3 (sidePanel, contextMenus, commands, storage, tabs, scripting)
│   └── service-worker.js     # Background worker (context menu, shortcuts, sidePanel)
├── src/
│   ├── components/
│   │   ├── Header/           # Logo, title, +, ⋮, ✕
│   │   ├── MoreOptionsMenu/  # Floating dropdown menu (closed by default)
│   │   ├── WelcomeSection/   # 4-point sparkle + greeting
│   │   ├── QuickActions/     # 4 quick action cards with active highlight support
│   │   ├── ChatComposer/     # Multiline input + toolbar + dynamic placeholder
│   │   ├── SelectedContextCard/ # Inset card for webpage selected text & URL
│   │   ├── ConversationView/ # Left/right aligned user & assistant messages
│   │   ├── PageSummary/      # SummaryLoadingState + PageSummaryCard
│   │   │   ├── SummaryLoadingState.jsx
│   │   │   ├── SummaryLoadingState.css
│   │   │   ├── PageSummaryCard.jsx
│   │   │   └── PageSummaryCard.css
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
│   │   ├── mockRunableService.js # Deterministic replies for Ask with Runable
│   │   └── mockSummaryService.js # Deterministic summaries & follow-up replies
│   ├── data/
│   │   ├── demoData.js       # Action cards, menu items, dropdowns
│   │   ├── menuPagesData.js  # Static data for the 6 subpages
│   │   ├── mockResponses.js  # Enriched multi-paragraph responses
│   │   └── mockSummaryData.js # Summary fixtures and fallback generator
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

## Installation & Commands

### 1. Install Dependencies
```bash
cd runable-companion
npm install
```

### 2. Development Preview
```bash
npm run dev
```
Preview at `http://localhost:5173`. Resize your viewport between 320px and 540px to simulate side-panel dimensions.

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
5. Click **Summarize this page** on the home screen or press **Alt + Shift + R**.

### Microsoft Edge
1. Navigate to `edge://extensions/`.
2. Enable **Developer mode** (toggle in bottom left sidebar).
3. Click **Load unpacked** (top).
4. Select the `runable-companion/dist` folder.
5. Click **Summarize this page** on the home screen or press **Alt + Shift + R**.

---

## Manifest Permissions Explanation

- `sidePanel`: Grants access to `chrome.sidePanel.open` to programmatically open the companion panel on action clicks, context menu actions, and shortcut triggers.
- `contextMenus`: Used to register the "Ask with Runable" entry on text selection (`contexts: ["selection"]`).
- `storage`: Temporarily stores selected text, page titles, and source URLs in `chrome.storage.session` until consumed or cleared by the user.
- `commands`: Declares the `open-runable-panel` keyboard shortcut trigger.
- `tabs`: Allows the service worker and side panel to identify active tab URLs, titles, and IDs.
- `scripting`: Allows local in-browser reading of visible text on the active tab upon an explicit user click on "Summarize this page".

---

## Keyboard Shortcut Configuration

- **Default Shortcut:** `Alt + Shift + R`
- **To customize in Chrome:** Navigate to `chrome://extensions/shortcuts` and configure "Open Runable Companion side panel".
- **To customize in Edge:** Navigate to `edge://extensions/shortcuts` and set your preferred shortcut.
