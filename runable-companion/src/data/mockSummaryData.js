/**
 * Mock Summary Data (Phase 4)
 *
 * NOTE: All summary texts, key takeaways, and follow-up replies in this module
 * are local demo fixtures. No external AI model or backend service is contacted.
 */

export const SAMPLE_AI_AGENTS_SUMMARY = {
  title: 'The future of AI agents | Blog',
  sourceUrl: 'https://example.com/ai-agents',
  summary:
    'This article explains how AI agents are changing the way we work by taking complex, multi-step tasks and turning them into completed results. It highlights that agents can research information, build websites, generate reports, use tools and APIs, write code, and produce structured outputs like slides and documents. The article also emphasizes that AI agents combine large language models with tools, memory and execution environments, enabling them to work autonomously across real-world applications.',
  keyTakeaways: [
    'AI agents can handle complex, multi-step tasks autonomously.',
    'They can research, build, analyze and create content using tools, APIs and code.',
    'Agents combine language models with tools, memory and execution environments.',
    'They can produce structured outputs like slides, documents and reports.',
  ],
  isDemo: true,
};

export const SAMPLE_FOLLOWUP_ANSWERS = {
  default:
    'The main idea is that an AI agent can do more than answer a question. It can understand a goal, decide what steps are needed, use tools to complete those steps, and provide a finished result. For example, instead of only suggesting how to prepare a report, an agent could research the topic, organize the information, and create a draft report. This is a sample response for demo purposes.',
  simpleTerms:
    'In simple terms, AI agents take a high-level goal from you, break it into concrete actionable steps, use web tools or APIs to execute each step, and hand you back completed work instead of just advice. This is a sample response for demo purposes.',
  tools:
    'Agents interact with tools such as web browsers, code interpreters, document editors, and APIs. By using these tools iteratively, they can verify results, correct errors, and produce ready-to-use artifacts like reports or slides. This is a sample response for demo purposes.',
  everyday:
    'In everyday use, this could save hours when researching a new topic, aggregating news across sources, or drafting project documentation. The agent does the repetitive heavy lifting so you can focus on decision-making. This is a sample response for demo purposes.',
};

/**
 * Creates a deterministic fallback summary for any other webpage URL/title.
 */
export function createFallbackSummary(title, url, textExcerpt = '') {
  const displayTitle = title || 'Active Webpage';
  const cleanUrl = url || 'https://example.com';

  return {
    title: displayTitle,
    sourceUrl: cleanUrl,
    summary: textExcerpt
      ? `This summary highlights the core themes of "${displayTitle}". Based on the page content, it covers key developments, arguments, and notable points discussed across the article for fast review.`
      : `This summary provides an overview of "${displayTitle}". It captures the main discussion points, relevant context, and key concepts presented on the active page for quick reference and follow-up inquiry.`,
    keyTakeaways: [
      `Key insights and core points summarized from ${displayTitle}.`,
      'Structured overview designed for fast scanning and review.',
      'Contextual takeaways ready for follow-up questions in Runable Companion.',
      'Offline local summary generated for demonstration purposes.',
    ],
    isDemo: true,
    isFallback: true,
  };
}

