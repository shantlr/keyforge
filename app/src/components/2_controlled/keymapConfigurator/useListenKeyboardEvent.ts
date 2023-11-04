import { forEach } from 'lodash';
import { useEffect, useRef } from 'react';

import { KeyEnum } from '@/constants';

const ControlKeys: Record<
  string,
  {
    key: 'ctrl' | 'alt' | 'gui' | 'shift';
    skip:
      | 'shouldSkipCtrlRelease'
      | 'shouldSkipShiftRelease'
      | 'shouldSkipAltRelease'
      | 'shouldSkipGuiRelease';
  }
> = {
  Control: {
    key: 'ctrl',
    skip: 'shouldSkipCtrlRelease',
  },
  Shift: {
    key: 'shift',
    skip: 'shouldSkipShiftRelease',
  },
  Alt: {
    key: 'alt',
    skip: 'shouldSkipAltRelease',
  },
  Meta: {
    key: 'gui',
    skip: 'shouldSkipGuiRelease',
  },
};

const toKeycode = (
  e: KeyboardEvent,
  state: { shift?: boolean }
): KeyEnum | null => {
  switch (e.key) {
    case 'a':
    case 'A':
      return 'KC_A';
    case 'b':
    case 'B':
      return 'KC_B';
    case 'c':
    case 'C':
      return 'KC_C';
    case 'd':
    case 'D':
      return 'KC_D';
    case 'e':
    case 'E':
      return 'KC_E';
    case 'f':
    case 'F':
      return 'KC_F';
    case 'g':
    case 'G':
      return 'KC_G';
    case 'h':
    case 'H':
      return 'KC_H';
    case 'i':
    case 'I':
      return 'KC_I';
    case 'j':
    case 'J':
      return 'KC_J';
    case 'k':
    case 'K':
      return 'KC_K';
    case 'l':
    case 'L':
      return 'KC_L';
    case 'm':
    case 'M':
      return 'KC_M';
    case 'n':
    case 'N':
      return 'KC_N';
    case 'o':
    case 'O':
      return 'KC_O';
    case 'p':
    case 'P':
      return 'KC_P';
    case 'q':
    case 'Q':
      return 'KC_Q';
    case 'r':
    case 'R':
      return 'KC_R';
    case 's':
    case 'S':
      return 'KC_S';
    case 't':
    case 'T':
      return 'KC_T';
    case 'u':
    case 'U':
      return 'KC_U';
    case 'v':
    case 'V':
      return 'KC_V';
    case 'w':
    case 'W':
      return 'KC_W';
    case 'x':
    case 'X':
      return 'KC_X';
    case 'y':
    case 'Y':
      return 'KC_Y';
    case 'z':
    case 'Z':
      return 'KC_Z';
    case 'Escape':
      return 'KC_ESC';
    case 'Enter':
      return 'KC_ENT';
    case 'Backspace':
      return 'KC_BSPC';
    case 'Space':
      return 'KC_SPC';
    case 'Tab':
      return 'KC_TAB';
    case 'CapsLock':
      return 'KC_CAPS';
    case 'Shift': {
      if (e.code === 'ShiftLeft') {
        return 'KC_LSFT';
      }
      return 'KC_RSFT';
    }
    case 'Alt': {
      if (e.code === 'AltLeft') {
        return 'KC_LALT';
      }
      return 'KC_RALT';
    }
    case 'Control': {
      if (e.code === 'ControlLeft') {
        return 'KC_LCTL';
      }
      return 'KC_RCTL';
    }
    case 'Meta': {
      if (e.code === 'MetaLeft') {
        return 'KC_LGUI';
      }
      return 'KC_RGUI';
    }
    case 'ArrowUp':
      return 'KC_UP';
    case 'ArrowDown':
      return 'KC_DOWN';
    case 'ArrowLeft':
      return 'KC_LEFT';
    case 'ArrowRight':
      return 'KC_RGHT';
    case '_':
      return 'KC_UNDS';
    case ',':
      return 'KC_COMM';
    case ';':
    case ':':
      return 'KC_SCLN';
    case '=':
      return 'KC_EQL';
    default:
  }

  switch (e.code) {
    case 'Digit1': {
      if (state.shift) {
        return 'KC_EXLM';
      }
      return 'KC_1';
    }
    case 'Digit2': {
      if (state.shift) {
        return 'KC_AT';
      }
      return 'KC_2';
    }
    case 'Digit3': {
      if (state.shift) {
        return 'KC_HASH';
      }
      return 'KC_3';
    }
    case 'Digit4': {
      if (state.shift) {
        return 'KC_DLR';
      }
      return 'KC_4';
    }
    case 'Digit5': {
      if (state.shift) {
        return 'KC_PERC';
      }
      return 'KC_5';
    }
    case 'Digit6': {
      if (state.shift) {
        return 'KC_CIRC';
      }
      return 'KC_6';
    }
    case 'Digit7': {
      if (state.shift) {
        return 'KC_AMPR';
      }
      return 'KC_7';
    }
    case 'Digit8': {
      if (state.shift) {
        return 'KC_ASTR';
      }
      return 'KC_8';
    }
    case 'Digit9': {
      if (state.shift) {
        return 'KC_LPRN';
      }
      return 'KC_9';
    }
    case 'Digit0': {
      if (state.shift) {
        return 'KC_RPRN';
      }
      return 'KC_0';
    }
    case 'Backquote':
      return 'KC_GRV';
    case 'Backslash':
      return 'KC_BSLS';
    case 'Quote':
      return 'KC_QUOT';
    case 'BracketLeft':
      return 'KC_LBRC';
    case 'BracketRight':
      return 'KC_RBRC';
    case 'Equal':
      return 'KC_EQL';
    case 'Minus':
      return 'KC_MINS';
  }

  return null;
};

export const useListenKeyboardEvent = (
  cb: (kc: string) => void,
  enabled = true
) => {
  const ref = useRef<typeof cb>();
  ref.current = cb;

  const stateRef = useRef<{
    shift?: boolean;
    shouldSkipShiftRelease?: boolean;

    ctrl?: boolean;
    shouldSkipCtrlRelease?: boolean;

    gui?: boolean;
    shouldSkipGuiRelease?: boolean;

    alt?: boolean;
    shouldSkipAltRelease?: boolean;
  }>({});

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const downListener = (e: KeyboardEvent) => {
      if (e.key in ControlKeys) {
        stateRef.current[ControlKeys[e.key].key] = true;
      }
    };

    const listener = (e: KeyboardEvent) => {
      try {
        if (e.key in ControlKeys && stateRef.current[ControlKeys[e.key].skip]) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        const kc = toKeycode(e, stateRef.current);
        forEach(ControlKeys, ({ key, skip }, eKey) => {
          if (stateRef.current[key] && e.key !== eKey) {
            stateRef.current[skip] = true;
          }
        });

        if (kc) {
          e.preventDefault();
          e.stopPropagation();
          ref.current?.(kc);
        } else {
          console.log(e);
        }
      } finally {
        if (e.key in ControlKeys) {
          const k = ControlKeys[e.key];
          stateRef.current[k.skip] = false;
          stateRef.current[k.key] = false;
        }
      }
    };

    window.addEventListener('keyup', listener);
    window.addEventListener('keydown', downListener);
    return () => {
      window.removeEventListener('keyup', listener);
      window.removeEventListener('keydown', downListener);
    };
  }, [enabled]);
};
