import { parse } from 'ansicolor';
import { useMemo, useState } from 'react';

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

  if (!l) {
    return null;
  }

  return (
    <div className="w-full max-h-[400px] overflow-auto text-xs">
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
