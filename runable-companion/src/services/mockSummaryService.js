/**
 * Mock Summary Service (Phase 4)
 *
 * Responsibilities:
 * - Generates deterministic local page summaries and follow-up replies.
 * - Simulates a short realistic processing delay for demo visualization.
 * - Does NOT make any network calls or access external AI models.
 */

import {
  SAMPLE_AI_AGENTS_SUMMARY,
  SAMPLE_FOLLOWUP_ANSWERS,
  createFallbackSummary,
} from '../data/mockSummaryData';

/**
 * Returns a page summary object based on active tab metadata and optional text.
 *
 * @param {Object} pageInfo - { title, url, text }
 * @returns {Promise<Object>}
 */
export async function getPageSummary(pageInfo = {}) {
  const { title = '', url = '', text = '' } = pageInfo;

  // Simulate short realistic delay for the loading indicator demo
  await new Promise((resolve) => setTimeout(resolve, 750));

  // If the page matches the reference article or demo domain, use the sample fixture
  const isSampleArticle =
    url.includes('example.com/ai-agents') ||
    title.toLowerCase().includes('future of ai agents') ||
    url.includes('localhost') ||
    !url;

  if (isSampleArticle) {
    return {
      ...SAMPLE_AI_AGENTS_SUMMARY,
      // Retain the actual user URL if one was provided
      sourceUrl: url || SAMPLE_AI_AGENTS_SUMMARY.sourceUrl,
      title: title || SAMPLE_AI_AGENTS_SUMMARY.title,
    };
  }

  // Fallback summary for any other real webpage
  return createFallbackSummary(title, url, text);
}

/**
 * Returns a deterministic follow-up response for a user question about the summary.
 *
 * @param {string} userQuestion
 * @param {Object} summaryContext
 * @returns {Promise<{ content: string, timestamp: number }>}
 */
export async function getSummaryFollowUpResponse(userQuestion = '', summaryContext = null) {
  // Brief delay for natural conversational feel
  await new Promise((resolve) => setTimeout(resolve, 250));

  const lower = userQuestion.toLowerCase();

  let answerText = SAMPLE_FOLLOWUP_ANSWERS.default;

  if (lower.includes('simple') || lower.includes('explain') || lower.includes('easy')) {
    answerText = SAMPLE_FOLLOWUP_ANSWERS.simpleTerms;
  } else if (lower.includes('tool') || lower.includes('api') || lower.includes('code')) {
    answerText = SAMPLE_FOLLOWUP_ANSWERS.tools;
  } else if (lower.includes('everyday') || lower.includes('time') || lower.includes('example')) {
    answerText = SAMPLE_FOLLOWUP_ANSWERS.everyday;
  }

  return {
    content: answerText,
    timestamp: Date.now(),
  };
}

