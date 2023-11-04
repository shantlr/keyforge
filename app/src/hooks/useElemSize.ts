import { useEffect, useState } from 'react';

export const useElemSize = (elem: HTMLElement | undefined | null) => {
  const [size, setSize] = useState(() => ({
    width: elem?.clientWidth,
    height: elem?.clientHeight,
  }));

  useEffect(() => {
    if (!elem) {
      return;
    }
    const obs = new ResizeObserver(() => {
      setSize({
        width: elem?.clientWidth,
        height: elem?.clientHeight,
      });
    });
    obs.observe(elem);
    return () => {
      obs.disconnect();
    };
  }, [elem]);

  return size;
};
