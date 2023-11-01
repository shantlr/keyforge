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

type KeyContext = {
  keyDown: string | null;
};

type ListenKeyFn = (arg: { key: KeymapKeyDef }) => void;

const KeyDownContext = createContext<number | undefined>(undefined);
const SetKeyDownContext = createContext<(keyIndex?: number) => void>(() => {});
const RegisterListenContext = createContext<
  ((cb: ListenKeyFn) => () => void) | null
>(null);
const RegisterKeyContext = createContext<((key: KeymapKeyDef) => void) | null>(
  null
);

export const KeyContext = ({ children }: { children: ReactNode }) => {
  const [keyDown, setKeyDown] = useState<number | undefined>();

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
    <SetKeyDownContext.Provider value={setKeyDown}>
      <KeyDownContext.Provider value={keyDown}>
        <RegisterListenContext.Provider value={registerListen}>
          <RegisterKeyContext.Provider value={registerKey}>
            {children}
          </RegisterKeyContext.Provider>
        </RegisterListenContext.Provider>
      </KeyDownContext.Provider>
    </SetKeyDownContext.Provider>
  );
};

export const useRegisterKeyDown = () => {
  return useContext(SetKeyDownContext);
};

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
export const useKeyDown = () => {
  return useContext(KeyDownContext);
};
