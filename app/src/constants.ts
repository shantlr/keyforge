export const MAX_LAYERS = 32;

export const MAX_PARALLEL_JOB = Number(process.env.MAX_PARALLEL_JOB || 3);

export const COMPILE_JOB_ALIVE_TIMEOUT_MS =
  Number(process.env.COMPILE_JOB_ALIVE_TIMEOUT_MS) || 30 * 1000;

export const KEYS = [
  //#region Layers
  {
    key: 'MO',
    title: 'Push to',
    group: 'layer',
    params: [{ type: 'layer' }],
  },
  {
    key: 'TG',
    title: 'Toggle',
    group: 'layer',
    params: [{ type: 'layer' }],
  },
  {
    key: 'TO',
    title: 'Turn on',
    group: 'layer',
    params: [{ type: 'layer' }],
  },
  {
    key: 'TT',
    title: 'TT',
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
    params: [{ type: 'layer' }],
  },
  {
    key: 'LALT',
    group: 'layer',
    params: [{ type: 'layer' }],
  },
  //#endregions

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
    title: 'Mute',
    key: 'KC_MUTE',
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

  {
    title: 'UP',
    key: 'KC_UP',
    icon: 'up',
    // icon: faCaretUp,
  },
  {
    title: 'DOWN',
    key: 'KC_DOWN',
    icon: 'down',
    // icon: faCaretDown,
  },
  {
    title: 'LEFT',
    key: 'KC_LEFT',
    icon: 'left',
    // icon: faCaretLeft,
  },
  {
    title: 'RIGHT',
    key: 'KC_RGHT',
    aliases: ['KC_RIGHT'],
    icon: 'right',
    // icon: faCaretRight,
  },

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
    title: 'Left Shift',
    key: 'KC_LSFT',
  },
  {
    title: 'Right Shift',
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
] as const satisfies readonly {
  key: string;
  title?: string;
  icon?: string;
  group?: string;
  aliases?: readonly string[];
  params?: readonly any[];
}[];

export type KeyEnum = (typeof KEYS)[number]['key'];

export type KeyConfig = {
  key: KeyEnum;
  title?: string;
  placeholder?: string;
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
