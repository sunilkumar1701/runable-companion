# Runable Companion — Phase 4 Implementation Prompt
## Summarize This Page + Conversation UI and More Options Page Styling Improvements

> **How to use this prompt:** Give this prompt to your coding agent from the root of the already-existing Runable Companion project. Use the Phase 1 UI prompt and the Phase 2 & Phase 3 implementation prompt as references. This is a **new Phase 4 implementation prompt**. Do not edit, replace, or overwrite either of the previous `.md` prompt files.

---

## Role

Act as a senior React.js and Chromium Extension engineer. Continue the existing **Runable Companion** browser extension and implement:

1. **Phase 4 — Summarize this page**
2. The requested conversation message alignment and response-content improvements.
3. The requested styling and responsive-layout corrections for all More options pages.

This is a **demo-only extension**. The browser interaction and page-content collection may use real browser-extension APIs where necessary, but all summary output, AI-like answers, backend results, and product data must come from local dummy data.

**Do not connect to Runable's real backend, any external AI model, or any remote service. Do not add a backend or database.**

## 1. First inspect the existing project — do not rebuild it

Before changing anything:

1. Inspect the complete current project and its folder structure.
2. Read `package.json`, `manifest.json`, Vite configuration, service-worker/background files, React entry points, existing state/routing logic, and relevant components.
3. Review the completed Phase 1, Phase 2, and Phase 3 implementations.
4. Identify how the existing **Summarize this page** quick action is rendered and how its click handler currently works.
5. Identify how selected webpage context from Phase 2 is stored, displayed, and cleared.
6. Identify the existing conversation/message components and chat composer.
7. Inspect the current Tailwind setup and existing CSS variables/design tokens.
8. Inspect each More options page: Artifacts, Scheduled tasks, Plugins, Notetaker, Settings, and Account.
9. Make a short implementation plan and then make focused changes.

**Do not scaffold a new project if the current project already exists. Do not replace working Phase 1, Phase 2, or Phase 3 components with newly written equivalents.** Preserve all working behavior and add or modify only what is needed.

If the current folder structure differs from the examples in this prompt, follow the actual project structure. Do not move files just to match a suggested tree.

## 2. Technology and project constraints

Continue using the existing stack:

- React.js with JavaScript and JSX — **not TypeScript**
- Vite
- Chrome Extension Manifest V3
- Tailwind CSS as the primary styling library
- Bootstrap 5 only if it is already used and genuinely needed; do not mix Bootstrap and Tailwind utilities on the same elements
- `lucide-react` for interface icons
- Free and open-source packages/resources only

Do not add paid libraries, paid icon packs, external icon APIs, external AI APIs, authentication services, analytics, a backend, or a database.

Use reusable components, hooks, services, and data modules. Avoid putting all feature logic in `App.jsx`. Keep browser-extension API calls in the existing service worker or a small browser API helper layer, not directly inside presentation components.

## 3. Preserve the existing Runable Companion UI

The existing Phase 1 reference screenshots and current working implementation are the visual source of truth.

Preserve:

- Warm off-white/beige background and surfaces.
- Header layout, `R` logo tile, Runable Companion title, plus button, ellipsis button, and close button if already present.
- Existing typography, colors, spacing, borders, shadows, and rounded corners.
- Existing chat composer and its bottom placement.
- Existing home/welcome screen.
- Existing quick-action cards on the normal home screen.
- Existing More options dropdown and all its menu destinations.
- Existing Phase 2 Ask with Runable behavior.
- Existing Phase 3 keyboard shortcut behavior.
- Existing Chrome and Edge compatibility.

Do not redesign the extension. Phase 4 should feel like a natural continuation of the same product.

### Existing More options behavior must remain unchanged

Keep the behavior established in Phase 2/3:

- More options dropdown is **closed by default** on initial load.
- It opens only when the user clicks the ellipsis button.
- Clicking the ellipsis again closes it.
- Outside click closes it.
- Escape closes it.
- Navigating to a menu page closes it.
- Returning home must not unexpectedly open it.

Do not restore the old behavior where the dropdown opened automatically.

