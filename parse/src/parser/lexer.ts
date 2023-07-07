import { Lexer, TokenType, createToken } from 'chevrotain';
import { map, mapValues, orderBy } from 'lodash';

const createTokens = <T>(tokens: {
  [key in keyof T]: {
    pattern: string | RegExp;
    group?: string;

    /**
     * Higher value mean higher priority
     */
    priority?: number;
  };
}) => {
  const tokenMap: {
    [key in keyof T]: TokenType;
  } = mapValues(tokens, (v, k) =>
    createToken(
      v.group
        ? {
            name: k,
            pattern: v.pattern,
            group: v.group,
          }
        : {
            name: k,
            pattern: v.pattern,
          },
    ),
  );

  return {
    tokenMap,
    tokenList: orderBy(
      map(tokenMap) as TokenType[],
      [
        (t) => tokens[t.name]?.priority ?? 0,
        (t) => {
          return t.PATTERN?.toString().length;
        },
      ],
      ['desc', 'desc'],
    ),
  };
};

export const { tokenMap: TOKENS, tokenList: TOKEN_LIST } = createTokens({
  multiLineComment: {
    pattern: /\/\*([\s\S]*?)\*\//,
    group: Lexer.SKIPPED,
    priority: 1000,
  },
  comment: {
    pattern: /\/\/.*/,
    group: Lexer.SKIPPED,
    priority: 900,
  },
  ws: {
    pattern: /\s+/,
    group: Lexer.SKIPPED,
    priority: 800,
  },
  string: {
    pattern: /"[^"]*"/,
    priority: 700,
  },
  hexa: { pattern: /0x[A-F0-9]+/, priority: 600 },
  num: { pattern: /\d+/, priority: 500 },
  identifier: { pattern: /[a-zA-Z0-9_]+/, priority: -100 },

  include: { pattern: '#include' },
  define: { pattern: '#define' },
  ifdef: { pattern: '#ifdef' },
  pragma: { pattern: '#pragma' },
  preprocIf: { pattern: '#if' },
  preprocElif: { pattern: '#elif' },
  preprocElse: { pattern: '#else' },
  endif: { pattern: '#endif' },

  shiftRight: { pattern: '>>' },
  shiftLeft: { pattern: '<<' },

  enum: { pattern: 'enum' },
  void: { pattern: 'void' },
  if: { pattern: 'if' },
  else: { pattern: 'else' },
  while: { pattern: 'while' },
  do: { pattern: 'do' },
  continue: { pattern: 'continue' },
  break: { pattern: 'break' },
  return: { pattern: 'return' },
  true: { pattern: 'true' },
  false: { pattern: 'false' },
  dot: { pattern: '.' },
  switch: { pattern: 'switch' },
  case: { pattern: 'case' },
  default: { pattern: 'default' },
  colon: { pattern: ':' },
  arrow: { pattern: '->' },
  tilde: { pattern: '~' },
  excl: { pattern: '!' },

  const: { pattern: 'const' },
  blockStart: { pattern: '{' },
  blockEnd: { pattern: '}' },
  bracketStart: { pattern: '[' },
  bracketEnd: { pattern: ']' },
  comma: { pattern: ',' },
  semicolon: { pattern: ';' },
  pthStart: { pattern: '(' },
  pthEnd: { pattern: ')' },
  equality: { pattern: '==' },
  diff: { pattern: '!=' },
  equal: { pattern: '=' },
  gte: { pattern: '>=' },
  gt: { pattern: '>' },
  lte: { pattern: '<=' },
  lt: { pattern: '<' },
  inc: { pattern: '++' },
  dec: { pattern: '--' },
  percent: { pattern: '%' },
  plus: { pattern: '+' },
  minus: { pattern: '-' },
  asterisk: { pattern: '*' },
  slash: { pattern: '/' },
  question: { pattern: '?' },
  and: { pattern: '&&' },
  amp: { pattern: '&' },
  or: { pattern: '||' },
  pipe: { pattern: '|' },
});

export const lexer = new Lexer(TOKEN_LIST);
