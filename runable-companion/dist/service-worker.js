// Runable Companion - Background Service Worker (Manifest V3)
// Handles context menus, keyboard shortcuts, and side panel opening.

const CONTEXT_MENU_ID = 'ask-with-runable';
const SHORTCUT_COMMAND_ID = 'open-runable-panel';

// Configure side panel to open on extension action click
if (chrome.sidePanel?.setPanelBehavior) {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((err) => console.warn('Failed to set panel behavior:', err));
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
          console.warn('Context menu creation warning:', chrome.runtime.lastError.message);
        }
      }
    );
  });
}

// Re-register on install or update
chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});

// Also register on startup in case service worker was re-initialized
chrome.runtime.onStartup?.addListener(() => {
  setupContextMenu();
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
    console.error('Failed to store pending context:', err);
  }
}

// Safe helper to open side panel
async function openSidePanelForTab(tab) {
  if (!chrome.sidePanel?.open) {
    console.warn('chrome.sidePanel.open API is unavailable in this browser environment.');
    return;
  }

  try {
    if (tab?.id) {
      await chrome.sidePanel.open({ tabId: tab.id });
    } else if (tab?.windowId) {
      await chrome.sidePanel.open({ windowId: tab.windowId });
    } else {
      const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      if (activeTab?.id) {
        await chrome.sidePanel.open({ tabId: activeTab.id });
      }
    }
  } catch (err) {
    console.warn('Could not open side panel:', err);
  }
}

// Handle Context Menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
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

  // 1. Store payload before opening side panel to avoid race condition
  await storePendingContext(payload);

  // 2. Open side panel
  await openSidePanelForTab(tab);

  // 3. Notify side panel if it is already mounted and listening
  try {
    chrome.runtime.sendMessage({
      type: 'SELECTION_CONTEXT_UPDATED',
      payload,
    }).catch(() => {
      // Ignore errors when no receiver is active
    });
  } catch (_) {}
});

// Handle Keyboard Shortcut command (Alt + Shift + R)
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== SHORTCUT_COMMAND_ID) return;

  try {
    const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (activeTab) {
      await openSidePanelForTab(activeTab);
    }
  } catch (err) {
    console.warn('Error handling keyboard shortcut command:', err);
  }
});

// Backup click listener for action icon if setPanelBehavior is not supported
chrome.action?.onClicked?.addListener(async (tab) => {
  await openSidePanelForTab(tab);
});