## 4. Phase 4 — Summarize this page

### Goal

Implement the **Summarize this page** quick action. When the user clicks it, the extension should show a summarization-in-progress state and then display a structured page summary inside the Runable Companion side panel.

The summary view should retain the source page URL and allow the user to ask follow-up questions using the existing chat composer.

**Important demo rule:** The feature must look and behave like a summarization workflow, but the summary itself must be generated from local dummy data. Do not call an AI model or Runable backend.

### Expected user flow

1. The user opens a normal webpage in Chrome or Microsoft Edge.
2. The user opens Runable Companion using the extension icon or the Phase 3 keyboard shortcut.
3. The normal home screen and quick-action cards appear.
4. The user clicks **Summarize this page**.
5. The extension identifies the active tab and obtains the page URL and title.
6. If the existing permission/API setup allows it, collect readable page text only after the user explicitly clicks the summarize action. Keep this collection local to the browser.
7. Show a loading/progress state in the side panel, such as:
   - Title: **Summarizing this page...**
   - Supporting text: **Reading page content and preparing a summary...**
   - A spinner or subtle progress indicator.
8. After a short demo delay, replace the loading state with the summary result using local dummy summary data.
9. Show the source page URL in the summary card.
10. Display a readable summary paragraph and a **Key takeaways** list.
11. Keep the existing composer at the bottom, with a follow-up placeholder such as **Ask a follow-up question...**
12. The user types a follow-up question and presses Enter or clicks Send.
13. Append the user's message and a deterministic local dummy response to the conversation.
14. The user can continue asking follow-up questions. Every answer must be visibly identified as demo/dummy output where appropriate.

### Quick-action behavior

Use the existing **Summarize this page** quick-action card. Do not add a duplicate card or a second summarization entry point.

When clicked:

- Set the current view to a dedicated summary/conversation state.
- Hide the normal welcome section and the four quick-action cards while the summary workflow is active, matching the supplied summary reference screenshot.
- Keep the existing header visible.
- Keep the chat composer anchored at the bottom.
- Keep the summary content in a scrollable content region between the header and composer.
- Do not navigate away from the active webpage.
- Do not open a new browser tab.

When the user clicks **New chat**:

- Clear the current summary result.
- Clear summary follow-up messages.
- Clear the current page summary context and source metadata.
- Return to the normal home screen.
- Show the welcome section and quick-action cards again.
- Do not open the More options dropdown automatically.

### Summary result UI

Create a reusable component such as `PageSummaryCard`.

The summary state should follow the supplied reference screenshot and contain these elements:

#### A. Loading card

Display a compact loading panel with:

- A spinner/loading icon.
- **Summarizing this page...**
- **Reading page content and preparing a summary...**

Use a subtle neutral background, thin border, rounded corners, and spacing consistent with the existing design.

#### B. Page summary card

Display a larger card containing:

- Document icon.
- Heading: **Page summary**
- Source URL row with a globe icon.
- External-link icon/button to open the source webpage in a new tab.
- Summary paragraph inside a soft inset surface.
- **Key takeaways** heading.
- A concise bullet list of 3–5 takeaways.

The source URL must be the actual URL of the active tab captured when the user clicked Summarize this page. Do not hardcode the source URL from the screenshot.

URL behavior:

- Display a shortened/truncated URL when necessary.
- Preserve the complete URL in the link destination and accessible title.
- Long URLs must not cause horizontal overflow.
- External links must use safe extension/browser APIs and appropriate `rel` behavior if rendered as anchors.

#### C. Dummy summary content

Create realistic local demo data in a dedicated file, for example:

- `src/data/mockSummaryData.js`
- or the equivalent location that fits the current project.

Use the following as the development fixture for the sample article **The future of AI agents**:

**Summary paragraph (sample):**

> This article explains how AI agents are changing the way people work by taking complex, multi-step tasks and turning them into completed results. It describes how agents can research information, build websites, generate reports, use tools and APIs, write code, and create structured outputs such as slides and documents. It also explains that agents combine language models with tools, memory, and execution environments to complete real-world tasks with less manual effort.

