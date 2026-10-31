import { useEffect, useRef } from 'react';
import './ConversationView.css';

/**
 * Formats multi-paragraph assistant text with support for lists and bold headers.
 */
function FormattedAssistantText({ content }) {
  if (!content) return null;

  const blocks = content.split('\n\n');

  return (
    <div className="assistant-content-blocks">
      {blocks.map((block, bIdx) => {
        const lines = block.split('\n');

        // Check if block is an ordered list (e.g. "1. Research: ...")
        const isOrderedList = lines.length > 1 && lines.every((l) => /^\d+\.\s/.test(l.trim()));
        if (isOrderedList) {
          return (
            <ol key={bIdx} className="assistant-ordered-list">
              {lines.map((line, lIdx) => {
                const textWithoutNumber = line.replace(/^\d+\.\s*/, '');
                return <li key={lIdx}>{formatInlineText(textWithoutNumber)}</li>;
              })}
            </ol>
          );
        }

        // Check if block has a heading followed by list items
        if (lines.length > 1 && lines[0].endsWith(':')) {
          const heading = lines[0];
          const remainingLines = lines.slice(1);
          return (
            <div key={bIdx} className="assistant-section-block">
              <strong className="assistant-section-heading">{heading}</strong>
              <div className="assistant-section-items">
                {remainingLines.map((line, lIdx) => (
                  <div key={lIdx} className="assistant-section-item">
                    {formatInlineText(line)}
                  </div>
                ))}
              </div>
            </div>
          );
        }

        return (
          <p key={bIdx} className="assistant-paragraph">
            {formatInlineText(block)}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Parses bold markdown fragments like "**text**" into bold spans safely.
 */
function formatInlineText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

/**
 * Renders the conversation stream:
 * - User messages on the right (justify-end)
 * - Assistant responses on the left (justify-start)
 */
export default function ConversationView({ messages }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!messages || messages.length === 0) {
    return null;
  }

  return (
    <div className="conversation-view" ref={scrollRef} role="log" aria-live="polite">
      <div className="conversation-list">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          if (isUser) {
            return (
              <div key={msg.id} className="conversation-row conversation-row--user">
                <div className="conversation-bubble conversation-bubble--user">
                  <div className="conversation-text">{msg.content}</div>
                </div>
                <div className="conversation-avatar conversation-avatar--user" aria-hidden="true">
                  S
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className="conversation-row conversation-row--assistant">
              <div className="conversation-avatar conversation-avatar--assistant" aria-hidden="true">
                R
              </div>
              <div className="conversation-bubble conversation-bubble--assistant">
                <FormattedAssistantText content={msg.content} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
