import { prog } from './cli';

const main = async () => {
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
