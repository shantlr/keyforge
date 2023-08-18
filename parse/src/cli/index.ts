import path from 'path';
import { mkdir, writeFile } from 'fs/promises';

import { Command } from 'commander';
import { cloneDeep, forEach } from 'lodash';

import { AstContext, Context } from '../parser/astToContext';
import { parseFileToContext } from '../parser';
import { parseKeyboardsFolder } from '../parseKeyboardFolders';
import { parseKeymaps } from '../parseKeymaps';

export const prog = new Command();

const parseKeyboardLayouts = (
  context: AstContext,
  keybardInfo: {
    layouts: Record<string, any>;
    layout_aliases?: Record<string, string>;
  },
) => {
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
  let layout = null;

  forEach(keymaps.value.values, (v, key) => {
    if (typeof v === 'object' && v.type === 'postCall' && v.calls.length == 1) {
      if (typeof v.fn === 'string') {
        if (typeof layout === 'string') {
          if (layout !== v.fn) {
            throw new Error(`keymap seems to be using several layout ?`);
          }
        } else {
          layout = v.fn;
          if (
            keybardInfo.layout_aliases &&
            v.fn in keybardInfo.layout_aliases
          ) {
            layout = keybardInfo.layout_aliases[v.fn];
          }
        }
      }

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

  if (!layout) {
    throw new Error('Failed to find used layout');
  }

  return {
    layout,
    layers,
  };
};

prog
  .command('parse <keyboard-folder> <output-folder', {
    isDefault: true,
  })
  .option('-i, --include <file>', 'include file')
  .action(async (keyboardsFolder: string, outputDir: string, options) => {
    const USE_INTIAL_AS_SUBFOLDER = true;
    const context: Context = { identifiers: {} };
    if (typeof options.include === 'string') {
      await parseFileToContext(options.include, context);
    }

    const stats = {
      totalKeyboards: 0,
      totalKeymaps: 0,
      parsedKeymaps: 0,
      started_at: new Date(),
      ended_at: null,
    };

    const keyboardList = [];
    await parseKeyboardsFolder(
      {
        dir: keyboardsFolder,
      },
      async ({ dir, infoJson, keymapsDir }) => {
        stats.totalKeyboards += 1;

        const keyboardPath = path.relative(keyboardsFolder, dir);
        const mappedKBName = keyboardPath.replace(/\//g, '_');

        // for easier navigation we put use keyboard name first character as parent directory
        // planck/rev7 => p/planck_rev7
        const outputKeyboardDir = USE_INTIAL_AS_SUBFOLDER
          ? path.resolve(outputDir, mappedKBName[0], mappedKBName)
          : path.resolve(outputDir, mappedKBName);
        await mkdir(outputKeyboardDir, { recursive: true });

        const keymaps: string[] = [];
        if (!keymapsDir) {
          console.warn(`${keyboardPath} has no keymaps`);
        } else {
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
                const { layout, layers } = parseKeyboardLayouts(res, infoJson);
                if (layers.length) {
                  await mkdir(outputKeymapDir, { recursive: true });
                  await writeFile(
                    path.resolve(outputKeymapDir, 'layout.json'),
                    JSON.stringify({ name: keymapName, layout, layers }),
                  );
                  stats.parsedKeymaps += 1;
                  keymaps.push(keymapName);
                  console.log(`keymap ${mappedKBName}/${keymapName} parsed`);
                }
              } catch (err) {
                console.error(`failed to parse ${keymapPath}`);
              }
            },
          );
        }

        infoJson.keymaps = keymaps;
        await writeFile(
          path.resolve(outputKeyboardDir, 'info.json'),
          JSON.stringify(infoJson),
        );
        keyboardList.push({
          name: infoJson.keyboard_name || keyboardPath,
          key: mappedKBName,
          qmkpath: keyboardPath,
        });
      },
    );
    await writeFile(
      path.resolve(outputDir, 'list.json'),
      JSON.stringify({
        use_path_initial_prefix: USE_INTIAL_AS_SUBFOLDER,
        list: keyboardList,
      }),
    );
    stats.ended_at = new Date();

    console.log('Total keyboards', stats.totalKeyboards);
    console.log(
      'Parsed keymaps',
      stats.parsedKeymaps,
      '/',
      stats.totalKeymaps,
      `(${((stats.parsedKeymaps / stats.totalKeymaps) * 100).toFixed(2)}%)`,
    );
    console.log(
      'duration',
      (
        (stats.ended_at.valueOf() - stats.started_at.valueOf()) /
        1000 /
        60
      ).toFixed(1),
      'min',
    );
  });
