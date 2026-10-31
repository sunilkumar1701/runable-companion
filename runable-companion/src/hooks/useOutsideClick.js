import { useEffect, useRef } from 'react';

/**
 * Hook that fires a callback when a click/touch happens outside the ref element.
 * Also closes on Escape key.
 */
export function useOutsideClick(callback, active = true) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return;

    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClick, true);
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('mousedown', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [callback, active]);

  return ref;
}

