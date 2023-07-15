import { mkdir, readdir, writeFile } from 'fs/promises';
import path from 'path';

import { cloneDeep, forEach, uniq } from 'lodash';
import { Command } from 'commander';

import { parseFileToContext } from './parser';
import { AstContext, Context } from './parser/astToContext';
import { parseKeyboardsFolder } from './parseKeyboardFolders';

const parseKeyboardLayouts = (context: AstContext) => {
  const keymaps = context.identifiers.keymaps;

  if (!keymaps) {
    throw new Error(`Variable 'keymaps' not found`);
  }

  if (keymaps.type !== 'var') {
    throw new Error(
      `Identifier 'keymaps' is a '${keymaps.type}' but expected a variable`,
    );
  }

  if (typeof keymaps.value !== 'object' || keymaps.value.type !== 'array') {
    throw new Error(
      `Variable 'keymaps' expected to be an array but received: ${JSON.stringify(
        keymaps.value,
      )}`,
    );
  }

  const layers: {
    name: string;
    keys: string[];
  }[] = [];
  forEach(keymaps.value.values, (v, key) => {
    if (typeof v === 'object' && v.type === 'postCall' && v.calls.length == 1) {
      const keys = v.calls[0];
      layers.push({
        name: key,
        keys: keys.map((k) => {
          if (typeof k === 'string') {
            return k;
          }
          if (typeof k === 'object' && k.type === 'fnCall') {
            return `${k.name}(${k.params.map((p) => p).join(', ')})`;
          }
        }),
      });
    } else {
      throw new Error(`UNHANDLED LAYER: ${JSON.stringify(v)}`);
    }
  });

  return layers;
  // console.log(keymaps.value.values);
};

export const parseKeymaps = async (
  dir: string,
  onKeymap: (input: {
    dir: string;
    keymapPath: string;
  }) => Promise<void> | void,
) => {
  const files = await readdir(dir, { withFileTypes: true });
  const keymap = files.find((f) => f.name === 'keymap.c');

  if (keymap) {
    await onKeymap({ dir, keymapPath: path.resolve(dir, keymap.name) });
  } else {
    const subdirs = files.filter((f) => f.isDirectory());
    await Promise.all(
      subdirs.map(async (subdir) => {
        await parseKeymaps(path.resolve(dir, subdir.name), onKeymap);
      }),
    );
  }
};

const main = async () => {
  const prog = new Command();

  prog
    .command('parse <keyboard-folder> <output-folder', {
      isDefault: true,
    })
    .option('-i, --include <file>', 'include file')
    .action(async (keyboardsFolder, outputDir, options) => {
      const context: Context = { identifiers: {} };
      if (typeof options.include === 'string') {
        await parseFileToContext(options.include, context);
      }

      const stats = {
        totalKeyboards: 0,
        totalKeymaps: 0,
        parsedKeymaps: 0,
      };

      const keyboardList = [];
      await parseKeyboardsFolder(
        keyboardsFolder,
        async ({ dir, infoJson, keymapsDir }) => {
          stats.totalKeyboards += 1;

          const keyboardPath = path.relative(keyboardsFolder, dir);
          const mappedKBName = keyboardPath.replace(/\//g, '_');

          // for easier navigation we put use keyboard name first character as parent directory
          // planck/rev7 => p/planck_rev7
          const outputKeyboardDir = path.resolve(
            outputDir,
            mappedKBName[0],
            mappedKBName,
          );
          await mkdir(outputKeyboardDir, { recursive: true });

          const keymaps: string[] = [];
          await parseKeymaps(
            keymapsDir,
            async ({ dir: keymapDir, keymapPath }) => {
              stats.totalKeymaps += 1;

              const { name: keymapName } = path.parse(keymapDir);
              const outputKeymapDir = path.resolve(
                outputKeyboardDir,
                keymapName,
              );

              try {
                const res = await parseFileToContext(
                  keymapPath,
                  cloneDeep(context),
                );
                const layers = parseKeyboardLayouts(res);
                if (layers.length) {
                  await mkdir(outputKeymapDir, { recursive: true });
                  await writeFile(
                    path.resolve(outputKeymapDir, 'layout.json'),
                    JSON.stringify({ name: keymapName, layers }),
                  );
                  stats.parsedKeymaps += 1;
                  keymaps.push(keymapName);
                  console.log(`keymap ${name}/${keymapName} parsed`);
                }
              } catch (err) {
                console.error(`failed to parse ${keymapPath}`);
              }
            },
          );

          infoJson.keymaps = keymaps;
          await writeFile(
            path.resolve(outputKeyboardDir, 'info.json'),
            JSON.stringify(infoJson),
          );
          keyboardList.push({
            name: infoJson.keyboard_name || keyboardPath,
            path: path.relative(outputDir, outputKeyboardDir),
          });
        },
      );
      await writeFile(
        path.resolve(outputDir, 'list.json'),
        JSON.stringify(uniq(keyboardList)),
      );

      console.log('Total keyboards', stats.totalKeyboards);
      console.log(
        'Parsed keymaps',
        stats.parsedKeymaps,
        '/',
        stats.totalKeymaps,
        `(${((stats.parsedKeymaps / stats.totalKeymaps) * 100).toFixed(2)}%)`,
      );
    });

  await prog.parseAsync(process.argv);
  // const content = (await readFile('./data/keymap3.c')).toString();
  // const ast = parseC(content);
  // console.log('AST::');
  // console.log(JSON.stringify(ast, null, 2));
  // const context = astToContext(ast);
  // console.log('CONTEXT', context);
  // const layouts = parseKeyboardLayouts(context);
  // console.log('LAYOUTS');
  // console.log(JSON.stringify(layouts, null, 2));
};
main().catch((err) => {
  console.log(err, `main failed (exiting...)`);
  process.exit(1);
});
