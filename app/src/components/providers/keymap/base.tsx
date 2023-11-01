import { ReactNode, createContext, useContext, useState } from 'react';

export function createStateContext<T>(opt: { default: T }) {
  const ValueContext = createContext<T>(opt.default);
  const SetValueContext = createContext<((value: T) => void) | undefined>(
    undefined
  );

  return {
    useState: () => {
      return useState<T>(opt.default);
    },
    useValue: () => useContext(ValueContext) as T,
    useSetValue: () => useContext(SetValueContext) as (value: T) => void,
    Provider: (p: { value: [T, (value: T) => void]; children: ReactNode }) => {
      return (
        <ValueContext.Provider value={p.value[0]}>
          <SetValueContext.Provider value={p.value[1]}>
            {p.children}
          </SetValueContext.Provider>
        </ValueContext.Provider>
      );
    },
  };
}
