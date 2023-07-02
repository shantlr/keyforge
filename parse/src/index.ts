import { readFile } from 'fs/promises';
import { parseC } from './parser';

const main = async () => {
  const content = (await readFile('./data/keymap3.c')).toString();

  const ast = parseC(content);
  console.log('AST::');
  console.log(JSON.stringify(ast, null, 2));
};
main();
