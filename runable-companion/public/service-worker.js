// Runable Companion - Background Service Worker (Manifest V3)
// Handles context menus, keyboard shortcuts (Alt + R), and side panel opening.

const CONTEXT_MENU_ID = 'ask-with-runable';
const SHORTCUT_COMMAND_ID = 'open-runable-side-panel';

// Configure side panel to open natively on extension action click
function configurePanelBehavior() {
  if (chrome.sidePanel?.setPanelBehavior) {
    chrome.sidePanel
      .setPanelBehavior({ openPanelOnActionClick: true })
      .catch((err) => console.warn('[Runable] Failed to set panel behavior:', err));
  }
}

// Initial configuration
configurePanelBehavior();

// Log registered commands for developer diagnostics
function logRegisteredCommands() {
  if (chrome.commands?.getAll) {
    chrome.commands.getAll((commands) => {
      console.info('[Runable] Registered extension commands:');
      console.table(commands);
    });
  }
}

// Register selection context menu idempotently
function setupContextMenu() {
  if (!chrome.contextMenus) return;

  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create(
      {
        id: CONTEXT_MENU_ID,
        title: 'Ask with Runable',
        contexts: ['selection'],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.warn('[Runable] Context menu warning:', chrome.runtime.lastError.message);
        }
      }
    );
  });
}

// Re-register on install or update
chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
  configurePanelBehavior();
  logRegisteredCommands();
});

// Also register on startup
chrome.runtime.onStartup?.addListener(() => {
  setupContextMenu();
  configurePanelBehavior();
  logRegisteredCommands();
});

// Safe helper to store pending selection in session (or local) storage
async function storePendingContext(payload) {
  try {
    if (chrome.storage?.session) {
      await chrome.storage.session.set({ pending_selection: payload });
    } else if (chrome.storage?.local) {
      await chrome.storage.local.set({ pending_selection: payload });
    }
  } catch (err) {
    console.error('[Runable] Failed to store pending context:', err);
  }
}

// Safe synchronous helper to open side panel without dropping the user gesture token
function openSidePanelSynchronously(tab) {
  if (!chrome.sidePanel?.open) {
    console.warn('[Runable] chrome.sidePanel.open API is unavailable in this environment.');
    return;
  }

  // CRITICAL CHROMIUM REQUIREMENT:
  // chrome.sidePanel.open() strictly requires a user gesture token.
  // Calling `await` before chrome.sidePanel.open() drops the gesture token, causing:
  // "Error: sidePanel.open() may only be called in response to a user gesture."
  // We MUST invoke chrome.sidePanel.open() synchronously right now!

  if (tab && typeof tab.windowId === 'number') {
    chrome.sidePanel
      .open({ windowId: tab.windowId })
      .then(() => {
        console.info('[Runable] Side panel opened successfully via windowId:', tab.windowId);
      })
      .catch((err) => {
        console.warn('[Runable] Failed via windowId, trying tabId fallback:', err);
        if (tab && typeof tab.id === 'number') {
          chrome.sidePanel.open({ tabId: tab.id }).catch((e) => {
            console.error('[Runable] Failed via tabId fallback:', e);
          });
        }
      });
  } else if (tab && typeof tab.id === 'number') {
    chrome.sidePanel
      .open({ tabId: tab.id })
      .then(() => {
        console.info('[Runable] Side panel opened successfully via tabId:', tab.id);
      })
      .catch((e) => {
        console.error('[Runable] Failed via tabId:', e);
      });
  } else {
    // Tab was not supplied synchronously; fallback to querying active tab
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const activeTab = tabs && tabs[0];
      if (activeTab?.windowId) {
        chrome.sidePanel.open({ windowId: activeTab.windowId }).catch((err) => {
          console.warn('[Runable] Fallback windowId open failed:', err);
        });
      } else if (activeTab?.id) {
        chrome.sidePanel.open({ tabId: activeTab.id }).catch((err) => {
          console.warn('[Runable] Fallback tabId open failed:', err);
        });
      }
    });
  }
}

// Handle Context Menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== CONTEXT_MENU_ID) return;

  const selectedText = (info.selectionText || '').trim();
  const pageUrl = tab?.url || '';
  const pageTitle = tab?.title || '';
  const tabId = tab?.id;

  const payload = {
    id: `ctx_${Date.now()}`,
    selectedText,
    pageUrl,
    pageTitle,
    tabId,
    createdAt: Date.now(),
  };

  // 1. Immediately trigger side panel open synchronously to keep user gesture valid
  openSidePanelSynchronously(tab);

  // 2. Concurrently store payload in session storage & notify listening panels
  storePendingContext(payload).then(() => {
    try {
      chrome.runtime
        .sendMessage({
          type: 'SELECTION_CONTEXT_UPDATED',
          payload,
        })
        .catch(() => {
          // Ignore error if panel receiver is not open yet
        });
    } catch (_) {}
  });
});

// Handle Keyboard Shortcut command: "open-runable-side-panel" (Alt + R) or "_execute_action"
// NOTE: The listener is intentionally NOT async to preserve the user gesture token!
chrome.commands.onCommand.addListener((command, tab) => {
  if (command !== SHORTCUT_COMMAND_ID && command !== '_execute_action') return;

  console.info(`[Runable] onCommand shortcut triggered: ${command}`, tab);

  // Synchronously open the side panel using the active tab object passed by Chrome
  openSidePanelSynchronously(tab);
});

// Backup click listener for action icon if setPanelBehavior is not supported
chrome.action?.onClicked?.addListener((tab) => {
  openSidePanelSynchronously(tab);
});

// Safe PDF fetcher in service worker context (has full file:// and host permissions)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'FETCH_PDF_BYTES' && message.url) {
    fetch(message.url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.arrayBuffer();
      })
      .then((buffer) => {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        const chunk = 8192;
        for (let i = 0; i < bytes.length; i += chunk) {
          binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
        }
        const b64 = btoa(binary);
        sendResponse({ success: true, base64: b64 });
      })
      .catch((err) => {
        console.warn('[Runable SW] PDF fetch failed:', err);
        sendResponse({ success: false, error: err.message });
      });
    return true; // asynchronous sendResponse
  }
});