**Key takeaways (sample):**

- AI agents can handle complex, multi-step tasks with less manual effort.
- They can research information, build websites, analyze data, and create content.
- Agents use tools, APIs, memory, and execution environments to complete tasks.
- They can produce structured outputs such as reports, slides, and documents.

For any other webpage, use a deterministic local fallback summary. The fallback may use the page title and a short locally extracted text excerpt to make the demo feel contextual, but it must not claim that an AI model analyzed the page.

**Do not pretend that a real AI model generated the summary.** Add a small, tasteful label such as **Demo summary** or **Sample output** if needed to make the demo limitation clear without distracting from the UI.

### Dummy summary service

Create a small service module such as `src/services/mockSummaryService.js`.

Responsibilities:

- Accept page title, URL, and optional locally extracted text.
- Return a deterministic local summary object.
- Use the sample fixture for the known demo article where appropriate.
- Return a generic fallback summary for other pages.
- Return a predictable structure, for example:
  - `title`
  - `sourceUrl`
  - `summary`
  - `keyTakeaways`
  - `isDemo: true`
- Simulate a short loading delay only if it helps demonstrate the loading UI.
- Do not make any network requests.
- Do not import or initialize an AI SDK.
- Do not call Runable, OpenAI, Gemini, Groq, or any other model/API.

Keep mock data separate from UI components.

### Page-content collection and privacy

The intended product concept describes collecting webpage content after the user initiates the action. For this demo:

- Only attempt page-content collection after an explicit click on **Summarize this page**.
- Use the active tab's URL and title as source metadata.
- If readable text extraction is implemented, do it locally in the extension using the minimum required permission/API approach.
- Do not transmit page text, URL, title, or user messages to any server.
- Do not add `<all_urls>` or broad host permissions unless the existing implementation has a clearly justified requirement. Prefer the least-privilege approach supported by the current extension architecture.
- Do not collect form values, password fields, private input contents, or hidden page data.
- Do not attempt to read restricted browser pages such as `chrome://`, `edge://`, extension stores, or other pages where scripting is prohibited.
- If page extraction is unavailable or fails, show the local fallback summary and a small note such as **Using sample content for this demo page**.
- Do not block the demo because a page cannot be read.
- Document clearly in the README that the summary response is local dummy data and no content is sent to Runable or any external service.

## 5. Follow-up chat behavior in the summary view

Reuse the existing `ChatComposer` and existing conversation state management wherever possible.

### Composer behavior

- Placeholder in summary view: **Ask a follow-up question...**
- Multiline text input.
- Enter submits the message.
- Shift+Enter inserts a newline.
- Disable Send when the input is empty or contains only whitespace.
- Clear the input after successful local submission.
- Keep the composer fixed/anchored at the bottom of the panel.
- Ensure the content area scrolls to the latest message when a new message is appended.

### Dummy follow-up responses

When the user submits a follow-up:

1. Append the user message to the conversation.
2. Generate a deterministic local dummy response using `mockSummaryService.js` or a separate `mockRunableService.js`.
3. Append the assistant response.
4. Keep the summary card and source URL visible in the conversation context.
5. Do not make a network request.

Example follow-up:

**User:**
> Can you explain the main idea in simple terms?

**Dummy assistant response:**
> The main idea is that an AI agent can do more than answer a question. It can understand a goal, decide what steps are needed, use tools to complete those steps, and provide a finished result. For example, instead of only suggesting how to prepare a report, an agent could research the topic, organize the information, and create a draft report. This is a sample response for demo purposes.

Use several local response templates or simple keyword-based selection so repeated follow-ups do not always return an identical paragraph. Keep the behavior deterministic and fully offline.

Show a clear demo indicator in the response area, for example **Dummy response for demo purposes**. Do not claim that the answer came from Runable's real agent.

## 6. Conversation UI alignment and response-content changes

There is an existing conversation UI from Phase 2. Make the following visual corrections without breaking its selected-text behavior.

### Required message alignment

- **User messages must appear on the right side.**
- **Runable/assistant responses must appear on the left side.**
- Apply the same alignment consistently in both:
  - Ask with Runable selected-text conversations.
  - Summarize this page follow-up conversations.

