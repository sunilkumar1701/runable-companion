import { useState, useCallback } from 'react';

/**
 * Lightweight toast notification component.
 * Returns [ToastContainer, showToast] pair.
 */
export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }, []);

  return [toast, showToast];
}

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50
        px-4 py-2.5 rounded-xl text-sm font-medium
        shadow-lg animate-fade-in"
      style={{
        backgroundColor: 'var(--accent-brown)',
        color: '#fff',
        maxWidth: 'calc(100% - 32px)',
      }}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}

