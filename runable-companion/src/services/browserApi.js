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
 * Retrieves the currently active browser tab information safely.
 * Prioritizes currentWindow so side panel requests target the companion webpage.
 */
export async function getActiveTabInfo() {
  if (isExtensionContext && chrome.tabs?.query) {
    try {
      // 1. Try currentWindow first (most reliable when side panel is focused)
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true }).catch(() => []);
      if (!tab) {
        // 2. Try lastFocusedWindow
        [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true }).catch(() => []);
      }
      if (!tab) {
        // 3. Fallback: query any active non-extension tab
        const allActive = await chrome.tabs.query({ active: true }).catch(() => []);
        tab = allActive.find((t) => t.url && !t.url.startsWith('chrome-extension://')) || allActive[0];
      }
      if (tab) {
        return {
          id: tab.id || null,
          url: tab.url || '',
          title: tab.title || '',
        };
      }
    } catch (err) {
      console.warn('Failed to query active tab:', err);
    }
  }

  // Fallback for dev preview
  return {
    id: null,
    url: 'https://example.com/ai-agents',
    title: 'The future of AI agents | Blog',
  };
}

const BACKEND_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Converts a Blob to a base64 string.
 */
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const resultStr = reader.result || '';
      const b64 = resultStr.includes(',') ? resultStr.split(',')[1] : resultStr;
      resolve(b64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Extracts text from a PDF document via backend /api/extract-pdf service.
 * Supports both raw base64 data and direct local filesystem paths.
 */
async function extractPdfWithBackend({ base64Data = null, filePath = null, title = '', url = '' }) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/extract-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base64_data: base64Data,
        file_path: filePath,
        title: title || 'PDF Document',
        url: url || '',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        text: data.text || '',
        title: data.title || title || 'PDF Document',
        url: data.url || url,
        contentType: 'pdf',
        numPages: data.num_pages || 0,
        isEncrypted: Boolean(data.is_encrypted),
        isScanned: Boolean(data.is_scanned),
        truncated: Boolean(data.is_truncated),
        isProtected: false,
        warning: data.warning || null,
      };
    }
  } catch (err) {
    console.warn('Backend PDF extraction failed:', err);
  }

  return null;
}

/**
 * In-tab extraction function executed inside the target page.
 * Prioritizes rendered DOM text including all div, span, p, and headings.
 * Strips script, style, form, inputs, navbars, footers, cookie banners, ads.
 * Normalizes whitespace, preserves hierarchy, and limits to 12,000 characters.
 */
function inTabContentExtractor(maxChars = 12000) {
  try {
    if (!document || !document.body) {
      return {
        text: '',
        title: document?.title || '',
        url: window.location.href || '',
        truncated: false,
        contentType: 'html',
      };
    }

    // Identify primary content containers
    const candidates = [
      document.querySelector('main'),
      document.querySelector('article'),
      document.querySelector('[role="main"]'),
      document.getElementById('content'),
      document.getElementById('main-content'),
      document.querySelector('#mw-content-text'), // Wikipedia content
      document.querySelector('.post-content'),
      document.querySelector('.article-body'),
      document.body,
    ];

    const rootElement =
      candidates.find((el) => el && el.innerText && el.innerText.trim().length > 100) ||
      document.body;

    const clone = rootElement.cloneNode(true);

    // Remove boilerplate and noise
    const unwantedSelectors = [
      'script',
      'style',
      'noscript',
      'iframe',
      'svg',
      'canvas',
      'nav',
      '[role="navigation"]',
      'footer',
      '[role="contentinfo"]',
      'form',
      'input',
      'textarea',
      'select',
      'button',
      '.cookie-banner',
      '#cookie-banner',
      '.cookie-notice',
      '.gdpr',
      '.consent-modal',
      '.ad',
      '.ads',
      '.advertisement',
      '#sidebar',
      '.sidebar',
    ];

    for (const sel of unwantedSelectors) {
      const elements = clone.querySelectorAll(sel);
      elements.forEach((el) => el.remove());
    }

    // Tag headings so innerText preserves them as section headers
    clone.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"]').forEach((h) => {
      const hText = (h.textContent || '').trim();
      if (hText) {
        h.textContent = `\n## ${hText}\n`;
      }
    });

    // Tag list items
    clone.querySelectorAll('li, [role="listitem"]').forEach((li) => {
      const liText = (li.textContent || '').trim();
      if (liText && !liText.startsWith('•')) {
        li.textContent = `• ${liText}\n`;
      }
    });

    // clone.innerText naturally captures all text inside div, span, p, and headings
    const rawText = clone.innerText || clone.textContent || '';

    // Clean and deduplicate adjacent identical lines
    const rawLines = rawText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const deduped = [];
    for (let i = 0; i < rawLines.length; i++) {
      if (i === 0 || rawLines[i] !== rawLines[i - 1]) {
        deduped.push(rawLines[i]);
      }
    }

    let fullText = deduped.join('\n\n');

    let truncated = false;
    if (fullText.length > maxChars) {
      fullText = fullText.slice(0, maxChars) + '\n\n[Content truncated for brevity]';
      truncated = true;
    }

    return {
      text: fullText,
      title: document.title || '',
      url: window.location.href || '',
      truncated,
      contentType: 'html',
    };
  } catch (err) {
    return {
      text: (document.body?.innerText || '').slice(0, maxChars),
      title: document?.title || '',
      url: window.location.href || '',
      truncated: false,
      contentType: 'html',
      error: String(err),
    };
  }
}

/**
 * Extracts readable page content from the specified or active tab.
 * Supports HTML websites, React/SPAs, and PDF documents.
 * Returns normalized PageContext object:
 * { text, title, url, contentType, truncated, isProtected, isEncrypted, isScanned, warning, error }.
 */
