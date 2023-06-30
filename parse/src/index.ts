import { readFile } from 'fs/promises';
import { parserCFile } from './parser';

const main = async () => {
  const content = (await readFile('./data/test.c')).toString();

  const ast = parserCFile(content);
  console.log('AST::');
  console.log(JSON.stringify(ast, null, 2));
};
main();
