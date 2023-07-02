import { readFile } from 'fs/promises';
import { StatementsNode, parseC } from './parser';

const parseKeyboardLayouts = (ast: StatementsNode) => {};

const main = async () => {
  const content = (await readFile('./data/keymap3.c')).toString();

  const ast = parseC(content);
  console.log('AST::');
  console.log(JSON.stringify(ast, null, 2));

  const layouts = parseKeyboardLayouts(ast);
  console.log('LAYOUTS');
  console.log(JSON.stringify(layouts, null, 2));
};
main();