export async function extractActivePageContent(tabId = null) {
  if (isExtensionContext) {
    try {
      let targetTabId = tabId;
      let targetTabUrl = '';
      let targetTabTitle = '';

      if (targetTabId && chrome.tabs?.get) {
        const tab = await chrome.tabs.get(targetTabId).catch(() => null);
        if (tab) {
          targetTabUrl = tab.url || '';
          targetTabTitle = tab.title || '';
        }
      }

      if (!targetTabId) {
        const tabInfo = await getActiveTabInfo();
        targetTabId = tabInfo.id;
        targetTabUrl = tabInfo.url;
        targetTabTitle = tabInfo.title;
      }

      // 1. Check if URL is protected by browser policies
      if (
        targetTabUrl &&
        (targetTabUrl.startsWith('chrome://') ||
          targetTabUrl.startsWith('chrome-extension://') ||
          targetTabUrl.startsWith('edge://') ||
          targetTabUrl.startsWith('about:') ||
          targetTabUrl.startsWith('view-source:'))
      ) {
        return {
          text: '',
          title: targetTabTitle || 'Browser Protected Page',
          url: targetTabUrl,
          contentType: 'protected',
          truncated: false,
          isProtected: true,
          warning:
            'Browser security policies restrict extensions from accessing internal settings or store pages.',
        };
      }

      // 2. Check if URL points to a PDF document
      const isPdf =
        (targetTabUrl &&
          (targetTabUrl.toLowerCase().endsWith('.pdf') ||
            targetTabUrl.toLowerCase().includes('.pdf?') ||
            targetTabUrl.toLowerCase().includes('/pdf/'))) ||
        (targetTabTitle && targetTabTitle.toLowerCase().endsWith('.pdf'));

      if (isPdf) {
        // A. For local file:// URLs, try direct backend filesystem extraction first
        if (targetTabUrl.startsWith('file://')) {
          let localFilePath = null;
          try {
            const decoded = decodeURIComponent(targetTabUrl);
            let clean = decoded.replace(/^file:\/\/\/?/i, '');
            // On Windows, fix slash orientations
            clean = clean.replace(/\//g, '\\');
            localFilePath = clean;
          } catch (_) {}

          if (localFilePath) {
            const directFileRes = await extractPdfWithBackend({
              filePath: localFilePath,
              title: targetTabTitle,
              url: targetTabUrl,
            });
            if (directFileRes && directFileRes.text) {
              return directFileRes;
            }
          }
        }

        // B. Try fetching blob directly in extension context
        let base64Data = null;
        try {
          const fetchRes = await fetch(targetTabUrl);
          if (fetchRes.ok) {
            const blob = await fetchRes.blob();
            base64Data = await blobToBase64(blob);
          }
        } catch (fetchErr) {
          console.warn('Direct PDF fetch failed, attempting service worker fetch...', fetchErr);
        }

        // C. If direct fetch failed (e.g. file:// or cross-origin), try through service worker
        if (!base64Data && isExtensionContext && chrome.runtime?.sendMessage) {
          try {
            const swRes = await new Promise((resolve) => {
              chrome.runtime.sendMessage(
                { type: 'FETCH_PDF_BYTES', url: targetTabUrl },
                (res) => resolve(res)
              );
            });
            if (swRes && swRes.success && swRes.base64) {
              base64Data = swRes.base64;
            }
          } catch (swErr) {
            console.warn('Service worker PDF fetch failed:', swErr);
          }
        }

        // D. Send base64 to backend parser
        if (base64Data) {
          const result = await extractPdfWithBackend({
            base64Data,
            title: targetTabTitle,
            url: targetTabUrl,
          });
          if (result && (result.text || result.warning)) {
            return result;
          }
        }

        return {
          text: '',
          title: targetTabTitle || 'PDF Document',
          url: targetTabUrl,
          contentType: 'pdf',
          truncated: false,
          isProtected: false,
          warning: targetTabUrl.startsWith('file://')
            ? "Cannot read local PDF. Please verify 'Allow access to file URLs' is enabled in chrome://extensions."
            : 'Cannot access PDF content. If the document requires login, please copy and paste the text into chat.',
        };
      }

      // 3. Normal HTML / React / SPA webpage extraction via scripting
      if (targetTabId && chrome.scripting?.executeScript) {
        const results = await chrome.scripting.executeScript({
          target: { tabId: targetTabId },
          func: inTabContentExtractor,
          args: [12000],
        });

        if (results && results[0]?.result) {
          const res = results[0].result;
          return {
            text: res.text || '',
            title: res.title || targetTabTitle,
            url: res.url || targetTabUrl,
            contentType: 'html',
            truncated: Boolean(res.truncated),
            isProtected: false,
            warning: null,
          };
        }
      }
    } catch (err) {
      console.warn('Could not extract page content:', err);
      return {
        text: '',
        title: '',
        url: '',
        contentType: 'unknown',
        truncated: false,
        isProtected: false,
        warning: `Page extraction failed: ${err.message}`,
        error: err.message,
      };
    }
  }

  // Fallback for dev preview mode (e.g. Vite running on localhost)
  return {
    text: 'Sundar Pichai is the CEO of Google and Alphabet. Education: The Wharton School (MBA), Stanford University (MS), Indian Institute of Technology, Kharagpur (B.Tech). Focused on organizing information and making it universally accessible.',
    title: 'Sundar Pichai - CEO at Google | LinkedIn',
    url: 'https://www.linkedin.com/in/sundarpichai',
    contentType: 'html',
    truncated: false,
    isProtected: false,
  };
}

/**
 * Backward compatibility wrapper returning raw text string.
 */
export async function extractActivePageText(tabId) {
  const result = await extractActivePageContent(tabId);
  return result?.text || '';
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
