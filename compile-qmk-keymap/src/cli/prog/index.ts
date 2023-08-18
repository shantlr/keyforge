import { Command } from 'commander';
import { readFile } from 'fs/promises';
import { compileKeymap } from '../../compile';

export const prog = new Command();
prog.command('compile [keymap-json-path]').action(async (keymapPath) => {
  try {
    const json = JSON.parse((await readFile(keymapPath)).toString());
    await compileKeymap({
      qmkCwd: './data/qmk_firmware',
      keyboard: json.keyboard,
      keymap: {
        keyboardName: json.keyboard,
        layers: json.layers,
        layout: json.layout,
      },
      cleanBin: false,
      cleanKeymap: false,
    });
    console.log(json);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`Could not find keymap json at '${keymapPath}'`, err);
      return;
    }
    if (err instanceof SyntaxError) {
      console.log('Could not parse keymap json', err);
      return;
    }
    throw err;
  }
});
