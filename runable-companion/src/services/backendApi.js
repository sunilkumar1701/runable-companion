/**
 * Runable Companion — FastAPI Backend Client
 *
 * Connects the extension side panel to the local FastAPI backend (127.0.0.1:8000)
 * powered by AgentRouter's gpt-6.1-sol model.
 *
 * Provides:
 * - Health verification
 * - Progressive SSE streaming chat completions
 * - Webpage summarization
 * - Automatic graceful fallback to mock service if backend is offline
 */

import { getAssistantResponse as getMockAssistantResponse } from './mockRunableService';
import { getPageSummary as getMockPageSummary, getSummaryFollowUpResponse as getMockSummaryFollowUp } from './mockSummaryService';

const BACKEND_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Checks if the local FastAPI backend is active and reachable.
 * @returns {Promise<boolean>}
 */
export async function isBackendAvailable() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1200);

    const res = await fetch(`${BACKEND_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      return data?.status === 'ok';
    }
  } catch (_) {
    // Backend offline or unreachable
  }
  return false;
}

/**
 * Parses raw text summary from the AI model into structured fields
 * matching PageSummaryCard ({ summary, keyTakeaways, sourceUrl, title }).
 */
function parseSummaryContent(content, title = '', url = '') {
  if (!content) {
    return {
      title,
      sourceUrl: url,
      summary: '',
      keyTakeaways: [],
    };
  }

  // Check if content has "Key takeaways" section
  const takeawaysMatch = content.match(/Key takeaways[:\n]+([\s\S]*)/i);

  let summaryParagraph = content;
  let takeaways = [];

  if (takeawaysMatch) {
    summaryParagraph = content.substring(0, takeawaysMatch.index).trim();
    const rawList = takeawaysMatch[1].trim();

    // Split lines by bullets (*, -, •, numbers)
    takeaways = rawList
      .split('\n')
      .map((line) => line.replace(/^[-*•\d.]+\s*/, '').trim())
      .filter((line) => line.length > 0 && !line.toLowerCase().startsWith('important detail'));
  }

  // If no bullet points were separated, extract sentences or fallback
  if (takeaways.length === 0) {
    const sentences = summaryParagraph.split(/(?<=[.?!])\s+/);
    if (sentences.length > 2) {
      takeaways = sentences.slice(1, 5).map((s) => s.trim());
      summaryParagraph = sentences[0];
    }
  }

  return {
    title,
    sourceUrl: url,
    summary: summaryParagraph,
    keyTakeaways: takeaways,
  };
}

/**
 * Streams a chat completion response progressively using SSE.
 *
 * @param {Object} options
 * @param {Array<{role: string, content: string}>} options.messages
 * @param {Object|null} [options.pageContext]
 * @param {string} [options.mode] - 'chat' | 'ask_selection' | 'page_followup'
 * @param {(token: string) => void} options.onToken - Called for each incoming token chunk
 * @param {(meta: Object) => void} options.onDone - Called when stream completes
 * @param {(err: Error) => void} options.onError - Called on error
 * @returns {Promise<void>}
 */
export async function streamChat({
  messages,
  pageContext = null,
  mode = 'chat',
  onToken,
  onDone,
  onError,
}) {
  // Check backend availability
  const available = await isBackendAvailable();
  if (!available) {
    // Graceful offline mock fallback
    try {
      const lastUserMsg = messages[messages.length - 1]?.content || '';
      const mockReply = await getMockAssistantResponse(lastUserMsg, pageContext);
      // Simulate brief streaming chunks for natural UI feedback
      const words = mockReply.content.split(' ');
      for (let i = 0; i < words.length; i++) {
        await new Promise((r) => setTimeout(r, 18));
        onToken(words[i] + (i < words.length - 1 ? ' ' : ''));
      }
      onDone({ model: 'offline-demo', duration_ms: 200 });
      return;
    } catch (err) {
      onError(err);
      return;
    }
  }

  try {
    // Format page context cleanly
    let formattedContext = null;
    if (pageContext) {
      formattedContext = {
        title: pageContext.pageTitle || pageContext.title || '',
        url: pageContext.pageUrl || pageContext.url || '',
        text: pageContext.text || '',
        selected_text: pageContext.selectedText || '',
      };
    }

    // Only keep role and content in messages
    const sanitizedMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await fetch(`${BACKEND_BASE_URL}/api/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: sanitizedMessages,
        page_context: formattedContext,
        mode,
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.detail || `Server error (${response.status})`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop(); // Keep uncompleted tail in buffer

      for (const block of lines) {
        if (!block.trim()) continue;

        const eventMatch = block.match(/^event:\s*(\w+)/m);
        const dataMatch = block.match(/^data:\s*(.+)$/m);

        const event = eventMatch ? eventMatch[1] : 'token';
        let data = {};
        if (dataMatch) {
          try {
            data = JSON.parse(dataMatch[1]);
          } catch (_) {}
        }

        if (event === 'token' && data.text) {
          onToken(data.text);
        } else if (event === 'done') {
          onDone(data);
        } else if (event === 'error') {
          onError(new Error(data.message || 'Stream error from model'));
          return;
        }
      }
    }

    onDone({ model: 'gpt-6.1-sol', duration_ms: 0 });
  } catch (err) {
    onError(err);
  }
}

/**
 * Summarizes the active page via FastAPI backend.
 * Falls back cleanly to local mock if backend is not available.
 *
 * @param {Object} pageInfo - { title, url, text }
 * @returns {Promise<Object>}
 */
export async function summarizeWebpage({ title = '', url = '', text = '' }) {
  const available = await isBackendAvailable();

  if (!available) {
    // Graceful offline mock fallback
    return await getMockPageSummary({ title, url, text });
  }

  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        url,
        text: text || `Page title: ${title}. URL: ${url}`,
      }),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.detail || `Summarization failed (${res.status})`);
    }

    const data = await res.json();
    const parsed = parseSummaryContent(data.content, data.title || title, data.source_url || url);

    return {
      ...parsed,
      isRealAi: true,
      model: data.model,
      durationMs: data.duration_ms,
    };
  } catch (err) {
    console.warn('Real AI summarize failed, falling back to mock:', err);
    return await getMockPageSummary({ title, url, text });
  }
}

/**
 * Answers a follow-up question regarding a page summary.
 * Uses the streaming chat API with mode 'page_followup'.
 */
export async function streamSummaryFollowUp({
  question,
  summaryData,
  history = [],
  onToken,
  onDone,
  onError,
}) {
  const pageContext = summaryData
    ? {
        title: summaryData.title || '',
        url: summaryData.sourceUrl || '',
        text: summaryData.summary || '',
      }
    : null;

  const messages = [
    ...history,
    { role: 'user', content: question },
  ];

  return streamChat({
    messages,
    pageContext,
    mode: 'page_followup',
    onToken,
    onDone,
    onError,
  });
}

