import { readFile } from 'fs/promises';

import { MismatchedTokenException, NoViableAltException } from 'chevrotain';
import chalk from 'chalk';

import { parser } from './parser';
import { toCAst } from './toAst';
import { StatementsNode } from './types';
import { Context, astToContext } from './astToContext';
import { lexer } from './lexer';

export * from './types';
export { parser } from './parser';
export { lexer } from './lexer';

export const parseC = (
  content: string,
  callParserRule = (p: typeof parser) => p.statements(),
  opt?: { debug: boolean },
) => {
  const lexRes = lexer.tokenize(content);

  parser.input = lexRes.tokens;

  const cst = callParserRule(parser);

  if (parser.errors.length) {
    if (opt?.debug) {
      console.log('ERRORS:');
      parser.errors.forEach((err) => {
        if (err instanceof MismatchedTokenException) {
          console.log(err);
          console.log(`RULE:`, err.context.ruleStack.join(' > '));
          console.log('AT:');
          const off = err.token.startOffset;

          console.log(
            `${content.slice(off - 50, off)}${chalk.red(
              content[off],
            )}${content.slice(off + 1, off + 50)}`,
          );
        } else if (err instanceof NoViableAltException) {
          console.log(err);
          console.log(`RULE:`, err.context.ruleStack.join(' > '));
          console.log('AT:');

          const off = err.token.startOffset;
          console.log(
            `${content.slice(off - 50, off)}${chalk.red(
              content[off],
            )}${content.slice(off + 1, off + 50)}`,
          );
        } else {
          console.log(err);
        }
      });
    }
    // @ts-ignore
    throw new Error('FAILED TO PARSE', { cause: parser.errors });
  } else if (cst) {
    // console.log('RES:', JSON.stringify(parseRes, null, 2));
    // console.log('---');
    // console.log('---');

    const ast = toCAst(cst);

    return ast as StatementsNode;
  }
};

export const parseFileToContext = async (
  filePath: string,
  context?: Context,
) => {
  const content = (await readFile(filePath)).toString();

  const ast = parseC(content);
  return astToContext(ast, context);
};
