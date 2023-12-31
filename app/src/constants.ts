import { KeymapKeyDef } from './types';

export const MAX_LAYERS = 32;

export const MAX_PARALLEL_JOB = Number(process.env.MAX_PARALLEL_JOB || 3);

export const COMPILE_JOB_ALIVE_TIMEOUT_MS =
  Number(process.env.COMPILE_JOB_ALIVE_TIMEOUT_MS) || 30 * 1000;

export type GenericKey = {
  key: string;
  title?: string;
  description?: string;
  group?: string;
  aliases?: readonly string[];
  params?: readonly any[];
};

export const KEYS = [
  //#region Layers
  {
    key: 'MO',
    description:
      'Momentarily turn on <LAYER> when pressed (requires KC_TRNS at same position on destination layer)',
    title: 'Push to',
    group: 'layer',
    params: [{ type: 'layer' }],
  },
  {
    key: 'TG',
    title: 'Toggle',
    group: 'layer',
    description: 'Toggle <LAYER> on or off',
    params: [{ type: 'layer' }],
  },
  {
    key: 'TO',
    title: 'Turn on',
    description:
      'Turns on <LAYER> and turns off all other layers, except the default layer',
    group: 'layer',
    params: [{ type: 'layer' }],
  },
  {
    key: 'TT',
    title: 'TT',
    description:
      'Momentarily turn on <LAYER> when pressed, if it’s tapped multiple times, toggles <LAYER> on',
    group: 'layer',
    params: [{ type: 'layer' }],
  },
  {
    key: 'DF',
    group: 'layer',
    params: [{ type: 'layer' }],
  },
  {
    key: 'OSL',
    group: 'layer',
    description:
      'Momentarily activates <LAYER> until a key is pressed. See One Shot Keys for details.',
    params: [{ type: 'layer' }],
  },
  //#endregion

  //#region Alphanum
  {
    key: 'KC_A',
    title: 'A',
    group: 'Alphanum',
  },
  {
    key: 'KC_B',
    title: 'B',
    group: 'Alphanum',
  },
  {
    key: 'KC_C',
    title: 'C',
    group: 'Alphanum',
  },
  {
    key: 'KC_D',
    title: 'D',
    group: 'Alphanum',
  },
  {
    key: 'KC_E',
    title: 'E',
    group: 'Alphanum',
  },
  {
    key: 'KC_F',
    title: 'F',
    group: 'Alphanum',
  },
  {
    key: 'KC_G',
    title: 'G',
    group: 'Alphanum',
  },
  {
    key: 'KC_H',
    title: 'H',
    group: 'Alphanum',
  },
  {
    key: 'KC_I',
    title: 'I',
    group: 'Alphanum',
  },
  {
    key: 'KC_J',
    title: 'J',
    group: 'Alphanum',
  },
  {
    key: 'KC_K',
    title: 'K',
    group: 'Alphanum',
  },
  {
    key: 'KC_L',
    title: 'L',
    group: 'Alphanum',
  },
  {
    key: 'KC_M',
    title: 'M',
    group: 'Alphanum',
  },
  {
    key: 'KC_N',
    title: 'N',
    group: 'Alphanum',
  },
  {
    key: 'KC_O',
    title: 'O',
    group: 'Alphanum',
  },
  {
    key: 'KC_P',
    title: 'P',
    group: 'Alphanum',
  },
  {
    key: 'KC_Q',
    title: 'Q',
    group: 'Alphanum',
  },
  {
    key: 'KC_R',
    title: 'R',
    group: 'Alphanum',
  },
  {
    key: 'KC_S',
    title: 'S',
    group: 'Alphanum',
  },
  {
    key: 'KC_T',
    title: 'T',
    group: 'Alphanum',
  },
  {
    key: 'KC_U',
    title: 'U',
    group: 'Alphanum',
  },
  {
    key: 'KC_V',
    title: 'V',
    group: 'Alphanum',
  },
  {
    key: 'KC_W',
    title: 'W',
    group: 'Alphanum',
  },
  {
    key: 'KC_X',
    title: 'X',
    group: 'Alphanum',
  },
  {
    key: 'KC_Y',
    title: 'Y',
    group: 'Alphanum',
  },
  {
    key: 'KC_Z',
    title: 'Z',
    group: 'Alphanum',
  },
  {
    title: ')\n0',
    key: 'KC_0',
    group: 'Alphanum',
  },
  {
    title: '!\n1',
    key: 'KC_1',
    group: 'Alphanum',
  },
  {
    title: '@\n2',
    key: 'KC_2',
    group: 'Alphanum',
  },
  {
    title: '#\n3',
    key: 'KC_3',
    group: 'Alphanum',
  },
  {
    title: '$\n4',
    key: 'KC_4',
    group: 'Alphanum',
  },
  {
    title: '%\n5',
    key: 'KC_5',
    group: 'Alphanum',
  },
  {
    title: '^\n6',
    key: 'KC_6',
    group: 'Alphanum',
  },
  {
    title: '&\n7',
    key: 'KC_7',
    group: 'Alphanum',
  },
  {
    title: '*\n8',
    key: 'KC_8',
    group: 'Alphanum',
  },
  {
    title: '(\n9',
    key: 'KC_9',
    group: 'Alphanum',
  },
  {
    title: '0',
    key: 'KC_P0',
    aliases: ['KC_KP_0'],
  },
  {
    title: '1',
    key: 'KC_P1',
    aliases: ['KC_KP_1'],
  },
  {
    title: '2',
    key: 'KC_P2',
    aliases: ['KC_KP_2'],
  },
  {
    title: '3',
    key: 'KC_P3',
    aliases: ['KC_KP_3'],
  },
  {
    title: '4',
    key: 'KC_P4',
    aliases: ['KC_KP_4'],
  },
  {
    title: '5',
    key: 'KC_P5',
    aliases: ['KC_KP_5'],
  },
  {
    title: '6',
    key: 'KC_P6',
    aliases: ['KC_KP_6'],
  },
  {
    title: '7',
    key: 'KC_P7',
    aliases: ['KC_KP_7'],
  },
  {
    title: '8',
    key: 'KC_P8',
    aliases: ['KC_KP_8'],
  },
  {
    title: '9',
    key: 'KC_P9',
    aliases: ['KC_KP_9'],
  },
  {
    title: '=',
    key: 'KC_PEQL',
    aliases: ['KC_KP_EQUAL'],
  },
  {
    title: '+',
    key: 'KC_PPLS',
  },
  {
    title: '.',
    key: 'KC_PDOT',
  },
  {
    title: ',',
    key: 'KC_PCMM',
  },
  {
    title: '/',
    key: 'KC_PSLS',
  },
  {
    title: '*',
    key: 'KC_PAST',
  },
  {
    title: '-',
    key: 'KC_PMNS',
  },
  //#endregion

  // #region Symbols
  {
    key: 'KC_EXLM',
    aliases: ['KC_EXCLAIM'],
    title: '!',
  },
  {
    key: 'KC_TILD',
    aliases: ['KC_TILDE'],
    title: '~',
  },
  {
    key: 'KC_AT',
    title: '@',
  },
  {
    key: 'KC_HASH',
    title: '#',
  },
  {
    key: 'KC_DLR',
    aliases: ['KC_DOLLAR'],
    title: '$',
  },
  {
    aliases: ['KC_PERCENT'],
    key: 'KC_PERC',
    title: '%',
  },
  {
    aliases: ['KC_CIRCUMFLEX'],
    key: 'KC_CIRC',
    title: '^',
  },
  {
    aliases: ['KC_AMPERSAND'],
    key: 'KC_AMPR',
    title: '&',
  },
  {
    aliases: ['KC_ASTERISK'],
    key: 'KC_ASTR',
    title: '*',
  },
  {
    aliases: ['KC_LEFT_PAREN'],
    key: 'KC_LPRN',
    title: '(',
  },
  {
    aliases: ['KC_RIGHT_PAREN'],
    key: 'KC_RPRN',
    title: ')',
  },
  {
    aliases: ['KC_UNDERSCORE'],
    key: 'KC_UNDS',
    title: '_',
  },
  {
    aliases: ['KC_PLUS'],
    key: '+',
    title: '{',
  },
  {
    aliases: ['KC_LEFT_CURLY_BRACE'],
    key: 'KC_LCBR',
    title: '{',
  },
  {
    aliases: ['KC_RIGHT_CURLY_BRACE'],
    key: 'KC_RCBR',
    title: '}',
  },
  {
    aliases: ['KC_PIPE'],
    key: '|',
    title: '{',
  },
  {
    aliases: ['KC_COLON'],
    key: 'KC_COLN',
    title: ':',
  },
  {
    aliases: ['KC_DQUO', 'KC_DOUBLE_QUOTE'],
    key: 'KC_DQT',
    title: `"`,
  },
  {
    aliases: ['KC_LABK', 'KC_LEFT_ANGLE_BRACKET'],
    key: 'KC_LT',
    title: '<',
  },
  {
    aliases: ['KC_RABK', 'KC_RIGHT_ANGLE_BRACKET'],
    key: 'KC_GT',
    title: '>',
  },
  {
    aliases: ['KC_QUESTION'],
    key: 'KC_QUES',
    title: '?',
  },
  // #endregion

  //#region Function key
  {
    title: 'F0',
    key: 'KC_F0',
  },
  {
    title: 'F1',
    key: 'KC_F1',
  },
  {
    title: 'F2',
    key: 'KC_F2',
  },
  {
    title: 'F3',
    key: 'KC_F3',
  },
  {
    title: 'F4',
    key: 'KC_F4',
  },
  {
    title: 'F5',
    key: 'KC_F5',
  },
  {
    title: 'F6',
    key: 'KC_F6',
  },
  {
    title: 'F7',
    key: 'KC_F7',
  },
  {
    title: 'F8',
    key: 'KC_F8',
  },
  {
    title: 'F9',
    key: 'KC_F9',
  },
  {
    title: 'F10',
    key: 'KC_F10',
  },
  {
    title: 'F11',
    key: 'KC_F11',
  },
  {
    title: 'F12',
    key: 'KC_F12',
  },
  {
    title: 'F13',
    key: 'KC_F13',
  },
  {
    title: 'F14',
    key: 'KC_F14',
  },
  {
    title: 'F15',
    key: 'KC_F15',
  },
  {
    title: 'F16',
    key: 'KC_F16',
  },
  {
    title: 'F17',
    key: 'KC_F17',
  },
  {
    title: 'F18',
    key: 'KC_F18',
  },
  {
    title: 'F19',
    key: 'KC_F19',
  },
  {
    title: 'F20',
    key: 'KC_F20',
  },
  {
    title: 'F21',
    key: 'KC_F21',
  },
  {
    title: 'F22',
    key: 'KC_F22',
  },
  {
    title: 'F23',
    key: 'KC_F23',
  },
  {
    title: 'F24',
    key: 'KC_F24',
  },
  {
    title: 'F25',
    key: 'KC_F25',
  },
  {
    title: 'F26',
    key: 'KC_F26',
  },
  //#endregion

  {
    title: 'Insert',
    key: 'KC_INS',
    aliases: ['KC_INSERT'],
  },
  {
    title: 'Delete',
    key: 'KC_DEL',
    aliases: ['KC_DELETE'],
  },
  {
    title: 'Home',
    key: 'KC_HOME',
  },
  {
    title: 'End',
    key: 'KC_END',
  },
  {
    title: 'Page\nUp',
    key: 'KC_PGUP',
  },
  {
    title: 'Page\nDown',
    key: 'KC_PGDN',
    aliases: ['KC_PGDOWN'],
  },
  {
    title: 'Print\nScreen',
    key: 'KC_PSCR',
    aliases: ['KC_PRINT_SCREEN'],
  },
  {
    title: 'Scroll\nLock',
    key: 'KC_SCRL',
    aliases: ['KC_SCROLL_LOCK'],
  },
  {
    title: 'Pause',
    key: 'KC_PAUS',
    aliases: ['KC_PAUSE', 'KC_BRK', 'KC_BRU'],
  },
  {
    title: 'Num\nLock',
    key: 'KC_NUM',
    aliases: ['KC_NUM_LOCK'],
  },
  {
    title: 'Power',
    key: 'KC_KB_POWER',
  },
  {
    title: 'APP',
    key: 'KC_APP',
    aliases: ['KC_APPLICATION'],
  },
  {
    title: 'Execute',
    key: 'KC_EXEC',
    aliases: ['KC_EXECUTE'],
  },
  {
    title: 'Help',
    key: 'KC_HELP',
  },
  {
    title: 'Menu',
    key: 'KC_MENU',
  },
  {
    title: 'Select',
    key: 'KC_SLCT',
    aliases: ['KC_SELECT'],
  },
  {
    title: 'Stop',
    key: 'KC_STOP',
  },
  {
    title: 'Again',
    key: 'KC_AGIN',
    aliases: ['KC_AGAIN'],
  },
  {
    title: 'Undo',
    key: 'KC_UNDO',
  },
  {
    title: 'Cut',
    key: 'KC_CUT',
  },
  {
    title: 'Copy',
    key: 'KC_COPY',
  },
  {
    title: 'Paste',
    key: 'KC_PSTE',
    aliases: ['KC_PASTE'],
  },
  {
    title: 'Find',
    key: 'KC_FIND',
  },
  {
    title: 'Volume\nUp',
    key: 'KC_KB_VOLUME_UP',
  },
  {
    title: 'Volume\nDown',
    key: 'KC_KB_VOLUME_DOWN',
  },
  {
    title: 'Brightess\nUp',
    key: 'KC_BRIGHTNESS_UP',
  },
  {
    title: 'Brightess\nDown',
    key: 'KC_BRIGHTNESS_DOWN',
  },

  //#region Arrows
  {
    title: 'UP',
    key: 'KC_UP',
  },
  {
    title: 'DOWN',
    key: 'KC_DOWN',
  },
  {
    title: 'LEFT',
    key: 'KC_LEFT',
  },
  {
    title: 'RIGHT',
    key: 'KC_RGHT',
    aliases: ['KC_RIGHT'],
  },
  //#endregion

  {
    title: '~\n`',
    key: `KC_GRV`,
    aliases: ['KC_GRAVE'],
  },
  {
    title: '"\n\'',
    key: 'KC_QUOT',
    aliases: ['KC_QUOTE'],
  },
  {
    title: '{\n[',
    key: 'KC_LBRC',
    aliases: ['KC_LEFT_BRACKET'],
  },
  {
    title: '}\n]',
    key: 'KC_RBRC',
    aliases: ['KC_RIGHT_BRACKET'],
  },
  {
    title: ':\n;',
    key: 'KC_SCLN',
    aliases: ['KC_SEMICOLON'],
  },
  {
    title: '|\n\\',
    key: 'KC_BSLS',
    aliases: ['KC_BACKSLASH'],
  },
  {
    title: '#\n~',
    key: 'KC_NUHS',
    aliases: ['KC_NONUS_HASH'],
  },
  {
    title: '<\n,',
    key: 'KC_COMM',
    aliases: ['KC_COMMA'],
  },
  {
    title: '>\n.',
    key: 'KC_DOT',
    aliases: [],
  },
  {
    title: '?\n/',
    key: 'KC_SLSH',
    aliases: ['KC_SLASH'],
  },
  {
    title: '_\n-',
    key: 'KC_MINS',
    aliases: ['KC_MINUS'],
  },
  {
    title: '+\n=',
    key: 'KC_EQL',
    aliases: ['KC_EQUAL'],
  },

  {
    title: 'Space',
    key: 'KC_SPC',
    aliases: ['KC_SPACE'],
  },
  {
    title: 'Enter',
    key: 'KC_ENT',
    aliases: ['KC_ENTER', 'KC_PENT'],
  },
  {
    title: 'Escape',
    key: 'KC_ESC',
    aliases: ['KC_ESCAPE'],
  },
  {
    title: 'Tab',
    key: 'KC_TAB',
  },
  {
    title: 'Left\nCtrl',
    key: 'KC_LCTL',
  },
  {
    title: 'Right\nCtrl',
    key: 'KC_RCTL',
  },
  {
    title: 'Left Alt',
    key: 'KC_LALT',
  },
  {
    title: 'Right Alt',
    key: 'KC_RALT',
  },
  {
    title: 'Right\nOpt/Win',
    key: 'KC_RGUI',
  },
  {
    title: 'Left\nOpt/Win',
    key: 'KC_LGUI',
  },
  {
    title: 'Left\nShift',
    key: 'KC_LSFT',
  },
  {
    title: 'Right\nShift',
    key: 'KC_RSFT',
  },
  {
    title: 'Caps Lock',
    key: 'KC_CAPS',
    aliases: ['KC_CAPS_LOCK'],
  },
  {
    title: 'Backspace',
    key: 'KC_BSPC',
    aliases: ['KC_BACKSPACE'],
  },
  {
    title: '`/~\nEsc',
    key: 'QK_GESC',
  },

  //#region Audio
  {
    title: 'System\npower\ndown',
    group: 'media-system',
    key: 'KC_PWR',
    aliases: ['KC_SYSTEM_POWER'],
  },

  {
    title: 'System\nsleep',
    group: 'media-system',
    key: 'KC_SLEP',
    aliases: ['KC_SYSTEM_SLEEP'],
  },
  {
    title: 'System\nwake',
    group: 'media-system',
    key: 'KC_WAKE',
    aliases: ['KC_SYSTEM_WAKE'],
  },
  {
    title: 'Mute',
    group: 'media-audio',
    key: 'KC_MUTE',
    aliases: ['KC_AUDIO_MUTE'],
  },
  {
    title: 'Volume\nUp',
    group: 'media-audio',
    aliases: ['KC_AUDIO_VOL_UP'],
    key: 'KC_VOLU',
  },
  {
    title: 'Volume\nDown',
    group: 'media-audio',
    aliases: ['KC_AUDIO_VOL_DOWN'],
    key: 'KC_VOLD',
  },
  {
    title: 'Next\nTrack',
    group: 'media-audio',
    aliases: ['KC_MEDIA_NEXT_TRACK'],
    key: 'KC_MNXT',
  },
  {
    title: 'Previous\nTrack',
    group: 'media-audio',
    aliases: ['KC_MEDIA_PREV_TRACK'],
    key: 'KC_MPRV',
  },
  {
    title: 'Stop\nTrack',
    group: 'media-audio',
    aliases: ['KC_MEDIA_STOP'],
    key: 'KC_MSTP',
  },
  {
    title: 'Play\nPause\nTrack',
    group: 'media-audio',
    aliases: ['KC_MEDIA_PLAY_PAUSE'],
    key: 'KC_MPLY',
  },
  {
    title: 'Launch\nMedia\nPlayer',
    group: 'media-audio',
    aliases: ['KC_MEDIA_SELECT'],
    key: 'KC_MSEL',
  },
  //#endregion

  {
    key: 'RGB_TOG',
    group: 'rgb',
    title: 'RGB\nToggle',
    description: 'Toggle RGB lighting on or off',
  },
  {
    key: 'RGB_MOD',
    group: 'rgb',
    aliases: ['RGB_MODE_FORWARD'],
    title: 'RGB\nCycle',
    description: 'Cycle through modes, reverse direction when Shift is held',
  },
  {
    key: 'RGB_RMOD',
    group: 'rgb',
    aliases: ['RGB_MODE_REVERSE'],
    title: 'RGB\nRev Cycle',
    description:
      'Cycle through modes in reverse, forward direction when Shift is held',
  },
  {
    key: 'RGB_HUI',
    group: 'rgb',
    title: 'RGB\nInc Hue',
    description: 'Increase hue, decrease hue when Shift is held',
  },
  {
    key: 'RGB_HUD',
    group: 'rgb',
    title: 'RGB\nDec Hue',
    description: 'Decrease hue, increase hue when Shift is held',
  },
  {
    key: 'RGB_SAI',
    group: 'rgb',
    title: 'RGB\nInc Sat',
    description: 'Increase saturation, decrease saturation when Shift is held',
  },
  {
    key: 'RGB_SAD',
    group: 'rgb',
    title: 'RGB\nDec Sat',
    description: 'Decrease saturation, increase saturation when Shift is held',
  },
  {
    key: 'RGB_VAI',
    group: 'rgb',
    title: 'RGB\nInc Bri',
    description:
      'Increase value (brightness), decrease value when Shift is held',
  },
  {
    key: 'RGB_VAD',
    group: 'rgb',
    title: 'RGB\nDec Bri',
    description:
      'Decrease value (brightness), increase value when Shift is held',
  },
  {
    key: 'RGB_SPI',
    group: 'rgb',
    title: 'RGB\nInc Speed',
    description:
      'Increase effect speed (does not support eeprom yet), decrease speed when Shift is held',
  },
  {
    key: 'RGB_SPD',
    group: 'rgb',
    title: 'RGB\nDec Speed',
    description:
      'Decrease effect speed (does not support eeprom yet), increase speed when Shift is held',
  },

  {
    aliases: ['KC_MS_UP'],
    key: 'KC_MS_U',
    group: 'mouse',
    title: 'Mouse\nCursor\nUp',
  },
  {
    aliases: ['KC_MS_DOWN'],
    key: 'KC_MS_D',
    group: 'mouse',
    title: 'Mouse\nCursor\nDown',
  },
  {
    aliases: ['KC_MS_LEFT'],
    key: 'KC_MS_L',
    group: 'mouse',
    title: 'Mouse\nCursor\nLeft',
  },
  {
    aliases: ['KC_MS_RIGHT'],
    key: 'KC_MS_R',
    group: 'mouse',
    title: 'Mouse\nCursor\nRight',
  },
  {
    aliases: ['KC_MS_BTN1'],
    key: 'KC_BTN1',
    group: 'mouse',
    title: 'Mouse\nButton\n1',
  },
  {
    aliases: ['KC_MS_BTN2'],
    key: 'KC_BTN2',
    group: 'mouse',
    title: 'Mouse\nButton\n2',
  },
  {
    aliases: ['KC_MS_BTN3'],
    key: 'KC_BTN3',
    group: 'mouse',
    title: 'Mouse\nButton\n3',
  },
  {
    aliases: ['KC_MS_BTN4'],
    key: 'KC_BTN4',
    group: 'mouse',
    title: 'Mouse\nButton\n4',
  },
  {
    aliases: ['KC_MS_BTN5'],
    key: 'KC_BTN5',
    group: 'mouse',
    title: 'Mouse\nButton\n5',
  },
  {
    aliases: ['KC_MS_WH_UP'],
    key: 'KC_WH_U',
    group: 'mouse',
    title: 'Mouse\nWheel\nUp',
  },
  {
    aliases: ['KC_MS_WH_DOWN'],
    key: 'KC_WH_D',
    group: 'mouse',
    title: 'Mouse\nWheel\nDown',
  },
  {
    aliases: ['KC_MS_WH_LEFT'],
    key: 'KC_WH_L',
    group: 'mouse',
    title: 'Mouse\nWheel\nLeft',
  },
  {
    aliases: ['KC_MS_WH_RIGHT'],
    key: 'KC_WH_R',
    group: 'mouse',
    title: 'Mouse\nWheel\nRight',
  },
  {
    aliases: ['KC_MS_ACCEL0'],
    key: 'KC_ACL0',
    group: 'mouse',
    description: 'Set mouse acceleration to 0',
  },
  {
    aliases: ['KC_MS_ACCEL1'],
    key: 'KC_ACL1',
    group: 'mouse',
    description: 'Set mouse acceleration to 1',
  },
  {
    aliases: ['KC_MS_ACCEL2'],
    key: 'KC_ACL2',
    group: 'mouse',
    description: 'Set mouse acceleration to 2',
  },

  //#region Modifier
  {
    key: 'LCTL',
    group: 'modifier',
    params: [{ type: 'key' }],
    aliases: ['C'],
    description: 'Hold Left Control and press <KEY>',
  },
  {
    key: 'LSFT',
    group: 'modifier',
    params: [{ type: 'key' }],
    aliases: ['S'],
    description: 'Hold Left Shift and press <KEY>',
  },
  {
    key: 'LALT',
    group: 'modifier',
    params: [{ type: 'key' }],
    aliases: ['A', 'LOPT'],
    description: 'Hold Left Alt and press <KEY>',
  },
  {
    key: 'LGUI',
    group: 'modifier',
    params: [{ type: 'key' }],
    aliases: ['G', 'LCMD', 'LWIN'],
    description: 'Hold Left GUI and press <KEY>',
  },
  {
    key: 'RCTL',
    group: 'modifier',
    params: [{ type: 'key' }],
    description: 'Hold Right Control and press <KEY>',
  },
  {
    key: 'RSFT',
    group: 'modifier',
    params: [{ type: 'key' }],
    description: 'Hold Right Shift and press <KEY>',
  },
  {
    key: 'RALT',
    group: 'modifier',
    params: [{ type: 'key' }],
    aliases: ['ROPT', 'ALGR'],
    description: 'Hold Right Alt and press <KEY>',
  },
  {
    key: 'RGUI',
    group: 'modifier',
    params: [{ type: 'key' }],
    aliases: ['RCMD', 'LWIN'],
    description: 'Hold Right GUI and press <KEY>',
  },
  {
    key: 'LSG',
    group: 'modifier',
    params: [{ type: 'key' }],
    aliases: ['SGUI', 'SCMD', 'SWIN'],
    description: 'Hold Left Shift and GUI and press <KEY>',
  },
  {
    key: 'LAG',
    group: 'modifier',
    params: [{ type: 'key' }],
    description: 'Hold Left Alt and Left GUI and press <KEY>',
  },
  {
    key: 'RSG',
    group: 'modifier',
    params: [{ type: 'key' }],
    description: 'Hold Right Shift and Right GUI and press <KEY>',
  },
  {
    key: 'RAG',
    group: 'modifier',
    params: [{ type: 'key' }],
    description: 'Hold Right Alt and Right GUI and press <KEY>',
  },
  {
    key: 'LCA',
    group: 'modifier',
    params: [{ type: 'key' }],
    description: 'Hold Left Control and Alt and press <KEY>',
  },
  {
    key: 'LSA',
    group: 'modifier',
    params: [{ type: 'key' }],
    description: 'Hold Left Shift and Left Alt and press <KEY>',
  },
  {
    key: 'RSA',
    group: 'modifier',
    params: [{ type: 'key' }],
    aliases: ['SAGR'],
    description: 'Hold Right Shift and Right Alt (AltGr) and press <KEY>',
  },
  {
    key: 'RCS',
    group: 'modifier',
    params: [{ type: 'key' }],
    description: 'Hold Right Control and Right Shift and press <KEY>',
  },
  {
    key: 'LCAG',
    group: 'modifier',
    params: [{ type: 'key' }],
    description: 'Hold Left Control, Alt and GUI and press <KEY>',
  },
  {
    key: 'MEH',
    group: 'modifier',
    params: [{ type: 'key' }],
    description: 'Hold Left Control, Shift and Alt and press <KEY>',
  },
  {
    key: 'HYPR',
    group: 'modifier',
    params: [{ type: 'key' }],
    description: 'Hold Left Control, Shift, Alt and GUI and press <KEY>',
  },
  //#endregion

  //#region QMK
  {
    key: 'QK_BOOTLOADER',
    group: 'qmk',
    aliases: ['QK_BOOT'],
    title: 'QMK\nBootloader',
    description: 'Put the keyboard into bootloader mode for flashing',
  },
  {
    key: 'QK_DEBUG_TOGGLE',
    group: 'qmk',
    aliases: ['DB_TOGG'],
    title: 'QMK\nToggle\nDebug',
    description: 'Toggle debug mode',
  },
  {
    key: 'QK_CLEAR_EEPROM',
    group: 'qmk',
    aliases: ['EE_CLR'],
    title: 'QMK\nClear\nEEPROM',
    description: 'Reinitializes the keyboard’s EEPROM (persistent memory)',
  },
  {
    key: 'QK_MAKE',
    group: 'qmk',
    title: 'QMK\nMake',
    description:
      'Sends qmk compile -kb (keyboard) -km (keymap), or qmk flash if shift is held. Puts keyboard into bootloader mode if shift & control are held',
  },
  {
    key: 'QK_REBOOT',
    group: 'qmk',
    aliases: ['QK_RBT'],
    title: 'Reset\nKeyboard',
    description: 'Resets the keyboard. Does not load the bootloader',
  },

  {
    aliases: ['QK_REPEAT_KEY'],
    key: 'QK_REP',
    title: 'Repeat',
    group: 'qmk-repeat',
    description: 'Repeat the last pressed key',
  },
  {
    aliases: ['QK_ALT_REPEAT_KEY'],
    key: 'QK_AREP',
    title: 'Repeat\nAlt',
    group: 'qmk-repeat',
    description: 'Perform alternate of the last key',
  },

  //#endregion

  {
    title: 'No op',
    key: 'KC_NO',
    aliases: ['XXXXXXX'],
  },

  {
    title: '_______',
    key: '_______',
    aliases: ['KC_TRNS', 'KC_TRANSPARENT'],
  },
] as const satisfies readonly GenericKey[];

export type KeyEnum = (typeof KEYS)[number]['key'];

export type KeyConfig = {
  key: KeyEnum;
  aliases?: readonly string[];
  title?: string;
  description?: string;
  group?: ((typeof KEYS)[number] & { group: string & {} })['group'];
  params?: readonly [{ type: 'layer' | 'key' }];
};

export const KEYS_MAP = KEYS.reduce(
  (acc, item) => {
    if ('aliases' in item) {
      item.aliases.forEach((key) => {
        acc[key] = item;
      });
    }
    acc[item.key] = item;
    return acc;
  },
  {} as Record<
    string,
    {
      key: string;
      icon?: string;
      aliases?: readonly string[];
      title?: string;
      params?: readonly any[];
    }
  >
);

export const getKeyConfFromDef = (
  key: KeymapKeyDef | null | undefined
): KeyConfig | null => {
  if (!key) {
    return null;
  }
  if (typeof key === 'string') {
    return KEYS_MAP[key] as KeyConfig;
  }
  return KEYS_MAP[key.key] as KeyConfig;
};
