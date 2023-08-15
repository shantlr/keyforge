import { vol } from 'memfs';
import { getKeyboardInfo } from '../../compile';

jest.mock('fs/promises');

describe('compile getKeyboardInfo', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    vol.reset();
  });

  it('should find basic keyboard', async () => {
    vol.fromNestedJSON({
      '/keyboards': {
        kb_1: {
          'info.json': JSON.stringify({ name: 'kb_1/rev1' }),
          'rules.mk': '',
        },
      },
    });

    const res = await getKeyboardInfo({
      revPath: 'kb_1',
      keyboardsDir: '/keyboards',
    });
    expect(res).toEqual({
      info: {
        name: 'kb_1/rev1',
      },
      keyboardRevPath: '/keyboards/kb_1',
      keymapsPath: '/keyboards/kb_1/keymaps',
    });
  });

  it('should find revision keyboard', async () => {
    vol.fromNestedJSON({
      '/keyboards': {
        kb_1: {
          keymaps: {},
          rev_1: {
            'info.json': JSON.stringify({ name: 'kb_1/rev1' }),
            'rules.mk': '',
          },
        },
      },
    });

    const res = await getKeyboardInfo({
      revPath: 'kb_1/rev_1',
      keyboardsDir: '/keyboards',
    });
    expect(res).toEqual({
      info: {
        name: 'kb_1/rev1',
      },
      keyboardRevPath: '/keyboards/kb_1/rev_1',
      keymapsPath: '/keyboards/kb_1/keymaps',
    });
  });

  it('should find most specific keymaps folder', async () => {
    vol.fromNestedJSON({
      '/keyboards': {
        kb_1: {
          rev_1: {
            keymaps: {},
            'info.json': JSON.stringify({ name: 'kb_1/rev1' }),
            'rules.mk': '',
          },
        },
      },
    });

    const res = await getKeyboardInfo({
      revPath: 'kb_1/rev_1',
      keyboardsDir: '/keyboards',
    });
    expect(res).toEqual({
      info: {
        name: 'kb_1/rev1',
      },
      keyboardRevPath: '/keyboards/kb_1/rev_1',
      keymapsPath: '/keyboards/kb_1/rev_1/keymaps',
    });
  });

  it('should merge info.json', async () => {
    vol.fromNestedJSON({
      '/keyboards': {
        kb_1: {
          rev_1: {
            keymaps: {},
            'info.json': JSON.stringify({ name: 'kb_1/rev1' }),
            'rules.mk': '',
          },
          'info.json': JSON.stringify({
            manufacturer_name: 'test_company',
          }),
        },
      },
    });

    const res = await getKeyboardInfo({
      revPath: 'kb_1/rev_1',
      keyboardsDir: '/keyboards',
    });
    expect(res).toEqual({
      info: {
        name: 'kb_1/rev1',
        manufacturer_name: 'test_company',
      },
      keyboardRevPath: '/keyboards/kb_1/rev_1',
      keymapsPath: '/keyboards/kb_1/rev_1/keymaps',
    });
  });
});
