# Runable Companion — Phase 2 & Phase 3 Implementation Prompt

> **How to use this prompt:** Give this prompt to your coding agent from the root of the already-existing Runable Companion project. Keep the previous Phase 1 prompt and implementation as reference. This is a **new implementation prompt**; do not edit or replace the previous Phase 1 `.md` file.

---

## Role

Act as a senior React.js and Chromium Extension engineer. Continue the existing **Runable Companion** browser extension and implement:

- **Phase 2 — Ask with Runable**
- **Phase 3 — Keyboard shortcut to open the side panel**
- The requested local dummy pages for every item in the **More options** dropdown.
- The small More options behavior correction described below.

This is an extension demo. Use real browser-extension interactions where required, but use **local dummy data for every AI response, backend-like result, account detail, plugin connection, scheduled task, artifact, and other product data**. Do not connect to Runable's real backend, an AI model, or any external service.

**Do not implement Phase 4 (Summarize this page).** Do not add page summarization or full-page content extraction in this phase.

## Latest requested behavior — follow this over any older sample-conversation behavior

These are the latest user-approved requirements and take priority if any older wording elsewhere in this prompt appears inconsistent:

1. **No automatic sample conversation:** When Ask with Runable opens, do not show a prefilled user query or a prefilled Runable answer. Start with the selected webpage context card and an empty conversation area.
2. **User must send a message:** The user types a question in the chat composer and submits it. Only then should a user message and assistant response appear.
3. **Fixed dummy reply:** Every submitted question receives the exact local response: **“This is a dummy response for demo purpose.”** This is static demo content, not an AI-generated answer.
4. **Selected-context X button:** Clicking the X on the **Selected from webpage** card removes the selected text and source URL/title from the UI and clears the active context from extension session storage. Future messages must not use that webpage context.
5. **Preserve existing chat history on context close:** Closing the context card removes only the webpage context; already-sent chat messages remain visible. Starting New chat clears the conversation and any active webpage context.
6. **Do not confuse close buttons:** These context-removal rules apply to the X inside the Selected from webpage card, not the X that closes the browser side panel.

## 1. First inspect the existing project — do not rebuild it

Before changing anything:

1. Inspect the complete current project and its folder structure.
2. Read `package.json`, `manifest.json`, Vite configuration, background/service-worker files, React entry points, routing/state logic, and existing components.
3. Identify how the current side panel opens and how its UI is built.
4. Identify the existing styling setup and reuse it.
5. Identify the existing More options menu and its current interactions.
6. Make a short implementation plan, then make focused changes.

**Do not scaffold a new project if the current project already exists. Do not replace working Phase 1 components with newly written equivalents.** Preserve the existing UI, styles, responsive behavior, and working interactions. Add or modify only the files needed for these features.

If the existing implementation differs from the suggested folder structure below, follow the existing structure rather than moving files unnecessarily.

## 2. Technology and project constraints

Continue using the existing stack:

- React.js with JavaScript and JSX — **not TypeScript**
- Vite
- Chrome Extension Manifest V3
- Tailwind CSS as the primary styling library
- Bootstrap 5 only where it genuinely helps; do not mix Bootstrap and Tailwind utilities on the same elements
- `lucide-react` for icons
- Free and open-source packages/resources only

Do not add paid libraries, paid icon packs, external icon APIs, a backend, a database, authentication, analytics, or real Runable credentials.

Use reusable components, hooks, services, and data files. Avoid placing all logic in `App.jsx`. Keep browser APIs in the background service worker or a small browser-API helper layer, not in presentation components.

## 3. Preserve the existing Phase 1 UI

The existing Phase 1 design is the visual source of truth. Keep it consistent with the supplied Runable Companion reference screenshots.

Preserve:

- The warm off-white/beige panel background.
- Header layout, logo tile, product name, plus button, ellipsis button, spacing, borders, shadows, and rounded corners.
- Existing typography, colors, and icon style.
- Existing chat composer and its bottom placement.
- Existing home/welcome screen.
- Existing quick-action cards on the normal home screen.
- Existing responsive behavior for Chrome and Edge side-panel sizes.

Do not redesign the extension or introduce a new visual style.

### Important More options behavior correction

The current implementation opens the **More options** dropdown by default on first load. Change this behavior:

