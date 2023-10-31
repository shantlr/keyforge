import { parse } from 'ansicolor';
import { UIEvent, useEffect, useMemo, useRef, useState } from 'react';

const Line = ({ text }: { text: string }) => {
  const parsed = useMemo(() => parse(text), [text]);

  return (
    <div className="w-full whitespace-pre break-words border-l border-default hover:border-primary hover:text-primary pl-2">
      {parsed.spans.map((p, idx) => (
        <span
          key={idx}
          style={{
            color: p.color?.name,
            fontWeight: p.bold ? 'bold' : 'inherit',
          }}
        >
          {p.text}
        </span>
      ))}
    </div>
  );
};

export const Logs = ({ logs }: { logs?: string[] }) => {
  const [show, setShow] = useState(true);
  const l = useMemo(() => {
    if (!logs) {
      return null;
    }
    return logs.join('').split('\n');
  }, [logs]);

  const ref = useRef<HTMLDivElement>(null);
  const prevScrollRef = useRef<number | undefined>(undefined);
  const [shouldAutoscroll, setShouldAutoscroll] = useState(true);

  // init prev scroll
  useEffect(() => {
    if (prevScrollRef.current === undefined) {
      prevScrollRef.current = ref.current?.scrollTop;
    }
  }, []);

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const container = e.target as HTMLDivElement;
    const isAtBottom =
      container.scrollHeight - container.scrollTop === container.clientHeight;
    if (isAtBottom) {
      // allow autoscroll when bottom
      setShouldAutoscroll(true);
    } else if (
      typeof prevScrollRef.current === 'number' &&
      container.scrollTop < prevScrollRef.current
    ) {
      // deactivate auto scroll on scroll up
      setShouldAutoscroll(false);
    }
    prevScrollRef.current = container.scrollTop;
  };

  // autoscroll down on new logs
  useEffect(() => {
    if (shouldAutoscroll) {
      ref.current?.scroll({
        top: ref.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [logs, shouldAutoscroll]);

  if (!l) {
    return null;
  }

  return (
    <div
      ref={ref}
      className="w-full max-h-[400px] overflow-auto text-xs"
      onScroll={onScroll}
    >
      <span
        className="cursor-pointer text-default-darker hover:text-primary select-none"
        onClick={() => {
          setShow(!show);
        }}
      >
        {show ? '[hide logs]' : '[show logs]'}
      </span>
      {show && l.map((line, idx) => <Line key={idx} text={line} />)}
    </div>
  );
};
