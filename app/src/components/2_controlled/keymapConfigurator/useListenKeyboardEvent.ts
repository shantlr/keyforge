import { Keymap } from '@/components/providers/redux';
import { ReduxDispatch } from '@/components/providers/redux/store';
import { useEffect, useRef } from 'react';

// export const useUpdateKeyUsingKeyboard = ({
//   keymap,
//   dispatch,
//   keyIdx,
//   layerIdx
// }: {
//   keymap: Keymap | null;
//   dispatch: ReduxDispatch;
//   layerIdx: number | null;
//   keyIdx: number | null;
// }) => {

//   useEffect(() => {
//   }, []);
// };

const toKeycode = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'a':
      return 'KC_A';
    case 'b':
      return 'KC_B';
    case 'c':
      return 'KC_C';
    case 'd':
      return 'KC_D';
    case 'e':
      return 'KC_E';
    case 'f':
      return 'KC_F';
    case 'g':
      return 'KC_G';
    case 'h':
      return 'KC_H';
    case 'i':
      return 'KC_I';
    case 'j':
      return 'KC_J';
    case 'k':
      return 'KC_K';
    case 'l':
      return 'KC_L';
    case 'm':
      return 'KC_M';
    case 'n':
      return 'KC_N';
    case 'o':
      return 'KC_O';
    case 'p':
      return 'KC_P';
    case 'q':
      return 'KC_Q';
    case 'r':
      return 'KC_R';
    case 's':
      return 'KC_S';
    case 't':
      return 'KC_T';
    case 'u':
      return 'KC_U';
    case 'v':
      return 'KC_V';
    case 'w':
      return 'KC_W';
    case 'x':
      return 'KC_X';
    case 'y':
      return 'KC_Y';
    case 'z':
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
    case 'Digit1':
      return 'KC_1';
    case 'Digit2':
      return 'KC_2';
    case 'Digit3':
      return 'KC_3';
    case 'Digit4':
      return 'KC_4';
    case 'Digit5':
      return 'KC_5';
    case 'Digit6':
      return 'KC_6';
    case 'Digit7':
      return 'KC_7';
    case 'Digit8':
      return 'KC_8';
    case 'Digit9':
      return 'KC_9';
    case 'Digit0':
      return 'KC_0';
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
};

export const useListenKeyboardEvent = (
  cb: (kc: string) => void,
  enabled = true
) => {
  const ref = useRef<typeof cb>();
  ref.current = cb;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const listener = (e: KeyboardEvent) => {
      const kc = toKeycode(e);
      if (kc) {
        e.preventDefault();
        e.stopPropagation();
        ref.current?.(kc);
      } else {
        console.log(e);
      }
    };
    window.addEventListener('keyup', listener);
    return () => {
      window.removeEventListener('keyup', listener);
    };
  }, [enabled]);
};