- On every fresh load, the dropdown must be **closed**.
- It must open only after the user clicks the ellipsis button.
- Clicking the ellipsis again closes it.
- Clicking outside the dropdown closes it.
- Pressing `Escape` closes it.
- Navigating to a menu page closes the dropdown.
- Returning home must not unexpectedly open the dropdown.

Do not remove the ellipsis button or the More options menu. Only correct its initial/opening behavior.

### Quick-action visibility

- On the normal home screen, keep all four existing quick-action cards visible.
- When **Ask with Runable** is invoked and selected webpage content is loaded, hide the four quick-action cards for that selected-text conversation state, matching the selected-text reference screenshot.
- Do not permanently remove the quick-action cards.
- When the user starts a New chat and returns to the normal home state, show the quick-action cards again.

## 4. Phase 2 — Ask with Runable

### Goal

Allow the user to select text on a webpage, right-click, choose **Ask with Runable**, and automatically open the Runable Companion side panel with the selected text and source webpage details. The user should not need to copy and paste the text manually.

The browser context-menu interaction must be real. The answer and all AI-like behavior must remain local dummy data.

### Expected user flow

1. The user opens a normal webpage in Chrome or Edge.
2. The user highlights a sentence or paragraph.
3. The user right-clicks the selected text.
4. The browser context menu displays **Ask with Runable**.
5. The user clicks **Ask with Runable**.
6. The extension obtains the selected text, page URL, and page title from the context-menu click event and clicked tab.
7. The extension stores this payload temporarily and safely.
8. The Runable Companion side panel opens for the same tab.
9. The panel displays a **Selected from webpage** card near the top.
10. The card shows the selected text and the source page URL.
11. Hide the four home quick-action cards while this selected-text conversation is active.
12. Display a sample user query and a sample Runable response using local dummy data.
13. Keep the existing chat composer anchored at the bottom.
14. The user can type a follow-up question and receive a deterministic local dummy response.

### Browser context-menu implementation

Implement the context menu using the Manifest V3 background service worker:

- Use `chrome.contextMenus`.
- Create one stable item ID, such as `ask-with-runable`.
- Configure it to appear only for selected text using `contexts: ["selection"]`.
- Register the menu idempotently so service-worker restarts or extension reloads do not create duplicate entries.
- Listen to `chrome.contextMenus.onClicked`.
- Read `selectionText` from the context-menu click information.
- Read the clicked tab's `url`, `title`, and `id` from the supplied tab information.
- Trim the selected text and handle empty/missing values safely.
- Do not inject a content script or read the complete webpage for this feature.

Use only the browser-provided selection text and page metadata. Do not request broad host permissions.

### Pending context storage and side-panel opening

- Store the pending selection payload before opening the side panel.
- Prefer `chrome.storage.session` if supported by the target browsers; use a suitable fallback only when necessary.
- Store at least:
  - `selectedText`
  - `pageUrl`
  - `pageTitle`
  - `tabId`
  - `createdAt` timestamp
  - A unique request/context ID if useful
- Open the side panel for the clicked tab after the user selects the context-menu item.
- Feature-detect `chrome.sidePanel` and its `open` method.
- Handle unsupported APIs, restricted pages, missing tab IDs, and rejected calls gracefully.
- Do not allow the service worker to crash on errors.

### Avoid stale context and race conditions

- The side panel may initialize after the context-menu click. Ensure the pending payload is saved before opening the panel.
- On panel initialization, read the pending payload and validate that it belongs to the current/active tab where practical.
- Do not show selected text from another tab.
- Do not overwrite a newer pending context with an older one.
- Clear or mark the payload as consumed only after the React UI has successfully loaded it.
- If no valid payload exists, show the normal home screen.
- New chat must clear the current selected-text context for the current session.

### Selected-text conversation UI

Create reusable components and reuse the existing header and composer.

#### A. SelectedContextCard

Display:

- Document icon.
- Label: **Selected from webpage**.
- Close icon button.
- Selected text in a soft neutral inset surface.
- Source page URL with a globe/link icon.
- External-link icon to open the source URL in a new browser tab if appropriate.

Behavior:

