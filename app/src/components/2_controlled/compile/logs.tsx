import { useMemo } from 'react';

export const Logs = ({ logs }: { logs?: string[] }) => {
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
    <div className="w-full max-h-[500px] overflow-auto text-xs">
      {l.map((line, idx) => (
        <div
          key={idx}
          className="w-full whitespace-pre break-words border-l border-default hover:border-primary hover:text-primary pl-2"
        >
          {line}
        </div>
      ))}
    </div>
  );
};
