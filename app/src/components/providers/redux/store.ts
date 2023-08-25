'use client';

import {
  configureStore,
  type ThunkAction,
  type Action,
  combineReducers,
} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import {
  useSelector as useReduxSelector,
  useDispatch as useReduxDispatch,
  type TypedUseSelectorHook,
} from 'react-redux';
import { keymapSlice } from './slices/keymaps';
import { viewSlice } from './slices/view';
import {
  persistReducer,
  persistStore,
  PERSIST,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PURGE,
  REGISTER,
} from 'redux-persist';

const persistConfig = {
  key: 'keyforge',
  storage,
};

const rootReducer = combineReducers({
  keymaps: keymapSlice.reducer,
  view: viewSlice.reducer,
});

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [PERSIST, FLUSH, REHYDRATE, PAUSE, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type ReduxState = ReturnType<typeof rootReducer>;
export type ReduxStore = typeof store;
export type ReduxDispatch = typeof store.dispatch;

export const useDispatch = () => useReduxDispatch<ReduxDispatch>();
export const useSelector: TypedUseSelectorHook<ReduxState> = useReduxSelector;

export type ReduxThunkAction<ReturnType = void> = ThunkAction<
  ReturnType,
  ReduxState,
  unknown,
  Action
>;
