import { formatKeymap } from '../../../compile/formatKeymap';

describe('compile core formatKeymap', () => {
  it('should format basic keymap', () => {
    expect(
      formatKeymap({
        keyboardName: 'test',
        layout: 'layout_test',
        layers: [
          {
            id: 'id1',
            name: '1',
            keys: ['KC_A', 'KC_B', 'KC_C'],
          },
          {
            id: 'id2',
            name: '2',
            keys: ['KC_D', 'KC_E', 'KC_F'],
          },
        ],
      }),
    ).toBe(`#include QMK_KEYBOARD_H
enum test_layers {
  LAYER_1,
  LAYER_2,
};
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
  [LAYER_1] = layout_test(KC_A, KC_B, KC_C),
  [LAYER_2] = layout_test(KC_D, KC_E, KC_F),
};`);
  });

  it('should format basic keymap', () => {
    expect(
      formatKeymap({
        keyboardName: 'test',
        layout: 'layout_test',
        layers: [
          {
            id: 'id1',
            name: '1',
            keys: [
              'KC_A',
              'KC_B',
              'KC_C',
              {
                key: 'MO',
                params: [{ type: 'layer', value: 'id2' }],
              },
            ],
          },
          {
            id: 'id2',
            name: '2',
            keys: ['KC_D', 'KC_E', 'KC_F'],
          },
        ],
      }),
    ).toBe(`#include QMK_KEYBOARD_H
enum test_layers {
  LAYER_1,
  LAYER_2,
};
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
  [LAYER_1] = layout_test(KC_A, KC_B, KC_C, MO(LAYER_2)),
  [LAYER_2] = layout_test(KC_D, KC_E, KC_F),
};`);
  });
});