- Long selected text must wrap naturally.
- Long URLs must truncate visually without losing the full URL in the link target or accessible title.
- The close icon on this card removes the selected webpage context completely from the current active chat state.
- When clicked, remove the selected text and source page URL/title from the visible UI and clear the corresponding pending/active context from extension session storage.
- After the context is closed, do not attach that selected text or source URL to later prompts or dummy-response logic.
- Keep any messages the user has already sent visible in the conversation; closing the context card removes the webpage context, not the chat history.
- Do not confuse this card's close icon with the side-panel header close button. The requirement applies to the **Selected from webpage** card's X button.
- Use accessible labels for icon-only buttons.

#### B. ConversationView

Do not render a pre-populated sample conversation when Ask with Runable opens the side panel. The initial state should show the selected webpage context card and an empty conversation area, with the existing chat composer ready for input.

User interaction:

1. The user types any question into the chat composer.
2. The user presses Enter or clicks the existing Send button.
3. Display the submitted question as a user message.
4. Display this exact fixed local assistant response:

> This is a dummy response for demo purpose.

5. Keep the response visibly styled as a Runable assistant message, consistent with the reference UI.
6. Allow the user to submit additional questions. For every submitted question, append the user message followed by the same fixed dummy response.
7. Do not automatically insert a suggested question, sample query, or assistant message.
8. Do not claim that the response understands, analyzes, or is generated from the selected webpage content. It is a static demo response only.

The dummy response must be stored in a local mock-data/service module, not hard-coded throughout the React components. No external AI service or backend may be called.

#### C. Follow-up messages

- Reuse the existing `ChatComposer`.
- Allow the user to type and submit a follow-up.
- Append the user's message to the conversation.
- Return a local deterministic dummy response.
- A simple mock service may use keyword matching or a generic contextual response.
- Keep all message state local to the extension session.
- Do not make any network request.

### Phase 2 data and privacy rules

- Never send selected text, page URLs, page titles, or chat messages to a server.
- Do not prefill the conversation with a sample user query or sample assistant response.
- Only create a conversation message after the user submits text through the chat composer.
- Use the fixed assistant reply text: “This is a dummy response for demo purpose.”
- When the Selected from webpage card's X button is clicked, clear the active selected-text context and source metadata from both UI state and session storage so it cannot be reused by later messages.
- Do not call an LLM, Runable API, Groq, Gemini, OpenAI, or any other model.
- Do not use remote mock APIs.
- Put dummy responses in a clearly named module such as `src/data/mockResponses.js` or `src/services/mockRunableService.js`.
- Keep development fixtures in local files.
- The selected text itself may come from the user's explicit context-menu action; all generated answers remain local dummy content.
- Add comments and README documentation explaining that the feature is a local demo and does not connect to Runable's backend.

## 5. Phase 3 — Keyboard shortcut to open the side panel

### Goal

Allow the user to open Runable Companion instantly from a webpage using a keyboard shortcut instead of clicking the extension toolbar icon.

### Shortcut choice

- Implement a Manifest V3 command named `open-runable-panel`.
- Use the browser's `commands` API.
- Choose a sensible default shortcut that avoids common browser and operating-system conflicts.
- Prefer testing a candidate such as **Alt + Shift + R**.
- Do **not** use `Ctrl + Shift + R` as the default because Chrome commonly uses it for hard reload.
- If the browser rejects or reserves the chosen combination, select a supported alternative and document it.
- The shortcut must be configurable through the browser's built-in extension shortcut settings.
- Do not build a custom shortcut-capture UI.

### Expected user flow

1. The user is browsing a webpage.
2. The user presses the configured shortcut (for example, `Alt + Shift + R`).
3. The browser dispatches the `open-runable-panel` command to the extension service worker.
4. The service worker identifies the active tab in the last-focused window.
5. The extension opens the Runable Companion side panel for that tab.
6. The same existing home UI appears, as it does when opened from the toolbar icon.
7. If a valid, unconsumed Ask with Runable context exists for that same tab, preserve and display that context instead of replacing it with the home screen.
8. Do not clear the current conversation when the shortcut is pressed.
9. If the panel is already open, do not create duplicate panels or reset its state.

### Implementation requirements

