'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { PropsWithChildren } from 'react';

export * from './slices/keymaps';

export { useDispatch, useSelector } from './store';

export const ReduxProvider = (props: PropsWithChildren) => {
  return <Provider store={store}>{props.children}</Provider>;
};
