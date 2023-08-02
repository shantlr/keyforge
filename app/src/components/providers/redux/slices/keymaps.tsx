import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import type { Draft } from 'immer';

export type Keymap = {
  id: string;
  name: string;
  keyboard: string;
  layout: string;
  layers: {
    name: string;
    keys: string[];
  }[];

  temp?: boolean;
};

type State = {
  keymaps: Record<string, Keymap>;
  keyboards: Record<
    string,
    {
      keymaps: string[];
    }
  >;
  currentTempKeymap: string | null;
};

const removeKeymap = (state: Draft<State>, keymapId: string) => {
  if (!(keymapId in state.keymaps)) {
    return null;
  }

  const keymap = state.keymaps[keymapId];
  delete state.keymaps[keymapId];

  if (state.currentTempKeymap === keymapId) {
    state.currentTempKeymap = null;
  }

  // remove keymap from keyboard
  if (keymap.keyboard in state.keyboards) {
    state.keyboards[keymap.keyboard].keymaps = state.keyboards[
      keymap.keyboard
    ].keymaps.filter((k) => k !== keymap.id);
    // remove keyboard if empty
    if (!state.keyboards[keymap.keyboard].keymaps.length) {
      delete state.keyboards[keymap.keyboard];
    }
  }
  return keymap;
};

export const keymapSlice = createSlice({
  name: 'keymaps',
  initialState: {
    keymaps: {},
    keyboards: {},
    currentTempKeymap: null,
  } as State,
  reducers: {
    addKeymap: {
      reducer: (
        state,
        {
          payload: { replaceTemp, ...keymap },
        }: PayloadAction<Keymap & { replaceTemp?: boolean }>
      ) => {
        if (state.currentTempKeymap) {
          if (replaceTemp) {
            // delete previous temp
            removeKeymap(state, state.currentTempKeymap);
            state.currentTempKeymap = null;
          } else {
            // if no replace temp => prev temp is no longer temporary
            delete state.keymaps[state.currentTempKeymap].temp;
            state.currentTempKeymap = null;
          }
        }

        if (!(keymap.keyboard in state.keyboards)) {
          state.keyboards[keymap.keyboard] = {
            keymaps: [],
          };
        }
        state.keymaps[keymap.id] = keymap;
        state.keyboards[keymap.keyboard].keymaps.push(keymap.id);
        if (keymap.temp) {
          state.currentTempKeymap = keymap.id;
        }
      },
      prepare: (keymap: Omit<Keymap, 'id'> & { replaceTemp?: boolean }) => {
        return {
          payload: {
            id: nanoid(),
            ...keymap,
          },
        };
      },
    },
    removeKeymap: (
      state,
      { payload: { id } }: PayloadAction<{ id: string }>
    ) => {
      removeKeymap(state, id);
    },

    updateKeymapName: (
      state,
      { payload: { id, name } }: PayloadAction<{ id: string; name: string }>
    ) => {
      const keymap = state.keymaps[id];
      if (keymap) {
        keymap.name = name;
        if (keymap.temp) {
          delete keymap.temp;
          state.currentTempKeymap = null;
        }
      }
    },
    addKeymapLayer: (
      state,
      {
        payload: { id, name, keys },
      }: PayloadAction<{ id: string; name: string; keys: string[] }>
    ) => {
      const keymap = state.keymaps[id];
      if (keymap) {
        keymap.layers.push({
          name,
          keys,
        });

        if (keymap.temp) {
          delete keymap.temp;
          state.currentTempKeymap = null;
        }
      }
    },
    updateKeymapLayerName: (
      state,
      {
        payload: { id, layerIdx, name },
      }: PayloadAction<{ id: string; layerIdx: number; name: string }>
    ) => {
      const layer = state.keymaps[id]?.layers[layerIdx];
      if (layer) {
        layer.name = name;
        if (state.keymaps[id].temp) {
          delete state.keymaps[id].temp;
          state.currentTempKeymap = null;
        }
      }
    },
    updateKeymapLayerKey: (
      state,
      {
        payload: { id, layerIdx, key, keyIdx },
      }: PayloadAction<{
        id: string;
        layerIdx: number;
        keyIdx: number;
        key: string;
      }>
    ) => {
      const layer = state.keymaps[id]?.layers[layerIdx];
      if (layer) {
        if (keyIdx >= 0 && keyIdx < layer.keys.length) {
          layer.keys[keyIdx] = key;
          if (state.keymaps[id].temp) {
            delete state.keymaps[id].temp;
            state.currentTempKeymap = null;
          }
        }
      }
    },
  },
});