- Add `open-runable-panel` under `commands` in the existing `manifest.json`.
- Add a clear command description.
- Listen for `chrome.commands.onCommand` in the Manifest V3 service worker.
- Identify the active tab using a safe supported method, such as `chrome.tabs.query({ active: true, lastFocusedWindow: true })`.
- Validate that the tab ID exists before attempting to open the panel.
- Call `chrome.sidePanel.open({ tabId })` only after feature detection.
- Use a shared helper for opening the panel so toolbar clicks, context-menu actions, and keyboard commands follow consistent error handling.
- Keep the existing side-panel path. Do not create a second panel page.
- Do not add a global `keydown` listener or content-script keyboard listener.
- Do not intercept keystrokes typed into webpage inputs.
- Do not request broad host permissions just for the shortcut.

### Shortcut settings guidance

In the More options > Settings dummy page, show a small section explaining that the keyboard shortcut can be changed through the browser's extension shortcut settings.

Include:

- Current default shortcut label.
- A short instruction to open the browser's extension shortcut settings.
- A button/link that opens the appropriate settings page if the browser supports it.
- A fallback instruction if the settings page cannot be opened programmatically.

Use the browser's built-in settings page, not a custom shortcut editor.

## 6. More options — create a dummy page for every option

The More options menu must retain the existing item order:

1. New chat
2. Artifacts
3. Scheduled tasks
4. Plugins
5. Notetaker
6. Divider
7. Settings
8. Account

Create a separate in-extension dummy page/view for each item other than New chat. These pages must be accessible by clicking the corresponding menu row.

All data must be local static demo data. Do not connect to real services.

### Shared page behavior

- Use a reusable `MenuPageLayout` component.
- Keep the shared Runable Companion header consistent.
- Each page must have a back button with a Lucide arrow icon.
- Each page must show its own title and relevant icon.
- Each page should contain believable sample content, cards, rows, or settings.
- Keep all pages responsive and consistent with the existing design.
- Do not open external tabs for menu navigation.
- Clicking a menu item closes the dropdown and navigates inside the side panel.
- Back navigation returns to the previous/home view without accidentally opening More options.
- New chat returns to the home view and clears the current local demo conversation and pending selected-text context.

### Required dummy page content

#### A. Artifacts

Create an Artifacts page with:

- Page title and relevant icon.
- Sample artifact cards for:
  - A document
  - A presentation
  - A report
- Each card should show a dummy name, created date, type, and status.
- Clicking a card may open a simple local preview/detail view.
- Do not create or store real files.

#### B. Scheduled tasks

Create a Scheduled tasks page with:

- Page title and clock/calendar icon.
- Two or three sample scheduled tasks.
- Each task should show:
  - Task name
  - Short description
  - Frequency/cadence
  - Next-run label
  - Enabled or paused status
- Add a local toggle interaction to switch enabled/paused state.
- State changes must remain local and must not schedule a real task.

#### C. Plugins

Create a Plugins page with:

- Page title and plug icon.
- Sample plugin cards such as Google Drive, Gmail, and Slack.
- Each card should include a short dummy description and a **Connect** button.
- Clicking Connect should change the local button/status to a demo connected state.
- Do not authenticate, request credentials, or connect to any external service.
- Clearly label this as a demo interaction.

#### D. Notetaker

Create a Notetaker page with:

- Page title and relevant icon.
- Sample meeting notes containing:
  - Meeting title
  - Date
  - Participants
  - Short meeting summary
  - A few action items
- Add a local **New note** interaction if practical.
- Do not access microphone, record audio, or connect to a meeting service.

#### E. Settings

Create a Settings page with:

- Page title and settings icon.
- A simple theme preference control if theme support already exists; otherwise provide a local visual demo toggle.
- A demo notification preference toggle.
- The keyboard shortcut information and browser-settings guidance described in Phase 3.
- Clearly distinguish local demo preferences from actual browser or Runable settings.
- Do not claim to update real Runable account settings.

#### F. Account

Create an Account page with:

- Page title and user icon.
- Static sample profile:
  - Name: `Sunil`
  - Email: `sunil@example.com`
  - Plan: `Demo account`
- A local **Sign out** button that returns to the home screen.
- Clearly label all account information as sample/demo data.
- Do not implement authentication or real sign-out.

## 7. Responsive behavior and visual quality

Preserve the responsive behavior already implemented in Phase 1.

