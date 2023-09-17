import {
  PropsWithChildren,
  RefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';

export function createListenerMapContext<Data>() {
  type Event = {
    data: Data;
    propagationStopped: boolean;
    stopPropagation: () => void;
  };
  type Listener = (event: Event) => void;
  type UnsubscribeFn = () => void;

  const ListenersContext = createContext<RefObject<
    Record<string, Listener[]>
  > | null>(null);
  const RegisterContext = createContext<
    ((type: string, listener: Listener) => UnsubscribeFn) | null
  >(null);

  return {
    Provider: (props: PropsWithChildren) => {
      const listenersRef = useRef<Record<string, Listener[]>>({});

      const registerListener = useCallback((type: string, cb: Listener) => {
        if (!(type in listenersRef.current)) {
          listenersRef.current[type] = [];
        }
        listenersRef.current[type].push(cb);
        const unsubscribe = () => {
          if (!(type in listenersRef.current)) {
            return;
          }

          const idx = listenersRef.current[type].indexOf(cb);
          if (idx !== -1) {
            listenersRef.current[type].splice(idx, 1);
          }
          if (listenersRef.current[type].length === 0) {
            delete listenersRef.current[type];
          }
        };
        return unsubscribe;
      }, []);

      return (
        <ListenersContext.Provider value={listenersRef}>
          <RegisterContext.Provider value={registerListener}>
            {props.children}
          </RegisterContext.Provider>
        </ListenersContext.Provider>
      );
    },
    useRegisterEvent: () => {
      const listenersRef = useContext(ListenersContext);
      return useCallback(
        (type: string, data: Data) => {
          const listeners = listenersRef?.current?.[type];
          if (!listeners) {
            return;
          }

          const event: Event = {
            data,
            propagationStopped: false,
            stopPropagation: () => {
              event.propagationStopped = true;
            },
          };
          for (let i = listeners.length - 1; i >= 0; i -= 1) {
            const listener = listeners[i];
            listener(event);
            if (event.propagationStopped) {
              break;
            }
          }
        },
        [listenersRef]
      );
    },
    useRegisterListener: (type: string | null, cb?: Listener) => {
      const register = useContext(RegisterContext);
      const ref = useRef<Listener>();
      ref.current = cb;
      useEffect(() => {
        if (!type || !register) {
          return;
        }
        return register(type, (e) => {
          ref.current?.(e);
        });
      }, [type, register]);
    },
  };
}
