export const MAX_LAYERS = 32;

export const MAX_PARALLEL_JOB = Number(process.env.MAX_PARALLEL_JOB || 3);

export const COMPILE_JOB_ALIVE_TIMEOUT_MS =
  Number(process.env.COMPILE_JOB_ALIVE_TIMEOUT_MS) || 30 * 1000;

export const KEYS = [
  {
    key: 'MO',
    title: 'Push\nto layer',
    params: [{ type: 'layer' }],
  },
  {
    key: 'TG',
    title: 'Toggle layer',
    params: [{ type: 'layer' }],
  },
  {
    key: 'TO',
    title: 'Turn on layer',
    params: [{ type: 'layer' }],
  },
  {
    key: 'TT',
    title: 'TT',
    params: [{ type: 'layer' }],
  },
  {
    key: 'DF',
    params: [{ type: 'layer' }],
  },
  {
    key: 'OSL',
    params: [{ type: 'layer' }],
  },
  {
    key: 'LALT',
    params: [{ type: 'layer' }],
  },

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
] as const satisfies readonly {
  key: string;
  title?: string;
  group?: string;
  aliases?: string[];
  params?: readonly any[];
}[];

export const KEYS_MAP = KEYS.reduce(
  (acc, item) => {
    acc[item.key] = item;
    return acc;
  },
  {} as Record<
    string,
    {
      key: string;
      aliases?: string[];
      title?: string;
      params?: readonly any[];
    }
  >
);

console.log(KEYS_MAP);
