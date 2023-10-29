import { Command } from 'commander';
import { readFile } from 'fs/promises';
import { compileKeymap } from '../../compile';
import { pipeline } from 'stream/promises';
import { createReadStream, createWriteStream } from 'fs';
import { server } from '../../server';

const QMK_FOLDER = process.env.QMK_FOLDER || './data/qmk_firmware';

export const prog = new Command();
prog
  .command('compile <keymap-json-path>')
  .option('-o, --output <output-path>')
  .action(async (keymapPath, options: { output?: string }) => {
    try {
      const json = JSON.parse((await readFile(keymapPath)).toString());
      console.log(`compiling`, json.keyboardQmkPath);

      await compileKeymap({
        qmkCwd: QMK_FOLDER,
        keymap: json,
        cleanBin: false,
        cleanKeymap: false,
        onBin: async ({ binPath }) => {
          if (options.output) {
            // NOTE: we do not use fs.rename to avoid EXDEV in case of docker bind
            await pipeline([
              createReadStream(binPath),
              createWriteStream(options.output),
            ]);
            console.log(`firmware copied to '${options.output}'`);
          }
        },
      });
      console.log('compiled');
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

prog.command('server').action(async () => {
  server();
});
