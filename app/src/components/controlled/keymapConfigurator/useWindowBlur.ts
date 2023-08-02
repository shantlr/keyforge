import { useEffect } from 'react';

export const useWindowBlur = (cb: () => void) => {
  useEffect(() => {
    const listener = () => {
      cb();
    };
    window.addEventListener('blur', listener);
    return () => {
      window.removeEventListener('blur', listener);
    };
  }, [cb]);
};