### User message style

- Align the user message bubble to the right.
- Use the existing warm beige/soft neutral bubble style from the reference.
- Keep a reasonable maximum width so long messages do not stretch across the full panel.
- Wrap long words and URLs safely.
- Do not add a large avatar unless the existing design already uses one.

### Assistant response style

- Align the assistant response to the left.
- Preserve the existing Runable `R` avatar/icon treatment if already implemented.
- Use a white or very light neutral response surface consistent with the reference.
- Allow enough width for readable paragraphs and lists.
- Avoid excessive empty space between the assistant icon and response content.

### Add a meaningful dummy paragraph to assistant responses

The current assistant response content is too short. Add a realistic additional paragraph to the sample assistant response so the conversation looks complete and visually balanced.

For the Phase 2 sample response, keep the existing explanation and real-world examples, then add a paragraph similar to:

> In everyday use, this could save time when someone needs to understand a long article, compare information from different sources, or prepare a first draft of a document. The agent can help organize the work into smaller steps and present the result in a format that is easier to review. This is a sample response for demo purposes.

Keep the content in the local mock-response data file. Do not hardcode long response text directly inside JSX.

### Message layout implementation

- Use a reusable `MessageBubble` or equivalent component.
- Use a clear role field such as `user` or `assistant` to determine alignment and styling.
- Use a flex container with `justify-end` for user messages and `justify-start` for assistant messages.
- Keep message widths responsive.
- Preserve readable typography and line spacing.
- Support paragraphs, ordered lists, and unordered lists in assistant responses.
- Do not use unsafe `dangerouslySetInnerHTML` for mock message rendering.
- Ensure the user message remains right-aligned at narrow widths.

## 7. Selected webpage context close behavior

Preserve the Phase 2 **Selected from webpage** context card, with this additional behavior:

- When the user clicks the **X / close** button on the Selected from webpage card, remove the selected webpage context completely from the current conversation state.
- Clear the selected text, page title, source URL, and any pending selected-context payload associated with the current session.
- Do not leave hidden stale context that could be reused by a later message.
- The selected-context card must disappear immediately.
- The current visible conversation messages may remain unless the existing product flow explicitly resets them; closing the context card should remove the context, not unexpectedly erase the user's conversation.
- Follow-up messages after closing the card must not be treated as if the selected webpage context is still attached.
- New chat must also clear the selected context and related conversation state.
- Ensure the pending context is not restored from session storage after the user has explicitly closed it.
- Keep the behavior scoped to the current tab/session so context from another tab is not affected.

If the context card's close action currently only hides the card visually, update the underlying React state and pending-context storage as well.

## 8. More options pages — styling and responsive corrections

The current More options pages already exist from Phase 2/3:

1. Artifacts
2. Scheduled tasks
3. Plugins
4. Notetaker
5. Settings
6. Account

Their CSS/layout needs correction. The pages must use the **same Tailwind-based styling system and visual design tokens as the Phase 1 home screen**.

Do not create a new design system or use unrelated styles for each page.

### Shared page styling requirements

Create or improve a reusable `MenuPageLayout` (or the equivalent existing shared layout) and apply it to all six pages.

Each page must:

- Use the same warm off-white/beige background.
- Use the existing primary and secondary text colors.
- Use consistent heading sizes and font weights.
- Use the same border color, card radius, shadow, and spacing scale.
- Use `lucide-react` icons for page headings and controls.
- Use consistent back-navigation placement.
- Use the same card and button styles.
- Have a scrollable content region between the shared header and any fixed footer/composer where applicable.
- Avoid horizontal scrolling.
- Look visually consistent with the Runable Companion home and conversation views.

### Tailwind requirements

