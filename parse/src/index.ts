import chalk from 'chalk';
import {
  CstParser,
  Lexer,
  MismatchedTokenException,
  createToken,
} from 'chevrotain';
import { readFile } from 'fs/promises';
import { lexer, parser } from './parser';
import { ToAst } from './toAst';

// Very simplified c parser
// Should be just enough to compute layouts

const main = async () => {
  const content = (await readFile('./data/keymap.c')).toString();

  const lexRes = lexer.tokenize(content);
  // console.log('tokens', lexRes.tokens);
  parser.input = lexRes.tokens;
  // @ts-ignore
  const parseRes = parser.statements();

  if (parser.errors.length) {
    console.log('ERRORS:');
    parser.errors.forEach((err) => {
      if (err instanceof MismatchedTokenException) {
        console.log(err);
        console.log(`RULE:`, err.context.ruleStack.join(' > '));
        console.log('AT:');
        const off = err.token.startOffset;

        console.log(
          `${content.slice(off - 30, off)}${chalk.red(
            content[off]
          )}${content.slice(off + 1, off + 30)}`
        );
      }
    });
  } else if (parseRes) {
    console.log('RES:', JSON.stringify(parseRes, null, 2));
    console.log('---');
    console.log('---');

    const visitor = new ToAst();
    const ast = visitor.visit(parseRes);
    console.log('AST::');
    console.log(JSON.stringify(ast, null, 2));
  }
  // console.log('ERRORS', parser.errors);
  // const res = lexer.tokenize(content);
  // console.log(res);
};
main();
