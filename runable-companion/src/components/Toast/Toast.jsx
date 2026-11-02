import { useCallback } from 'react';

/**
 * Toast has been disabled across the project as requested.
 * Returns a no-op pair so any component receiving showToast does not crash.
 */
export function useToast() {
  const showToast = useCallback(() => {}, []);
  return [null, showToast];
}

export default function Toast() {
  return null;
}