- Use Tailwind CSS as the primary styling library.
- Prefer existing Tailwind utility patterns and shared reusable class helpers/components.
- Reuse existing CSS variables/design tokens where available.
- Do not write large page-specific CSS files when the same layout can be achieved with reusable Tailwind classes.
- Keep custom CSS limited to design tokens, special scrollbar behavior, and details that Tailwind cannot express cleanly.
- Do not mix Bootstrap classes and Tailwind classes on the same component.
- Avoid inline styles except for truly dynamic values that cannot reasonably be expressed with classes.
- Remove conflicting or obsolete page-specific styles only after confirming they are no longer used.

### Responsive requirements

All six pages must adapt to the actual browser side-panel width and height. Do not assume a fixed 520px panel.

Test and support widths:

- 320px
- 360px
- 400px
- 520px
- 768px
- 1024px

Also test short and tall viewport heights.

Use responsive Tailwind breakpoints and flexible layouts:

- `w-full`, `max-w-full`, `min-w-0`
- Responsive padding and gaps
- `grid-cols-1` on narrow panels where needed
- Two-column layouts only when there is enough width
- `flex-wrap` for toolbar/action rows
- Safe text wrapping and truncation
- `overflow-y-auto` for page content
- `overflow-x-hidden` only where it does not conceal important content

Do not shrink text to unreadable sizes to make a layout fit. Reflow cards and controls instead.

### A. Artifacts page

- Keep the existing dummy artifact records.
- Display document, presentation, and report artifacts in responsive cards or rows.
- On narrow widths, stack cards vertically.
- On wider widths, use a suitable responsive grid.
- Keep title, file type, date, status, and action controls readable.
- Ensure preview/detail view, if present, also uses the shared design system.

### B. Scheduled tasks page

- Keep the existing dummy scheduled-task records and local enable/paused toggles.
- Stack task details cleanly on narrow widths.
- Keep task title, description, cadence, next-run label, and status visible.
- Ensure toggle controls do not overflow or overlap text.
- Make status badges and action buttons consistent with the rest of the extension.

### C. Plugins page

- Keep existing dummy plugin cards and local Connect/Connected interactions.
- Use responsive cards with consistent icon, title, description, and action placement.
- Buttons must wrap or become full-width when necessary.
- Clearly retain demo-only behavior; do not connect to external services.

### D. Notetaker page

- Keep existing dummy notes and local New note interaction if implemented.
- Ensure meeting title, date, participants, summary, and action items wrap correctly.
- Use readable section spacing and responsive note cards.
- Do not add microphone access, recording, or real transcription.

### E. Settings page

- Keep existing local demo preferences and the keyboard-shortcut guidance from Phase 3.
- Align labels, descriptions, toggles, and controls consistently.
- On narrow widths, stack setting labels and controls vertically.
- Ensure shortcut text and browser-settings guidance wrap without horizontal overflow.
- Do not claim local demo toggles update real Runable settings.

### F. Account page

- Keep existing static demo profile data and local Sign out interaction.
- Make profile information readable at narrow widths.
- Keep avatar/icon, name, email, plan label, and actions aligned.
- Ensure long email addresses wrap or truncate safely.
- Retain clear demo-account labeling.

## 9. Suggested component and data organization

Follow the actual existing project structure and add only the necessary files. The following is a guide:

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
│   │   ├── QuickActions/
│   │   ├── PageSummary/
│   │   │   ├── SummaryLoadingState.jsx
│   │   │   └── PageSummaryCard.jsx
│   │   ├── ConversationView/
│   │   │   ├── ConversationView.jsx
│   │   │   └── MessageBubble.jsx
│   │   ├── SelectedContextCard/
│   │   ├── ChatComposer/
│   │   ├── MenuPageLayout/
│   │   └── MoreOptionsMenu/
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
│   │   ├── mockSummaryService.js
│   │   └── mockRunableService.js
│   ├── data/
│   │   ├── demoData.js
│   │   ├── mockSummaryData.js
│   │   └── mockResponses.js
│   ├── hooks/
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

- Do not reorganize the current project merely to match this example.
- Reuse the existing header, composer, dropdown, toast, menu-page layout, and browser API helpers.
- Keep summary data and dummy responses outside JSX.
- Keep browser APIs out of presentation components.
- Keep summary state and conversation state predictable and easy to reset.
- Do not duplicate the same message rendering logic for Phase 2 and Phase 4.

