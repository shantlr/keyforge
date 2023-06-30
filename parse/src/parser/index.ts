import { MismatchedTokenException, NoViableAltException } from 'chevrotain';
import { lexer, parser } from './parser';
import chalk from 'chalk';
import { ToAst } from './toAst';
import { StatementsNode } from './types';

export * from './types';
export { ToAst } from './toAst';
export { lexer, parser } from './parser';

export const parserCFile = (fileContent: string) => {
  const lexRes = lexer.tokenize(fileContent);

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
          `${fileContent.slice(off - 30, off)}${chalk.red(
            fileContent[off]
          )}${fileContent.slice(off + 1, off + 30)}`
        );
      } else if (err instanceof NoViableAltException) {
        console.log(err);
        console.log(`RULE:`, err.context.ruleStack.join(' > '));
        console.log('AT:');

        const off = err.token.startOffset;
        console.log(
          `${fileContent.slice(off - 30, off)}${chalk.red(
            fileContent[off]
          )}${fileContent.slice(off + 1, off + 30)}`
        );
      } else {
        console.log(err);
      }
    });
    // @ts-ignore
    throw new Error('FAILED TO PARSE', { cause: parser.errors });
    // return null;
  } else if (parseRes) {
    console.log('RES:', JSON.stringify(parseRes, null, 2));
    console.log('---');
    console.log('---');

    const visitor = new ToAst();
    const ast = visitor.visit(parseRes);

    return ast as StatementsNode;
  }
};
