# Runable Companion — Keyboard Shortcut Conflict Fix Prompt

## Goal

Fix the Runable Companion keyboard shortcut so it opens the extension side panel reliably in both Google Chrome and Microsoft Edge.

**The letter `R` is compulsory. Do not replace it with `Y`, `F`, or another letter.**

The current shortcut behavior is unreliable. When `Alt + Shift + R` is pressed while browsing, the browser appears to activate another reading/page feature instead of opening Runable Companion. The shortcut must be registered and handled by the browser extension itself, not captured by webpage JavaScript.

Use this prompt together with the existing Phase 1, Phase 2/3, and Phase 4 project prompts. Treat the current repository as the source of truth for folder structure, naming conventions, UI components, styling, and existing behavior.

---

## 1. Inspect the existing project before changing code

First inspect the complete existing extension project.

Identify:

- `manifest.json` and its current Manifest V3 configuration.
- The background service worker file and how it is registered.
- The existing side-panel entry point and React mounting process.
- The current implementation of the keyboard shortcut.
- Any `keydown` / `keyup` listeners in content scripts, injected scripts, React components, or the webpage.
- Any use of `chrome.commands`, `chrome.sidePanel`, `chrome.runtime`, `chrome.tabs`, or browser-specific APIs.
- Existing shortcut instructions or shortcut labels displayed in the UI.
- The current Chrome and Edge compatibility approach.

Do not create a second shortcut handler if one already exists. Find and correct the existing implementation.

Before editing, explain briefly which files need changes and why. Then implement the fix.

## 2. Root cause to investigate

The current implementation may be failing for one or more of these reasons:

1. `Alt + Shift + R` may be intercepted by a browser feature, operating-system shortcut, or another installed extension.
2. The shortcut may be handled using a webpage-level keyboard listener instead of the extension Commands API.
3. The shortcut may be declared incorrectly in `manifest.json`.
4. The background service worker may not be receiving the command event.
5. The command event may be received, but the side panel is not opened using the correct browser API or active window ID.
6. The extension may not have been reloaded after changing `manifest.json`.
7. The shortcut shown in the UI may not match the shortcut actually registered by the browser.

Use the screenshot supplied with this task as a symptom reference: after the attempted shortcut, the browser displays a reading-style page interface rather than opening Runable Companion. Do not assume the screenshot alone proves which browser feature owns the shortcut. Verify the actual behavior in Chrome and Edge.

## 3. Required shortcut

### Preferred default shortcut: `Alt + R`

Use `Alt + R` as the first-choice default because:

- The letter `R` remains part of the shortcut.
- It is shorter than a three-key combination.
- It avoids the reported `Alt + Shift + R` behavior.
- It avoids the known `Ctrl + Shift + R` hard-reload shortcut used by Chrome/Edge.
- It does not use `Ctrl + Alt`, which the Chrome Commands API does not permit because of AltGr keyboard-layout conflicts.

Do not silently substitute another letter if `Alt + R` is unavailable.

If `Alt + R` is reserved or unavailable in a tested browser/platform:

1. Keep `R` as the final key.
2. Inspect the browser's available shortcut configuration and test only combinations that satisfy the extension Commands API requirements.
3. Do not use `Ctrl + Alt + R`.
4. Do not use `Ctrl + R` or `Ctrl + Shift + R`, because these are browser reload shortcuts.
5. Do not reuse `Alt + Shift + R` without confirming that the reported conflict is resolved.
6. If no reliable combination containing `R` is available, report the limitation clearly and explain how the user can assign an available `R` combination in the browser's extension shortcut settings. Do not claim that a conflicting shortcut can be forcibly overridden.

The shortcut should be configurable by the user through the browser's native extension shortcut settings. Do not build a fake in-app keyboard shortcut recorder unless the existing project already has one and it is genuinely needed.

## 4. Register the shortcut through Manifest V3

Use the browser Extensions Commands API.

Update the existing `manifest.json` without deleting or replacing unrelated fields, permissions, content scripts, side-panel configuration, icons, or other working features.

Add or correct a command definition equivalent to:

```json
{
  "commands": {
    "open-runable-side-panel": {
      "suggested_key": {
        "default": "Alt+R"
      },
      "description": "Open Runable Companion side panel"
    }
  }
}
```

Important:

- Merge this into the existing manifest; do not replace the complete manifest with this small example.
- Keep the existing `manifest_version: 3`.
- Preserve the existing side-panel declaration and all required permissions.
- Do not add unnecessary permissions.
- Do not define a second command with the same purpose.
- Do not use the reserved `_execute_action` command if the existing implementation needs a custom command event to open the side panel.
- Do not add `"global": true`; this shortcut only needs to work while the browser is active.
- Keep the command name stable: `open-runable-side-panel`.

If platform-specific shortcut values are required, define them only after testing the platform behavior. Do not invent platform-specific combinations that may collide with browser or operating-system shortcuts.

## 5. Handle the command in the background service worker

Register the command listener in the existing Manifest V3 background service worker.

Implementation requirements:

- Listen using `chrome.commands.onCommand.addListener(...)`.
- Respond only to the exact command name `open-runable-side-panel`.
- Query or obtain the active browser window safely.
- Open the existing Runable Companion side panel in that active window using the supported Side Panel API.
- Use the existing side-panel path and React entry point.
- Do not open a new tab.
- Do not navigate or redirect the current webpage.
- Do not open the extension popup instead of the side panel.
- Do not change the active tab or current page URL.
- Handle missing tab/window information and API errors without crashing the service worker.
- Add useful development logs for command received, target window, open success, and failure.
- Avoid duplicate event listeners or repeated registration.

Use the API pattern supported by the current project and the browser version, for example:

```js
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "open-runable-side-panel") return;

  try {
    const [activeTab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    });

    if (!activeTab || typeof activeTab.windowId !== "number") {
      console.warn("[Runable] No active browser window found.");
      return;
    }

    await chrome.sidePanel.open({
      windowId: activeTab.windowId
    });

    console.info("[Runable] Side panel opened from keyboard shortcut.");
  } catch (error) {
    console.error("[Runable] Failed to open side panel:", error);
  }
});
```

This is an implementation reference, not an instruction to duplicate code blindly. Check the existing service worker, supported browser APIs, and current project structure before integrating it.

If the current extension uses a different supported mechanism to open the side panel, preserve and reuse that mechanism.

## 6. Remove incorrect webpage-level shortcut handling

Search the entire project for keyboard listeners that attempt to open Runable Companion.

If the shortcut is currently implemented with any of the following inside a content script or webpage:

- `document.addEventListener("keydown", ...)`
- `window.addEventListener("keydown", ...)`
- `document.onkeydown`
- `window.onkeydown`

remove or refactor the shortcut-opening behavior so it is not dependent on webpage key events.

Do not use:

- `event.key === "r"` checks in page scripts to implement the extension shortcut.
- `event.altKey`, `event.ctrlKey`, or `event.shiftKey` checks in content scripts for this feature.
- `preventDefault()` or `stopPropagation()` to suppress browser shortcuts.
- DOM injection or polling to detect the shortcut.
- A React component listener as the primary shortcut handler.

The browser should receive the shortcut through `chrome.commands`, and the extension service worker should handle it.

Keep unrelated keyboard interactions in the application unchanged.

## 7. Preserve the existing side-panel UI and behavior

This is a shortcut bug fix, not a redesign.

When the shortcut is pressed:

- Open the existing Runable Companion side panel immediately.
- Display the same React UI already implemented in the project.
- Preserve the current Runable Companion header, icons, chat interface, dummy responses, More Options menu, and all existing pages.
- Preserve the existing responsive layout and Tailwind CSS styling.
- Do not reset the current conversation or selected webpage context merely because the panel was opened.
- Do not change the current page's URL or page content.
- If the side panel is already open, do not create another panel or duplicate the UI. Keep the existing panel in its current state.

The extension should behave consistently whether the user opens it using the extension icon or the keyboard shortcut.

## 8. Chrome and Edge compatibility

The extension must continue to support both Google Chrome and Microsoft Edge using the existing Manifest V3 codebase.

Verify:

- The `commands` declaration is accepted by Chrome.
- The `commands` declaration is accepted by Edge.
- The background service worker receives the command in both browsers.
- The side panel opens in the active window in both browsers.
- The shortcut does not navigate, reload, or transform the current webpage.
- No Chrome-only API is introduced without checking Edge support.
- Any browser-specific differences are handled through a small, reusable compatibility helper rather than duplicated application logic.

Do not claim cross-browser support based only on a successful build. Test the unpacked extension in both browsers.

## 9. Native shortcut configuration and diagnostics

The user must be able to inspect or change the shortcut using the browser's native extension shortcut settings.

Provide clear instructions in the project README or existing setup documentation:

- Chrome: open `chrome://extensions/shortcuts`.
- Edge: open `edge://extensions/shortcuts`.
- Find **Runable Companion**.
- Locate **Open Runable Companion side panel**.
- Check the assigned shortcut.
- If the browser reports a conflict or the shortcut is unassigned, choose an available combination that still ends in `R`.

If useful, add a small diagnostic helper in the background service worker using:

```js
chrome.commands.getAll((commands) => {
  console.table(commands);
});
```

Use this to verify that the command exists and inspect its assigned shortcut. Do not treat `getAll()` as proof that no other browser or operating-system shortcut conflict exists; manually test the actual key combination too.

Do not add a large settings page just for this fix.

## 10. Testing checklist — must complete

After implementing the fix, reload the extension in the browser and test the following.

### Test A — shortcut opens the side panel

1. Open a normal webpage, such as Wikipedia or a blog page.
2. Click inside the webpage.
3. Press `Alt + R`.
4. Confirm that Runable Companion opens in the browser side panel.
5. Confirm that the webpage remains on the same URL.

### Test B — no browser action is triggered

1. Open a normal webpage.
2. Press `Alt + R`.
3. Confirm that the browser does not open a reading interface, navigate to another page, reload the page, or trigger another unrelated browser action.
4. Confirm that Runable Companion opens.

### Test C — shortcut works from different focus positions

Test the shortcut when focus is:

- Inside the webpage.
- Inside a normal text field, where browser command behavior permits it.
- On a different browser tab.
- On a different supported website.

Do not interfere with text entry or accessibility shortcuts. If a browser or operating-system reserved combination takes priority, document that limitation rather than attempting to suppress it.

### Test D — side panel is already open

1. Open Runable Companion using the extension icon.
2. Press `Alt + R`.
3. Confirm that the existing panel remains usable.
4. Confirm that no duplicate panel, tab, or conversation is created.

### Test E — native shortcut settings

1. Open the browser's extension shortcut settings.
2. Confirm that the Runable command appears.
3. Confirm that the assigned shortcut contains the letter `R`.
4. Change it to another available combination ending in `R`.
5. Test the newly assigned combination.
6. Confirm that the extension responds to the updated shortcut.

### Test F — both browsers

Repeat the relevant tests in:

- Google Chrome.
- Microsoft Edge.

Record any browser-specific limitations.

## 11. Acceptance criteria

The work is complete only when all of the following are true:

- [ ] The shortcut's final key is `R`; it has not been replaced by `Y`, `F`, or another letter.
- [ ] The preferred default is `Alt + R`, subject to actual browser/platform conflict verification.
- [ ] The shortcut is registered through Manifest V3 `commands`.
- [ ] The background service worker receives `open-runable-side-panel`.
- [ ] The existing Runable Companion side panel opens in the active browser window.
- [ ] The current webpage does not navigate, reload, or switch to a reading interface because of the extension's shortcut handler.
- [ ] No webpage-level keyboard listener is used to implement this extension shortcut.
- [ ] The shortcut is configurable through the browser's native extension shortcut settings.
- [ ] Existing Phase 1, Phase 2, Phase 3, and Phase 4 features continue to work.
- [ ] Existing UI, folder structure, styling, dummy data, and responsive behavior remain unchanged.
- [ ] Chrome and Edge have both been tested.
- [ ] Any shortcut conflict that cannot be overridden is clearly documented.

## 12. Strict development constraints

- Use the existing React.js + JSX + Vite + Tailwind CSS project.
- Preserve the current folder structure and reusable components.
- Follow the existing code style and naming conventions.
- Use freely available browser extension APIs and open-source packages already present in the project.
- Do not introduce a paid service, backend, database, or external API.
- Do not rewrite unrelated files.
- Do not redesign the side panel.
- Do not remove or break existing functionality.
- Do not claim that a shortcut works unless it has been tested in the browser.
- Provide the complete updated contents of every changed file.
- List the exact files changed and explain the purpose of each change.
- Include step-by-step instructions to reload and test the extension in Chrome and Edge.

## Final instruction to the coding agent

**Fix the actual shortcut registration and event-handling issue. Do not work around it by listening for keys inside the webpage. Keep `R` compulsory. Start by testing `Alt + R` as the default, verify that it is not intercepted by Chrome, Edge, or the operating system, and use the browser's native extension Commands API to open the existing Runable Companion side panel. Preserve every existing feature and UI component.**
