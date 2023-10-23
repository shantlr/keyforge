import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { keymapSlice } from './keymaps';

export const viewSlice = createSlice({
  name: 'view',
  initialState: {
    selectedKeymap: {} as Record<
      string,
      {
        lastSelectedKeymap?: string | null;
      }
    >,
  },
  reducers: {
    selectKeymap(
      state,
      {
        payload: { keyboard, keymapId },
      }: PayloadAction<{ keyboard: string; keymapId: string }>
    ) {
      if (!(keyboard in state.selectedKeymap)) {
        state.selectedKeymap[keyboard] = { lastSelectedKeymap: null };
      }
      state.selectedKeymap[keyboard].lastSelectedKeymap = keymapId;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(
        keymapSlice.actions.addKeymap,
        (state, { payload: { keyboard, id } }) => {
          if (!(keyboard in state.selectedKeymap)) {
            state.selectedKeymap[keyboard] = { lastSelectedKeymap: null };
          }
          state.selectedKeymap[keyboard].lastSelectedKeymap = id;
        }
      )
      .addCase(
        keymapSlice.actions.removeKeymap,
        (state, { payload: { keyboard, id } }) => {
          if (state.selectedKeymap[keyboard]?.lastSelectedKeymap === id) {
            delete state.selectedKeymap[keyboard].lastSelectedKeymap;
          }
        }
      );
  },
});
