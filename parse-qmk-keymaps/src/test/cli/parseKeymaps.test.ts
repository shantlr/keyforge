import { vol } from 'memfs';

import { parseKeymaps } from '../../parseKeymaps';

jest.mock('fs/promises');

describe('parse keymaps', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    vol.reset();
  });

  it('should ignore folder that does not contain keymap.c', async () => {
    vol.fromNestedJSON({
      '/keymaps': {
        default: {},
      },
    });

    const onKM = jest.fn();
    await parseKeymaps('/keymaps', onKM);
    expect(onKM).not.toHaveBeenCalled();
  });
  it('should parse folder containing keymap.c', async () => {
    vol.fromNestedJSON({
      '/keymaps': {
        default: {
          'keymap.c': ``,
        },
        km1: {
          'keymap.c': ``,
        },
      },
    });

    const onKM = jest.fn();
    await parseKeymaps('/keymaps', onKM);
    expect(onKM).toHaveBeenCalledTimes(2);
    expect(onKM).toHaveBeenCalledWith({
      dir: '/keymaps/default',
      keymapPath: '/keymaps/default/keymap.c',
    });
    expect(onKM).toHaveBeenCalledWith({
      dir: '/keymaps/km1',
      keymapPath: '/keymaps/km1/keymap.c',
    });
  });
});
