import { readFile } from 'fs/promises';

import { forEach } from 'lodash';
import { Command, program } from 'commander';

import { parseC, parseFileToContext } from './parser';
import { AstContext, Context, astToContext } from './parser/astToContext';

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

  forEach(keymaps.value.values, (v, key) => {
    if (typeof v === 'object' && v.type === 'postCall' && v.calls.length == 1) {
      const keys = v.calls[0];
      console.log('LAYER', key, keys);
    } else {
      throw new Error(`UNHANDLED LAYER: ${JSON.stringify(v)}`);
    }
  });
  console.log(keymaps.value.values);
};

const main = async () => {
  const prog = new Command();

  prog
    .command('parse', {
      isDefault: true,
    })
    .option('-i, --include <file>', 'include header file')

    .action(async (options) => {
      console.log(options);
      const context: Context = { identifiers: {} };
      if (typeof options.include === 'string') {
        await parseFileToContext(options.include, context);
      }
      console.log(context);
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
