/**
 * Browser API Compatibility Layer
 *
 * Provides safe wrappers around Chromium Extension APIs with fallbacks
 * for development preview mode (e.g., standard browser tab on localhost).
 */

const isExtensionContext =
  typeof chrome !== 'undefined' && Boolean(chrome.runtime?.id);

/**
 * Reads pending selection context from session (or local) storage.
 */
export async function getPendingContext() {
  if (!isExtensionContext) {
    // Check localStorage fallback for local preview testing
    try {
      const saved = sessionStorage.getItem('runable_pending_selection');
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  }

  try {
    if (chrome.storage?.session) {
      const data = await chrome.storage.session.get('pending_selection');
      if (data?.pending_selection) return data.pending_selection;
    }

    if (chrome.storage?.local) {
      const data = await chrome.storage.local.get('pending_selection');
      if (data?.pending_selection) return data.pending_selection;
    }
  } catch (err) {
    console.warn('Failed to retrieve pending context:', err);
  }

  return null;
}

/**
 * Clears pending selection context from storage.
 */
export async function clearPendingContext() {
  if (!isExtensionContext) {
    try {
      sessionStorage.removeItem('runable_pending_selection');
    } catch (_) {}
    return;
  }

  try {
    if (chrome.storage?.session) {
      await chrome.storage.session.remove('pending_selection');
    }
    if (chrome.storage?.local) {
      await chrome.storage.local.remove('pending_selection');
    }
  } catch (err) {
    console.warn('Failed to clear pending context:', err);
  }
}

/**
 * Subscribes to runtime messages and storage changes from service worker.
 */
export function onContextChange(callback) {
  if (!isExtensionContext) return () => {};

  const messageListener = (message) => {
    if (message?.type === 'SELECTION_CONTEXT_UPDATED' && message.payload) {
      callback(message.payload);
    }
  };

  const storageListener = (changes, areaName) => {
    if ((areaName === 'session' || areaName === 'local') && changes.pending_selection) {
      callback(changes.pending_selection.newValue || null);
    }
  };

  chrome.runtime.onMessage.addListener(messageListener);
  chrome.storage?.onChanged?.addListener(storageListener);

  return () => {
    chrome.runtime.onMessage.removeListener(messageListener);
    chrome.storage?.onChanged?.removeListener(storageListener);
  };
}

/**
 * Safely opens a URL in a new tab.
 */
export function openExternalUrl(url) {
  if (!url) return;
  try {
    if (isExtensionContext && chrome.tabs?.create) {
      chrome.tabs.create({ url });
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  } catch (e) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Open the browser's extension shortcut configuration page.
 */
export function openShortcutSettings() {
  const isEdge = navigator.userAgent.includes('Edg/');
  const shortcutUrl = isEdge ? 'edge://extensions/shortcuts' : 'chrome://extensions/shortcuts';

  try {
    if (isExtensionContext && chrome.tabs?.create) {
      chrome.tabs.create({ url: shortcutUrl });
    } else {
      window.open(shortcutUrl, '_blank');
    }
  } catch (err) {
    console.warn('Cannot open browser internal page directly:', err);
  }
}