## 10. Browser permissions and compatibility

Use the existing Manifest V3 setup and preserve the working Phase 2 and Phase 3 permissions.

For page summarization:

- Add only the minimum permission needed to obtain active-tab metadata and, if implemented, user-initiated page text.
- Prefer `activeTab` and narrowly scoped scripting access where appropriate.
- Do not request `<all_urls>` by default.
- Do not add permissions unrelated to this phase.
- Feature-detect `chrome.tabs`, `chrome.scripting`, `chrome.sidePanel`, and storage APIs before using them.
- Handle restricted pages and unavailable APIs gracefully.
- Keep Chrome and Microsoft Edge behavior consistent where their APIs overlap.
- Do not break the existing context-menu action or keyboard shortcut.

If the current architecture already uses a different supported approach for active-tab metadata or page text, preserve it if it is safe and reliable.

## 11. Accessibility and reliability

- Use semantic buttons and links.
- Give icon-only buttons accessible `aria-label` values.
- Keep visible keyboard focus states.
- Maintain adequate text contrast.
- Ensure the summary content and menu pages are keyboard accessible.
- Keep the composer usable with keyboard input.
- Support Enter to submit and Shift+Enter for a newline.
- Avoid state updates after components unmount.
- Handle missing tab metadata, unavailable pages, extraction failures, and storage errors gracefully.
- Do not silently swallow errors; log useful development diagnostics without logging full page content or user messages.
- Avoid stale summary state when switching tabs or starting a new chat.
- Ensure a summary from one tab is not displayed as if it belongs to another tab.
- Prevent duplicate summary requests from repeated rapid clicks; disable or guard the action while loading.

## 12. Strict demo-only data and network rules

The following must remain local dummy/demo behavior:

- Summary paragraph and key takeaways.
- Loading result timing.
- Follow-up assistant responses.
- Phase 2 assistant responses and sample paragraphs.
- Any backend-like data or product information.
- All data shown in Artifacts, Scheduled tasks, Plugins, Notetaker, Settings, and Account pages.

Do not:

- Call Runable's backend or APIs.
- Call OpenAI, Gemini, Groq, Claude, or any other model.
- Use a remote mock API.
- Add a server or database.
- Upload webpage content, URLs, titles, selected text, or chat messages.
- Claim that the demo has performed real AI summarization.

The browser may obtain the active tab URL/title and may read page text locally after the user's explicit action if the required permission is available. However, the summary output must still come from local dummy data.

Add clear comments in the relevant service modules and update the README to explain the demo-only implementation.

## 13. Implementation sequence

Work in this order:

1. Inspect the current project, Phase 1/2/3 implementation, and folder structure.
2. Identify the existing summary quick-action placeholder and the existing conversation/message components.
3. Confirm how active-tab URL/title are obtained and how the extension handles page permissions.
4. Create the local mock summary data and mock summary service.
5. Implement the loading state shown after clicking **Summarize this page**.
6. Implement the Page summary card with source URL, summary paragraph, and key takeaways.
7. Implement the summary conversation state and reuse the existing composer.
8. Add local dummy follow-up responses.
9. Update message alignment so user messages are right-aligned and assistant responses are left-aligned in both Phase 2 and Phase 4.
10. Add the additional dummy paragraph to the Phase 2 assistant response using the local mock-response module.
11. Update the Selected from webpage close button so it clears the underlying selected context and pending context storage.
12. Refactor shared Tailwind styling and correct responsiveness for Artifacts, Scheduled tasks, Plugins, Notetaker, Settings, and Account.
13. Verify New chat clears summary, follow-up messages, selected context, and source metadata.
14. Verify More options remains closed by default and its existing interactions still work.
15. Test responsive widths and short/tall side-panel heights.
16. Build the production extension and fix all errors.
17. Verify the extension in Chrome and Edge and document any API limitations.

After each major change, test it before moving to the next.

## 14. Acceptance criteria and manual test checklist

The implementation is complete only when the following have been checked.

### Phase 4 — Summarize this page

