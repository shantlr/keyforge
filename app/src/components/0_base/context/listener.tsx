import {
  PropsWithChildren,
  RefObject,
  createContext,
  useCallback,
  useContext,
  useRef,
} from 'react';

export function createListenerContext<Data>() {
  type Event = {
    data: Data;
    propagationStopped: boolean;
    stopPropagation: () => void;
  };
  type Listener = (event: Event) => void;
  type UnsubscribeFn = () => void;

  const ListenersContext = createContext<RefObject<Listener[]> | null>(null);
  const RegisterContext = createContext<
    ((listener: Listener) => UnsubscribeFn) | null
  >(null);

  return {
    Provider: (props: PropsWithChildren) => {
      const listenersRef = useRef<Listener[]>([]);

      const registerListener = useCallback((cb: Listener) => {
        listenersRef.current.push(cb);
        const unsubscribe = () => {
          const idx = listenersRef.current.indexOf(cb);
          if (idx !== -1) {
            listenersRef.current.splice(idx, 1);
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
      const listeners = useContext(ListenersContext);
      return useCallback(
        (data: Data) => {
          if (!listeners?.current) {
            return;
          }

          const event: Event = {
            data,
            propagationStopped: false,
            stopPropagation: () => {
              event.propagationStopped = true;
            },
          };
          for (let i = listeners.current.length - 1; i >= 0; i -= 1) {
            const listener = listeners.current[i];
            listener(event);
            if (event.propagationStopped) {
              break;
            }
          }
        },
        [listeners]
      );
    },
    useRegisterListener: () => useContext(RegisterContext),
  };
}
