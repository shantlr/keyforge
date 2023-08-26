import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ReactNode, useMemo, useReducer, useState } from 'react';

export const useSteps = <
  T extends Record<
    string,
    {
      elem: ReactNode;
    }
  >
>(
  initialState: T,
  order: (keyof T)[]
) => {
  const [slice] = useState(() =>
    createSlice({
      name: 'stepsReducer',
      initialState: {
        steps: initialState,
        stepOrder: order,
      },
      reducers: {
        updateStep: (state, action: PayloadAction<{}>) => {},
      },
    })
  );

  const [state, dispatch] = useReducer(slice.reducer, slice.getInitialState());

  return [state, useMemo(() => ({}), [])] as const;
};
