import { vol } from 'memfs';

import { parseKeyboardsFolder } from '../../parseKeyboardFolders';

jest.mock('fs/promises');

describe('parseKeybardsFolders', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    vol.reset();
  });

  it('should ignore folder without rules.mk', async () => {
    vol.fromNestedJSON({
      '/keyboards': {
        kb_1: {
          keymaps: {},
          'config.h': '',
          'info.json': JSON.stringify({}),
        },
      },
    });

    const onKBFolder = jest.fn();
    await parseKeyboardsFolder({ dir: '/keyboards' }, onKBFolder);
    expect(onKBFolder).not.toHaveBeenCalled();
  });

  it('should parse basic keyboard', async () => {
    const info = { name: 'kb_1' };

    vol.fromNestedJSON({
      '/keyboards': {
        kb_1: {
          keymaps: {},
          'config.h': '',
          'info.json': JSON.stringify(info),
          'rules.mk': '',
        },
      },
    });

    const onKBFolder = jest.fn();
    await parseKeyboardsFolder({ dir: '/keyboards' }, onKBFolder);
    expect(onKBFolder).toHaveBeenCalledTimes(1);
    expect(onKBFolder).toHaveBeenCalledWith({
      dir: '/keyboards/kb_1',
      infoJson: info,
      keymapsDir: '/keyboards/kb_1/keymaps',
    });
  });
  it('should parse revisions', async () => {
    const info = { name: 'kb_1' };

    vol.fromNestedJSON({
      '/keyboards': {
        kb_1: {
          keymaps: {},
          rev1: {
            'info.json': JSON.stringify({ name: 'kb_1/rev1' }),
            'rules.mk': '',
          },
          rev2: {
            'info.json': JSON.stringify({ name: 'kb_1/rev2' }),
            'rules.mk': '',
          },
          lib: {},
          'config.h': '',
          'info.json': JSON.stringify(info),
          'rules.mk': '',
        },
      },
    });

    const onKBFolder = jest.fn();
    await parseKeyboardsFolder({ dir: '/keyboards' }, onKBFolder);
    expect(onKBFolder).toHaveBeenCalledTimes(2);
    expect(onKBFolder).toHaveBeenCalledWith({
      dir: '/keyboards/kb_1/rev1',
      infoJson: { name: 'kb_1/rev1' },
      keymapsDir: '/keyboards/kb_1/keymaps',
    });
    expect(onKBFolder).toHaveBeenCalledWith({
      dir: '/keyboards/kb_1/rev2',
      infoJson: { name: 'kb_1/rev2' },
      keymapsDir: '/keyboards/kb_1/keymaps',
    });
  });
  it('should parse merge info.json when parsing rev', async () => {
    const info = { name: 'kb_1', manufacturer: 'test' };

    vol.fromNestedJSON({
      '/keyboards': {
        kb_1: {
          keymaps: {},
          rev1: {
            'info.json': JSON.stringify({ name: 'kb_1/rev1' }),
            'rules.mk': '',
          },
          'config.h': '',
          'info.json': JSON.stringify(info),
          'rules.mk': '',
        },
      },
    });

    const onKBFolder = jest.fn();
    await parseKeyboardsFolder({ dir: '/keyboards' }, onKBFolder);
    expect(onKBFolder).toHaveBeenCalledTimes(1);
    expect(onKBFolder).toHaveBeenCalledWith({
      dir: '/keyboards/kb_1/rev1',
      infoJson: { name: 'kb_1/rev1', manufacturer: 'test' },
      keymapsDir: '/keyboards/kb_1/keymaps',
    });
  });

  it('should use rev parent keymaps folder', async () => {
    vol.fromNestedJSON({
      '/keyboards': {
        kb_1: {
          keymaps: {},
          rev1: {
            'info.json': JSON.stringify({ name: 'kb_1/rev1' }),
            'rules.mk': '',
          },
          // 'config.h': '',
          // 'info.json': JSON.stringify(info),
          // 'rules.mk': '',
        },
      },
    });

    const onKBFolder = jest.fn();
    await parseKeyboardsFolder({ dir: '/keyboards' }, onKBFolder);
    expect(onKBFolder).toHaveBeenCalledTimes(1);
    expect(onKBFolder).toHaveBeenCalledWith({
      dir: '/keyboards/kb_1/rev1',
      infoJson: { name: 'kb_1/rev1' },
      keymapsDir: '/keyboards/kb_1/keymaps',
    });
  });

  it('should use rev keymaps folder instead of parent', async () => {
    const info = { name: 'kb_1' };

    vol.fromNestedJSON({
      '/keyboards': {
        kb_1: {
          keymaps: {},
          rev1: {
            keymaps: {},
            'info.json': JSON.stringify({ name: 'kb_1/rev1' }),
            'rules.mk': '',
          },
          'config.h': '',
          'info.json': JSON.stringify(info),
          'rules.mk': '',
        },
      },
    });

    const onKBFolder = jest.fn();
    await parseKeyboardsFolder({ dir: '/keyboards' }, onKBFolder);
    expect(onKBFolder).toHaveBeenCalledTimes(1);
    expect(onKBFolder).toHaveBeenCalledWith({
      dir: '/keyboards/kb_1/rev1',
      infoJson: { name: 'kb_1/rev1' },
      keymapsDir: '/keyboards/kb_1/rev1/keymaps',
    });
  });
  it('should parse brand folder keyboards', async () => {
    const info = { name: 'kb_1' };

    vol.fromNestedJSON({
      '/keyboards': {
        brand: {
          kb_1: {
            keymaps: {},
            rev1: {
              keymaps: {},
              'info.json': JSON.stringify({ name: 'kb_1/rev1' }),
              'rules.mk': '',
            },
            'config.h': '',
            'info.json': JSON.stringify(info),
            'rules.mk': '',
          },
          kb_2: {
            keymaps: {},
            'info.json': JSON.stringify({ name: 'kb_2' }),
            'rules.mk': '',
          },
        },
      },
    });

    const onKBFolder = jest.fn();
    await parseKeyboardsFolder({ dir: '/keyboards' }, onKBFolder);
    expect(onKBFolder).toHaveBeenCalledTimes(2);
    expect(onKBFolder).toHaveBeenCalledWith({
      dir: '/keyboards/brand/kb_1/rev1',
      infoJson: { name: 'kb_1/rev1' },
      keymapsDir: '/keyboards/brand/kb_1/rev1/keymaps',
    });
    expect(onKBFolder).toHaveBeenCalledWith({
      dir: '/keyboards/brand/kb_2',
      infoJson: { name: 'kb_2' },
      keymapsDir: '/keyboards/brand/kb_2/keymaps',
    });
  });
});
