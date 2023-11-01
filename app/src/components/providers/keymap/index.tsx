import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { KeymapKeyDef } from '@/types';

import { createStateContext } from './base';

type KeyContext = {
  keyDown: string | null;
};

type ListenKeyFn = (arg: { key: KeymapKeyDef }) => void;

// const KeyDownContext = createContext<number | undefined>(undefined);
// const SetKeyDownContext = createContext<(keyIndex?: number) => void>(() => {});
const RegisterListenContext = createContext<
  ((cb: ListenKeyFn) => () => void) | null
>(null);
const RegisterKeyContext = createContext<((key: KeymapKeyDef) => void) | null>(
  null
);

const KeyDownIndex = createStateContext<number | undefined>({
  default: undefined,
});
const HighlightedLayer = createStateContext<string | undefined>({
  default: undefined,
});

export const KeyContext = ({ children }: { children: ReactNode }) => {
  const keyDown = KeyDownIndex.useState();
  const higlightedLayer = HighlightedLayer.useState();

  const listeners = useRef<ListenKeyFn[]>([]);

  const registerListen = useCallback((cb: ListenKeyFn) => {
    listeners.current.push(cb);
    return () => {
      const idx = listeners.current.indexOf(cb);
      if (idx !== -1) {
        listeners.current.splice(idx, 1);
      }
    };
  }, []);

  const registerKey = useCallback((key: KeymapKeyDef) => {
    const event = { key };
    for (let i = listeners.current.length - 1; i >= 0; i--) {
      const listener = listeners.current[i];
      listener?.(event);
    }
  }, []);

  return (
    <HighlightedLayer.Provider value={higlightedLayer}>
      <KeyDownIndex.Provider value={keyDown}>
        <RegisterListenContext.Provider value={registerListen}>
          <RegisterKeyContext.Provider value={registerKey}>
            {children}
          </RegisterKeyContext.Provider>
        </RegisterListenContext.Provider>
      </KeyDownIndex.Provider>
    </HighlightedLayer.Provider>
  );
};

export const useRegisterKeyDown = () => {
  return KeyDownIndex.useSetValue();
};
export const useKeyDown = () => {
  return KeyDownIndex.useValue();
};

export const useRegisterHighlightedLayer = HighlightedLayer.useSetValue;
export const useHighlightedLayer = HighlightedLayer.useValue;

export const useRegisterKey = () => {
  return useContext(RegisterKeyContext);
};

export const useListenKey = (cb: ListenKeyFn) => {
  const ref = useRef<typeof cb>();
  ref.current = cb;

  const register = useContext(RegisterListenContext);
  useEffect(() => {
    return register?.((e) => {
      ref.current?.(e);
    });
  }, [register]);
};
