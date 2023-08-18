import { formatKeymap } from '../../../compile/formatKeymap';

describe('compile core formatKeymap', () => {
  it('should format basic keymap', () => {
    expect(
      formatKeymap({
        keyboardName: 'test',
        layout: 'layout_test',
        layers: [
          {
            name: '1',
            keys: ['KC_A', 'KC_B', 'KC_C'],
          },
          {
            name: '2',
            keys: ['KC_D', 'KC_E', 'KC_F'],
          },
        ],
      }),
    ).toBe(`#include QMK_KEYBOARD_H
enum test_layers {
  LAYER_1 = SAFE_RANGE,
  LAYER_2,
}
const uint16_t PROGMEM keymaps [][MATRIX_ROWS][MATRIX_COLS] = {
  [LAYER_1] = layout_test(KC_A, KC_B, KC_C),
  [LAYER_2] = layout_test(KC_D, KC_E, KC_F),
}`);
  });
});