- [ ] Clicking the existing Summarize this page card starts the summary flow.
- [ ] A loading/progress card appears while the demo summary is prepared.
- [ ] The active tab URL is retained as the summary source.
- [ ] The active tab title is used where appropriate.
- [ ] The summary card displays a summary paragraph.
- [ ] The summary card displays 3–5 key takeaways.
- [ ] The source URL is clickable and opens the correct webpage.
- [ ] The summary view hides the normal welcome section and quick-action cards.
- [ ] The header remains visible.
- [ ] The composer remains anchored at the bottom.
- [ ] Follow-up questions can be typed and submitted.
- [ ] User follow-up messages appear on the right.
- [ ] Assistant dummy responses appear on the left.
- [ ] Assistant responses include enough sample paragraph content to look realistic.
- [ ] Follow-up answers are local dummy responses.
- [ ] Repeated clicks do not create duplicate summary requests.
- [ ] New chat clears the summary and follow-up conversation.
- [ ] A page where content extraction is unavailable still shows a graceful demo fallback.
- [ ] No network request is made for summary generation or follow-up answers.

### Conversation UI and Phase 2 regression checks

- [ ] User messages are right-aligned in Ask with Runable conversations.
- [ ] Assistant responses are left-aligned in Ask with Runable conversations.
- [ ] The Phase 2 sample assistant response includes the additional dummy paragraph.
- [ ] Existing selected text and source URL still display correctly.
- [ ] Clicking X on Selected from webpage removes the context card.
- [ ] Closing the context also clears selected text, page title, URL, and pending context storage.
- [ ] Closing the context does not unexpectedly erase the visible conversation.
- [ ] Follow-up messages after context removal do not reuse the removed context.
- [ ] New chat clears all selected-text context and local messages.

### More options pages

- [ ] Artifacts page uses the shared Tailwind design system.
- [ ] Scheduled tasks page uses the shared Tailwind design system.
- [ ] Plugins page uses the shared Tailwind design system.
- [ ] Notetaker page uses the shared Tailwind design system.
- [ ] Settings page uses the shared Tailwind design system.
- [ ] Account page uses the shared Tailwind design system.
- [ ] All six pages reflow correctly at narrow widths.
- [ ] No horizontal overflow or clipped controls appear.
- [ ] Existing dummy data and local interactions still work.
- [ ] Back navigation works from every page.

### Existing features and compatibility

- [ ] More options dropdown remains closed on first load.
- [ ] Ellipsis toggles More options open/closed.
- [ ] Outside click and Escape close More options.
- [ ] Phase 2 Ask with Runable context-menu feature still works.
- [ ] Phase 3 keyboard shortcut still opens the side panel.
- [ ] Toolbar-icon opening still works.
- [ ] New chat returns to the home screen.
- [ ] Chrome build and unpacked-extension loading work.
- [ ] Edge build and unpacked-extension loading work.
- [ ] Responsive widths of 320px, 360px, 400px, 520px, 768px, and 1024px are checked.
- [ ] Short and tall panel heights are checked.
- [ ] Production build succeeds.
- [ ] README documents the demo-only summary behavior and permissions.

## 15. Required final response from the coding agent

After implementation, provide:

1. A concise summary of the Phase 4 feature and requested UI corrections.
2. A list of files created and modified.
3. The final folder structure.
4. Exact install, development, and production build commands.
5. Step-by-step instructions to load the unpacked extension in Chrome and Edge.
6. A summary of the permissions used and why each is required.
7. A completed test checklist with actual pass/fail results. Do not mark tests as passed unless they were run.
8. Any known browser/API limitations.
9. A clear statement confirming that summary content, follow-up responses, and backend-like data are local dummy data and no real AI/backend service is called.

---

## Final instruction

**Preserve the existing Phase 1, Phase 2, and Phase 3 implementation. Implement Phase 4 only, plus the explicitly requested conversation alignment, selected-context close behavior, and More options page styling corrections.**

Do not rebuild the extension, do not overwrite previous prompt files, and do not introduce a new visual design. Make the browser interaction feel real, but keep all summarization and AI-like responses local and dummy for demonstration purposes.
