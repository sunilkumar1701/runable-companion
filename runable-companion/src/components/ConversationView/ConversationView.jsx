import { useEffect, useRef } from 'react';
import './ConversationView.css';

/**
 * Renders the active conversation messages.
 * Only displays messages when the user has submitted a question.
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

          return (
            <div
              key={msg.id}
              className={`conversation-row ${
                isUser ? 'conversation-row--user' : 'conversation-row--assistant'
              }`}
            >
              {/* Avatar */}
              <div
                className={`conversation-avatar ${
                  isUser ? 'conversation-avatar--user' : 'conversation-avatar--assistant'
                }`}
                aria-hidden="true"
              >
                {isUser ? 'S' : 'R'}
              </div>

              {/* Message Content */}
              <div
                className={`conversation-bubble ${
                  isUser ? 'conversation-bubble--user' : 'conversation-bubble--assistant'
                }`}
              >
                <div className="conversation-text">{msg.content}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

