import { ComponentProps } from 'react';
import { Keymap } from '../domain/keymap';

const BASIC_KEYS_POSITION = [
  { x: 0, y: 0, key: 'KC_ESC' },

  { x: 2, y: 0, key: 'F1' },
  { x: 3, y: 0, key: 'F2' },
  { x: 4, y: 0, key: 'F3' },
  { x: 5, y: 0, key: 'F4' },

  { x: 6.5, y: 0, key: 'F5' },
  { x: 7.5, y: 0, key: 'F6' },
  { x: 8.5, y: 0, key: 'F7' },
  { x: 9.5, y: 0, key: 'F8' },

  { x: 11, y: 0, key: 'F9' },
  { x: 12, y: 0, key: 'F10' },
  { x: 13, y: 0, key: 'F11' },
  { x: 14, y: 0, key: 'F12' },

  { x: 15.25, y: 0, key: 'KC_PSCR' },
  { x: 16.25, y: 0, key: 'KC_SCRL' },
  { x: 17.25, y: 0, key: 'KC_PAUS' },

  { x: 0, y: 1, key: 'KC_GRV' },
  { x: 1, y: 1, key: 'KC_1' },
  { x: 2, y: 1, key: 'KC_2' },
  { x: 3, y: 1, key: 'KC_3' },
  { x: 4, y: 1, key: 'KC_4' },
  { x: 5, y: 1, key: 'KC_5' },
  { x: 6, y: 1, key: 'KC_6' },
  { x: 7, y: 1, key: 'KC_7' },
  { x: 8, y: 1, key: 'KC_8' },
  { x: 9, y: 1, key: 'KC_9' },
  { x: 10, y: 1, key: 'KC_0' },
  { x: 11, y: 1, key: 'KC_MINS' },
  { x: 12, y: 1, key: 'KC_EQL' },
  { x: 13, y: 1, w: 2, key: 'KC_BSPC' },

  { x: 15.25, y: 1, key: 'KC_INS' },
  { x: 16.25, y: 1, key: 'KC_HOME' },
  { x: 17.25, y: 1, key: 'KC_PGUP' },

  { x: 18.5, y: 1, key: 'KC_NUM' },
  { x: 19.5, y: 1, key: 'KC_PSLS' },
  { x: 20.5, y: 1, key: 'KC_PAST' },
  { x: 21.5, y: 1, key: 'KC_PMNS' },

  { x: 0, y: 2, w: 1.5, key: 'KC_TAB' },
  { x: 1.5, y: 2, key: 'KC_Q' },
  { x: 2.5, y: 2, key: 'KC_W' },
  { x: 3.5, y: 2, key: 'KC_E' },
  { x: 4.5, y: 2, key: 'KC_R' },
  { x: 5.5, y: 2, key: 'KC_T' },
  { x: 6.5, y: 2, key: 'KC_Y' },
  { x: 7.5, y: 2, key: 'KC_U' },
  { x: 8.5, y: 2, key: 'KC_I' },
  { x: 9.5, y: 2, key: 'KC_O' },
  { x: 10.5, y: 2, key: 'KC_P' },
  { x: 11.5, y: 2, key: 'KC_LBRC' },
  { x: 12.5, y: 2, key: 'KC_RBRC' },
  { x: 13.5, y: 2, w: 1.5, key: 'KC_BSLS' },

  { x: 15.25, y: 2, key: 'KC_DEL' },
  { x: 16.25, y: 2, key: 'KC_END' },
  { x: 17.25, y: 2, key: 'KC_PGDN' },

  { x: 18.5, y: 2, key: 'KC_P7' },
  { x: 19.5, y: 2, key: 'KC_P8' },
  { x: 20.5, y: 2, key: 'KC_P9' },
  { x: 21.5, y: 2, key: 'KC_PPLS' },

  { x: 0, y: 3, w: 1.75, key: 'KC_CAPS' },
  { x: 1.75, y: 3, key: 'KC_A' },
  { x: 2.75, y: 3, key: 'KC_S' },
  { x: 3.75, y: 3, key: 'KC_D' },
  { x: 4.75, y: 3, key: 'KC_F' },
  { x: 5.75, y: 3, key: 'KC_G' },
  { x: 6.75, y: 3, key: 'KC_H' },
  { x: 7.75, y: 3, key: 'KC_J' },
  { x: 8.75, y: 3, key: 'KC_K' },
  { x: 9.75, y: 3, key: 'KC_L' },
  { x: 10.75, y: 3, key: 'KC_SCLN' },
  { x: 11.75, y: 3, key: 'KC_QUOT' },
  { x: 12.75, y: 3, w: 2.25, key: 'KC_ENT' },

  { x: 18.5, y: 3, key: 'KC_P4' },
  { x: 19.5, y: 3, key: 'KC_P5' },
  { x: 20.5, y: 3, key: 'KC_P6' },
  { x: 21.5, y: 3, key: 'KC_PCMM' },

  { x: 0, y: 4, w: 2.25, key: 'KC_LSFT' },
  { x: 2.25, y: 4, key: 'KC_Z' },
  { x: 3.25, y: 4, key: 'KC_X' },
  { x: 4.25, y: 4, key: 'KC_C' },
  { x: 5.25, y: 4, key: 'KC_V' },
  { x: 6.25, y: 4, key: 'KC_B' },
  { x: 7.25, y: 4, key: 'KC_N' },
  { x: 8.25, y: 4, key: 'KC_M' },
  { x: 9.25, y: 4, key: 'KC_COMM' },
  { x: 10.25, y: 4, key: 'KC_DOT' },
  { x: 11.25, y: 4, key: 'KC_SLSH' },
  { x: 12.25, y: 4, w: 2.75, key: 'KC_RSFT' },

  { x: 16.25, y: 4, key: 'KC_UP' },

  { x: 18.5, y: 4, key: 'KC_P1' },
  { x: 19.5, y: 4, key: 'KC_P2' },
  { x: 20.5, y: 4, key: 'KC_P3' },
  { x: 21.5, y: 4, key: 'KC_PEQL' },

  { x: 0, y: 5, w: 1.25, key: 'KC_LCTL' },
  { x: 1.25, y: 5, w: 1.25, key: 'KC_LGUI' },
  { x: 2.5, y: 5, w: 1.25, key: 'KC_LALT' },
  { x: 3.75, y: 5, w: 6.25, key: 'KC_SPC' },
  { x: 10, y: 5, w: 1.25, key: 'KC_RALT' },
  { x: 11.25, y: 5, w: 1.25, key: 'KC_RGUI' },
  { x: 12.5, y: 5, key: 'KC_APP' },
  { x: 13.5, y: 5, key: 'KC_RCTL' },

  { x: 15.25, y: 5, key: 'KC_LEFT' },
  { x: 16.25, y: 5, key: 'KC_DOWN' },
  { x: 17.25, y: 5, key: 'KC_RGHT' },

  { x: 18.5, y: 5, w: 2, key: 'KC_P0' },
  { x: 20.5, y: 5, key: 'KC_PDOT' },
  { x: 21.5, y: 5, key: 'KC_PENT' },
] satisfies { x: number; y: number; w?: number; h?: number; key?: string }[];

const BASIC_KEYS = BASIC_KEYS_POSITION.map((k) => k.key || 'KC_NOOP');

const BasicKeys = (
  props: Omit<
    ComponentProps<typeof Keymap>,
    'keyPositions' | 'baseWidth' | 'keys'
  >
) => {
  return (
    <Keymap
      keyPositions={BASIC_KEYS_POSITION}
      baseWidth={25}
      keys={BASIC_KEYS}
      {...props}
    />
  );
};

export const KeysPicker = ({
  onKeyClick,
}: Pick<ComponentProps<typeof Keymap>, 'onKeyClick'>) => {
  return (
    <div className="p-4">
      <BasicKeys onKeyClick={onKeyClick} />
    </div>
  );
};
