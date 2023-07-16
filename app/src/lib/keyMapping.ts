import {
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
} from '@fortawesome/free-solid-svg-icons';
import { reduce } from 'lodash';

export const KEYS = {
  //#region Alphanum
  A: {
    keys: ['KC_A'],
    group: 'Alphanum',
  },
  B: {
    keys: ['KC_B'],
    group: 'Alphanum',
  },
  C: {
    keys: ['KC_C'],
    group: 'Alphanum',
  },
  D: {
    keys: ['KC_D'],
    group: 'Alphanum',
  },
  E: {
    keys: ['KC_E'],
    group: 'Alphanum',
  },
  F: {
    keys: ['KC_F'],
    group: 'Alphanum',
  },
  G: {
    keys: ['KC_G'],
    group: 'Alphanum',
  },
  H: {
    keys: ['KC_H'],
    group: 'Alphanum',
  },
  I: {
    keys: ['KC_I'],
    group: 'Alphanum',
  },
  J: {
    keys: ['KC_J'],
    group: 'Alphanum',
  },
  K: {
    keys: ['KC_K'],
    group: 'Alphanum',
  },
  L: {
    keys: ['KC_L'],
    group: 'Alphanum',
  },
  M: {
    keys: ['KC_M'],
    group: 'Alphanum',
  },
  N: {
    keys: ['KC_N'],
    group: 'Alphanum',
  },
  O: {
    keys: ['KC_O'],
    group: 'Alphanum',
  },
  P: {
    keys: ['KC_P'],
    group: 'Alphanum',
  },
  Q: {
    keys: ['KC_Q'],
    group: 'Alphanum',
  },
  R: {
    keys: ['KC_R'],
    group: 'Alphanum',
  },
  S: {
    keys: ['KC_S'],
    group: 'Alphanum',
  },
  T: {
    keys: ['KC_T'],
    group: 'Alphanum',
  },
  U: {
    keys: ['KC_U'],
    group: 'Alphanum',
  },
  V: {
    keys: ['KC_V'],
    group: 'Alphanum',
  },
  W: {
    keys: ['KC_W'],
    group: 'Alphanum',
  },
  X: {
    keys: ['KC_X'],
    group: 'Alphanum',
  },
  Y: {
    keys: ['KC_Y'],
    group: 'Alphanum',
  },
  Z: {
    keys: ['KC_Z'],
    group: 'Alphanum',
  },
  ')\n0': {
    keys: ['KC_0'],
    group: 'Alphanum',
  },
  '!\n1': {
    keys: ['KC_1'],
    group: 'Alphanum',
  },
  '@\n2': {
    keys: ['KC_2'],
    group: 'Alphanum',
  },
  '#\n3': {
    keys: ['KC_3'],
    group: 'Alphanum',
  },
  '$\n4': {
    keys: ['KC_4'],
    group: 'Alphanum',
  },
  '%\n5': {
    keys: ['KC_5'],
    group: 'Alphanum',
  },
  '^\n6': {
    keys: ['KC_6'],
    group: 'Alphanum',
  },
  '&\n7': {
    keys: ['KC_7'],
    group: 'Alphanum',
  },
  '*\n8': {
    keys: ['KC_8'],
    group: 'Alphanum',
  },
  '(\n9': {
    keys: ['KC_9'],
    group: 'Alphanum',
  },
  0: {
    keys: ['KC_KP_0', 'KC_P0'],
  },
  1: {
    keys: ['KC_KP_1', 'KC_P1'],
  },
  2: {
    keys: ['KC_KP_2', 'KC_P2'],
  },
  3: {
    keys: ['KC_KP_3', 'KC_P3'],
  },
  4: {
    keys: ['KC_KP_4', 'KC_P4'],
  },
  5: {
    keys: ['KC_KP_5', 'KC_P5'],
  },
  6: {
    keys: ['KC_KP_6', 'KC_P6'],
  },
  7: {
    keys: ['KC_KP_7', 'KC_P7'],
  },
  8: {
    keys: ['KC_KP_8', 'KC_P8'],
  },
  9: {
    keys: ['KC_KP_9', 'KC_P9'],
  },
  '=': {
    keys: ['KC_PEQL', 'KC_KP_EQUAL'],
  },
  '+': {
    keys: ['KC_PPLS'],
  },
  '.': {
    keys: ['KC_PDOT'],
  },
  ',': {
    keys: ['KC_PCMM'],
  },
  '/': {
    keys: ['KC_PSLS'],
  },
  '*': {
    keys: ['KC_PAST'],
  },
  '-': {
    keys: ['KC_PMNS'],
  },
  // #endregion

  //#region Function keys
  F0: {
    keys: ['KC_F0'],
  },
  F1: {
    keys: ['KC_F1'],
  },
  F2: {
    keys: ['KC_F2'],
  },
  F3: {
    keys: ['KC_F3'],
  },
  F4: {
    keys: ['KC_F4'],
  },
  F5: {
    keys: ['KC_F5'],
  },
  F6: {
    keys: ['KC_F6'],
  },
  F7: {
    keys: ['KC_F7'],
  },
  F8: {
    keys: ['KC_F8'],
  },
  F9: {
    keys: ['KC_F9'],
  },
  F10: {
    keys: ['KC_F10'],
  },
  F11: {
    keys: ['KC_F11'],
  },
  F12: {
    keys: ['KC_F12'],
  },
  F13: {
    keys: ['KC_F13'],
  },
  F14: {
    keys: ['KC_F14'],
  },
  F15: {
    keys: ['KC_F15'],
  },
  F16: {
    keys: ['KC_F16'],
  },
  F17: {
    keys: ['KC_F17'],
  },
  F18: {
    keys: ['KC_F18'],
  },
  F19: {
    keys: ['KC_F19'],
  },
  F20: {
    keys: ['KC_F20'],
  },
  F21: {
    keys: ['KC_F21'],
  },
  F22: {
    keys: ['KC_F22'],
  },
  F23: {
    keys: ['KC_F23'],
  },
  F24: {
    keys: ['KC_F24'],
  },
  F25: {
    keys: ['KC_F25'],
  },
  F26: {
    keys: ['KC_F26'],
  },
  //#endregion

  Insert: {
    keys: ['KC_INS', 'KC_INSERT'],
  },
  Delete: {
    keys: ['KC_DEL', 'KC_DELETE'],
  },
  Home: {
    keys: ['KC_HOME'],
  },
  End: {
    keys: ['KC_END'],
  },
  'Page\nUp': {
    keys: ['KC_PGUP'],
  },
  'Page\nDown': {
    keys: ['KC_PGDN', 'KC_PGDOWN'],
  },
  'Print\nScreen': {
    keys: ['KC_PSCR', 'KC_PRINT_SCREEN'],
  },
  'Scroll\nLock': {
    keys: ['KC_SCRL', 'KC_SCROLL_LOCK'],
  },
  Pause: {
    keys: ['KC_PAUS', 'KC_PAUSE', 'KC_BRK', 'KC_BRU'],
  },
  'Num\nLock': {
    keys: ['KC_NUM', 'KC_NUM_LOCK'],
  },
  Power: {
    keys: ['KC_KB_POWER'],
  },
  APP: {
    keys: ['KC_APP', 'KC_APPLICATION'],
  },
  Execute: {
    keys: ['KC_EXEC', 'KC_EXECUTE'],
  },
  Help: {
    keys: ['KC_HELP'],
  },
  Menu: {
    keys: ['KC_MENU'],
  },
  Select: {
    keys: ['KC_SLCT', 'KC_SELECT'],
  },
  Stop: {
    keys: ['KC_STOP'],
  },
  Again: {
    keys: ['KC_AGIN', 'KC_AGAIN'],
  },
  Undo: {
    keys: ['KC_UNDO'],
  },
  Cut: {
    keys: ['KC_CUT'],
  },
  Copy: {
    keys: ['KC_COPY'],
  },
  Paste: {
    keys: ['KC_PSTE', 'KC_PASTE'],
  },
  Find: {
    keys: ['KC_FIND'],
  },
  Mute: {
    keys: ['KC_MUTE'],
  },
  'Volume\nUp': {
    keys: ['KC_KB_VOLUME_UP'],
  },
  'Volume\nDown': {
    keys: ['KC_KB_VOLUME_DOWN'],
  },
  'Brightess\nUp': {
    keys: ['KC_BRIGHTNESS_UP'],
  },
  'Brightess\nDown': {
    keys: ['KC_BRIGHTNESS_DOWN'],
  },

  UP: {
    keys: ['KC_UP'],
    icon: faCaretUp,
  },
  DOWN: {
    keys: ['KC_DOWN'],
    icon: faCaretDown,
  },
  LEFT: {
    keys: ['KC_LEFT'],
    icon: faCaretLeft,
  },
  RIGHT: {
    keys: ['KC_RGHT', 'KC_RIGHT'],
    icon: faCaretRight,
  },
  '~\n`': {
    keys: [`KC_GRV`, 'KC_GRAVE'],
  },
  '"\n\'': {
    keys: ['KC_QUOT', 'KC_QUOTE'],
  },
  '{\n[': {
    keys: ['KC_LBRC', 'KC_LEFT_BRACKET'],
  },
  '}\n]': {
    keys: ['KC_RBRC', 'KC_RIGHT_BRACKET'],
  },
  ':\n;': {
    keys: ['KC_SCLN', 'KC_SEMICOLON'],
  },
  '|\n\\': {
    keys: ['KC_BSLS', 'KC_BACKSLASH'],
  },
  '#\n~': {
    keys: ['KC_NUHS', 'KC_NONUS_HASH'],
  },
  '<\n,': {
    keys: ['KC_COMM', 'KC_COMMA'],
  },
  '>\n.': {
    keys: ['KC_DOT'],
  },
  '?\n/': {
    keys: ['KC_SLSH', 'KC_SLASH'],
  },
  '_\n-': {
    keys: ['KC_MINS', 'KC_MINUS'],
  },
  '+\n=': {
    keys: ['KC_EQL', 'KC_EQUAL'],
  },

  Space: {
    keys: ['KC_SPC', 'KC_SPACE'],
  },
  Enter: {
    keys: ['KC_ENT', 'KC_ENTER', 'KC_PENT'],
  },
  Escape: {
    keys: ['KC_ESC', 'KC_ESCAPE'],
  },
  Tab: {
    keys: ['KC_TAB'],
  },
  'Left\nCtrl': {
    keys: ['KC_LCTL'],
  },
  'Right\nCtrl': {
    keys: ['KC_RCTL'],
  },
  'Left Alt': {
    keys: ['KC_LALT'],
  },
  'Right Alt': {
    keys: ['KC_RALT'],
  },
  'Right\nOpt/Win': {
    keys: ['KC_RGUI'],
  },
  'Left\nOpt/Win': {
    keys: ['KC_LGUI'],
  },
  'Left Shift': {
    keys: ['KC_LSFT'],
  },
  'Right Shift': {
    keys: ['KC_RSFT'],
  },
  'Caps Lock': {
    keys: ['KC_CAPS', 'KC_CAPS_LOCK'],
  },
  Backspace: {
    keys: ['KC_BSPC', 'KC_BACKSPACE'],
  },
  '`/~\nEsc': {
    keys: ['QK_GESC'],
  },

  'No op': {
    keys: ['KC_NO', 'XXXXXXX'],
  },

  _______: {
    keys: ['_______', 'KC_TRNS', 'KC_TRANSPARENT'],
  },
};

export const KEY_TO_TEXT = reduce(
  KEYS,
  (acc, elem, label) => {
    elem.keys.forEach((key) => {
      if ('icon' in elem) {
        acc[key] = { icon: elem.icon };
      } else {
        acc[key] = label;
      }
    });
    return acc;
  },
  {} as Record<
    string,
    | string
    | {
        icon: any;
      }
  >
);
