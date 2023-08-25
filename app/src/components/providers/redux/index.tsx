'use client';

import { Provider } from 'react-redux';
import { persistor, store } from './store';
import { PropsWithChildren } from 'react';
import { PersistGate } from 'redux-persist/integration/react';

export * from './slices/keymaps';

export { useDispatch, useSelector } from './store';

export const ReduxProvider = ({ children }: PropsWithChildren) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
