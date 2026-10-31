/**
 * Mock Runable Service
 *
 * Provides local deterministic replies for Ask with Runable demo.
 * Does not make any network requests or contact any AI models.
 */

import { ENRICHED_DUMMY_RESPONSE } from '../data/mockResponses';

/**
 * Returns a deterministic dummy assistant reply for the submitted query.
 *
 * @param {string} userQuery - The message submitted by the user.
 * @param {Object|null} [context] - Active webpage context if present.
 * @returns {Promise<{ content: string, timestamp: number }>}
 */
export async function getAssistantResponse(userQuery, context = null) {
  // Simulate minimal UI delay for natural feel
  await new Promise((resolve) => setTimeout(resolve, 200));

  return {
    content: ENRICHED_DUMMY_RESPONSE,
    timestamp: Date.now(),
  };
}
