import { RefObject, useEffect } from 'react';

export const useClickOutside = (
  ref: RefObject<HTMLElement>,
  cb: () => void
) => {
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const listener = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as HTMLElement)) {
        cb();
      }
    };
    window.addEventListener('click', listener);
    return () => {
      window.removeEventListener('click', listener);
    };
  }, [ref, cb]);
};
