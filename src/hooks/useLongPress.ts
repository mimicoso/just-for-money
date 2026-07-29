import { useRef, useCallback } from 'react';

export function useLongPress(onLongPress: () => void, delay = 500) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);

  const start = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if ('touches' in e) {
        // Prevent default context menu on mobile
      }
      isLongPress.current = false;
      timerRef.current = setTimeout(() => {
        isLongPress.current = true;
        onLongPress();
      }, delay);
    },
    [onLongPress, delay]
  );

  const end = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const preventContextMenu = useCallback((e: React.MouseEvent) => {
    if (isLongPress.current) {
      e.preventDefault();
    }
  }, []);

  return {
    onTouchStart: start,
    onTouchEnd: end,
    onTouchMove: end,
    onMouseDown: start,
    onMouseUp: end,
    onMouseLeave: end,
    onContextMenu: preventContextMenu,
  };
}