- Support Chrome and Microsoft Edge.
- Support side-panel widths from approximately 320px upward.
- Test widths of 320px, 360px, 400px, 520px, 768px, and 1024px.
- Support short and tall panel heights.
- Avoid horizontal overflow.
- Ensure selected text and URLs wrap/truncate correctly.
- Keep the header and composer usable.
- Allow the conversation and menu-page content area to scroll independently.
- Keep the composer anchored at the bottom.
- Use responsive Tailwind classes and existing CSS tokens.
- Use `lucide-react` icons for controls and menu items; do not replace icons with emoji or plain text symbols.
- Maintain accessible focus states and comfortable click targets.

## 8. Suggested folder structure

Use the current project's folder structure wherever possible. Add only the necessary files. The following is a guide, not a requirement to reorganize the project:

```text
runable-companion/
├── public/
│   ├── icons/
│   └── manifest.json
├── src/
│   ├── background/
│   │   └── serviceWorker.js
│   ├── components/
│   │   ├── Header/
│   │   ├── MoreOptionsMenu/
│   │   ├── MenuPageLayout/
│   │   ├── SelectedContextCard/
│   │   ├── ConversationView/
│   │   ├── ChatComposer/
│   │   ├── Dropdown/
│   │   └── Toast/
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ArtifactsPage.jsx
│   │   ├── ScheduledTasksPage.jsx
│   │   ├── PluginsPage.jsx
│   │   ├── NotetakerPage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── AccountPage.jsx
│   ├── services/
│   │   ├── browserApi.js
│   │   ├── pendingContextService.js
│   │   └── mockRunableService.js
│   ├── data/
│   │   ├── demoData.js
│   │   ├── menuPagesData.js
│   │   └── mockResponses.js
│   ├── hooks/
│   │   └── useOutsideClick.js
│   ├── styles/
│   │   ├── global.css
│   │   └── variables.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

Important:

- Keep `manifest.json` and Vite configuration in the locations expected by the current build.
- Ensure the service worker is emitted as a valid Manifest V3 background service worker.
- Do not import React UI modules into the service worker.
- Keep message passing between the service worker and side panel small and well-defined.
- Reuse existing components rather than duplicating them.
- Keep mock data separate from UI components.

## 9. Manifest permissions and browser compatibility

Add only the permissions required for the implemented features. Likely permissions include:

- `contextMenus` — register the Ask with Runable selection context-menu item.
- `storage` — temporarily store the selected-text context between the context-menu event and side-panel initialization.
- `sidePanel` — open the side panel programmatically.
- `commands` — register the keyboard shortcut command.

Use `tabs` only if required by the actual implementation. Do not request `<all_urls>` or broad host permissions for this feature.

Explain every permission in the README.

Use feature detection for browser APIs. Do not assume all Chromium versions expose identical behavior. Test in both Chrome and Edge, document limitations, and provide a graceful fallback where possible.

## 10. Accessibility and reliability

- Use semantic buttons and links.
- Give icon-only buttons accessible `aria-label` values.
- Keep visible keyboard focus styles.
- Support Escape to close the More options dropdown.
- Ensure menu navigation and back controls are keyboard accessible.
- Avoid state updates after components unmount.
- Handle missing storage data and browser API errors.
- Avoid duplicate context-menu registration.
- Avoid stale selected-text context across tabs.
- Keep browser API logic out of React presentation components.
- Do not silently swallow errors; log useful development diagnostics without exposing sensitive page content.

## 11. Strict scope — do not implement Phase 4

This task includes only:

- Phase 2: Ask with Runable using the browser's real selection context menu.
- Phase 3: Keyboard shortcut to open the side panel.
- Local dummy pages for Artifacts, Scheduled tasks, Plugins, Notetaker, Settings, and Account.
- The More options dropdown closed-by-default correction.
- Local dummy conversation and follow-up responses.

This task does **not** include:

- Summarize this page.
- Full webpage content extraction.
- Slide generation or report generation.
- Real Runable backend/API integration.
- Real AI/model calls.
- Real plugin connections.
- Real scheduled tasks.
- Real account/authentication.
- Real meeting recording or transcription.

Do not implement or partially simulate Phase 4. Leave the existing Summarize this page quick-action as its current Phase 1 placeholder.

## 12. Implementation sequence

Work in this order:

1. Inspect the current project and report the existing architecture briefly.
2. Confirm the existing Phase 1 UI and identify the minimal files that need changes.
3. Correct the More options dropdown so it is closed by default and opens only on ellipsis click.
4. Add the local dummy menu pages using reusable components.
5. Implement the context-menu registration in the Manifest V3 service worker.
6. Implement selected-text payload storage and safe transfer to the side panel.
7. Implement the Selected from webpage card and selected-text conversation state.
8. Hide quick-action cards only in the selected-text conversation state.
9. Add local dummy follow-up responses.
10. Implement the `open-runable-panel` keyboard command.
11. Add shortcut instructions to the Settings dummy page.
12. Verify the existing toolbar-icon side-panel opening still works.
13. Test responsive layouts and accessibility.
14. Build the production extension and fix all errors.
15. Verify the unpacked extension in Chrome and Edge, documenting any browser-specific limitation.

After each major feature, test it before moving to the next. Do not start Phase 4.

## 13. Acceptance criteria and manual test checklist

The implementation is complete only when the following have been checked:

### Existing UI and More options

- [ ] Existing Phase 1 design remains visually consistent.
- [ ] Fresh load shows the More options dropdown closed.
- [ ] Clicking ellipsis opens the dropdown.
- [ ] Clicking ellipsis again closes the dropdown.
- [ ] Outside click closes the dropdown.
- [ ] Escape closes the dropdown.
- [ ] Navigating to a menu page closes the dropdown.
- [ ] All six dummy pages open from their correct menu item.
- [ ] Back navigation works on every dummy page.
- [ ] New chat returns home and clears the local demo conversation/context.
- [ ] Home quick-action cards remain visible on the normal home screen.

### Phase 2 — Ask with Runable

- [ ] Selecting text and right-clicking on a normal webpage shows Ask with Runable.
- [ ] Clicking Ask with Runable opens the side panel for the same tab where supported.
- [ ] The exact selected text appears in the Selected from webpage card.
- [ ] The correct page title and source URL are retained.
- [ ] The four quick-action cards are hidden only in the selected-text conversation state.
- [ ] The sample user prompt and local dummy answer appear.
- [ ] Follow-up messages receive local dummy responses.
- [ ] The composer remains usable and anchored at the bottom.
- [ ] Closing the selected-context card behaves correctly.
- [ ] New chat clears the selected context.
- [ ] No selected text or page metadata is sent over the network.
- [ ] No full-page extraction or real AI call is made.
- [ ] Context from one tab is not shown in another tab.

### Phase 3 — Keyboard shortcut

- [ ] The configured shortcut opens the side panel for the active tab.
- [ ] The shortcut works in Chrome and Edge where supported.
- [ ] The shortcut is configurable through the browser's built-in extension shortcut settings.
- [ ] The default shortcut does not intentionally conflict with common browser shortcuts.
- [ ] Pressing the shortcut does not clear an existing conversation or valid pending context.
- [ ] No global webpage key listener has been added.

### Build and compatibility

- [ ] Production build succeeds.
- [ ] Extension loads as an unpacked extension in Chrome.
- [ ] Extension loads as an unpacked extension in Edge.
- [ ] Responsive widths of 320px, 360px, 400px, 520px, 768px, and 1024px are checked.
- [ ] Short viewport height is checked.
- [ ] No horizontal overflow or clipped controls are present.
- [ ] README documents installation, build, permissions, shortcut customization, demo-only behavior, and known limitations.

## 14. Required final response from the coding agent

After implementation, provide:

1. A concise summary of what was implemented.
2. A list of files created and modified.
3. The final folder structure.
4. Exact install, development, and production build commands.
5. Step-by-step instructions to load the unpacked extension in Chrome and Edge.
6. The default keyboard shortcut and instructions for changing it in browser settings.
7. A completed test checklist with actual pass/fail results — do not mark tests as passed unless they were run.
8. Any known browser/API limitations.
9. A clear statement confirming that all AI/backend-like data and responses are dummy/local and that Phase 4 was not implemented.

**Final instruction:** Preserve the existing Phase 1 project and visual design. Implement only the features in this prompt. Make the browser interactions real where specified, but keep all AI responses and product/backend data local and dummy. Do not modify or overwrite the previous Phase 1 `.md` prompt file.
