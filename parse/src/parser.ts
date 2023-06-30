import { CstParser, Lexer, createToken } from 'chevrotain';

const TOKENS = {
  multiLineComment: createToken({
    name: 'mlComment',
    pattern: /\/\*[\s\S]*\*\//,
    group: Lexer.SKIPPED,
  }),
  comment: createToken({
    name: 'comment',
    pattern: /\/\/.*/,
    group: Lexer.SKIPPED,
  }),
  ws: createToken({
    name: 'ws',
    pattern: /\s+/,
    group: Lexer.SKIPPED,
  }),
  string: createToken({
    name: 'string',
    pattern: /"[^"]*"/,
  }),

  include: createToken({ name: 'include', pattern: '#include' }),
  define: createToken({ name: 'define', pattern: '#define' }),
  enum: createToken({ name: 'enum', pattern: 'enum' }),

  const: createToken({
    name: 'const',
    pattern: 'const',
  }),
  blockStart: createToken({
    name: 'blockStart',
    pattern: '{',
  }),
  blockEnd: createToken({
    name: 'blockEnd',
    pattern: '}',
  }),
  bracketStart: createToken({
    name: 'bracketStart',
    pattern: '[',
  }),
  bracketEnd: createToken({
    name: 'bracketEnd',
    pattern: ']',
  }),
  comma: createToken({
    name: 'comma',
    pattern: ',',
  }),
  semicolon: createToken({
    name: 'semicolon',
    pattern: ';',
  }),
  pthStart: createToken({
    name: 'pthStart',
    pattern: '(',
  }),
  pthEnd: createToken({
    name: 'pthEnd',
    pattern: ')',
  }),
  equal: createToken({
    name: 'equal',
    pattern: '=',
  }),
  gte: createToken({
    name: 'gte',
    pattern: '>=',
  }),
  gt: createToken({
    name: 'gt',
    pattern: '>',
  }),
  lte: createToken({
    name: 'lte',
    pattern: '<=',
  }),
  lt: createToken({
    name: 'lt',
    pattern: '<',
  }),

  num: createToken({ name: 'num', pattern: /\d+/ }),
  identifier: createToken({ name: 'identifier', pattern: /[a-zA-Z0-9-_]+/ }),
};

const allTokens = [
  TOKENS.multiLineComment,
  TOKENS.comment,
  TOKENS.ws,
  TOKENS.string,

  // Keywords
  TOKENS.enum,
  TOKENS.define,
  TOKENS.include,
  TOKENS.const,

  TOKENS.comma,
  TOKENS.semicolon,
  TOKENS.blockStart,
  TOKENS.blockEnd,
  TOKENS.bracketStart,
  TOKENS.bracketEnd,
  TOKENS.pthStart,
  TOKENS.pthEnd,
  TOKENS.equal,
  TOKENS.gte,
  TOKENS.gt,
  TOKENS.lte,
  TOKENS.lt,

  TOKENS.num,
  TOKENS.identifier,
];

export const lexer = new Lexer(allTokens);

class CParser extends CstParser {
  constructor() {
    super(allTokens);

    const $ = this;
    $.RULE('statements', () => {
      $.MANY(() => {
        // @ts-ignore
        $.SUBRULE($.statement);
      });
    });
    $.RULE('statement', () => {
      $.OR([
        {
          ALT: () => {
            // @ts-ignore
            $.SUBRULE($.defineDeclaration);
          },
        },
        {
          ALT: () => {
            // @ts-ignore
            $.SUBRULE($.includeStatement);
          },
        },
        {
          ALT: () => {
            // @ts-ignore
            $.SUBRULE($.enumDeclaration);
          },
        },
        {
          ALT: () => {
            // @ts-ignore
            $.SUBRULE($.varDeclaration);
          },
        },
      ]);
    });

    $.RULE('defineDeclaration', () => {
      $.CONSUME(TOKENS.define);
      $.CONSUME(TOKENS.identifier, {
        LABEL: 'name',
      });
      // @ts-ignore
      $.SUBRULE($.valueExpression, {
        LABEL: 'value',
      });
    });
    $.RULE('includeStatement', () => {
      $.CONSUME(TOKENS.include);
      $.OR([
        {
          // include using define
          ALT: () => {
            $.CONSUME(TOKENS.string);
          },
        },
        {
          // include using define
          ALT: () => {
            $.CONSUME(TOKENS.identifier);
          },
        },
      ]);
    });

    $.RULE('enumDeclaration', () => {
      $.CONSUME(TOKENS.enum);
      $.CONSUME1(TOKENS.identifier, {
        LABEL: 'name',
      });
      $.CONSUME(TOKENS.blockStart);

      // enum values
      $.AT_LEAST_ONE_SEP({
        SEP: TOKENS.comma,
        // enum value assignation
        DEF: () => {
          // @ts-ignore
          $.SUBRULE($.enumOption);
        },
      });

      $.CONSUME(TOKENS.blockEnd);
      $.CONSUME(TOKENS.semicolon);
    });
    $.RULE('enumOption', () => {
      $.CONSUME(TOKENS.identifier, {
        LABEL: 'name',
      });
      $.OPTION(() => {
        $.CONSUME(TOKENS.equal);
        // @ts-ignore
        $.SUBRULE($.valueExpression, {
          LABEL: 'value',
        });
      });
    });

    $.RULE('varDeclaration', () => {
      $.OPTION(() => {
        $.CONSUME(TOKENS.const);
      });
      // type
      $.CONSUME1(TOKENS.identifier, {
        LABEL: 'type',
      });

      // progmem
      $.OPTION1(() => {
        $.CONSUME2(TOKENS.identifier, {
          LABEL: 'progmem',
        });
      });

      // var name
      $.CONSUME3(TOKENS.identifier, {
        LABEL: 'name',
      });

      // array
      $.MANY(() => {
        // @ts-ignore
        $.SUBRULE($.varArrayDeclaration);
      });

      $.CONSUME(TOKENS.equal);

      // @ts-ignore
      $.SUBRULE2($.valueExpression);
      $.CONSUME(TOKENS.semicolon);
    });
    $.RULE('varArrayDeclaration', () => {
      $.CONSUME(TOKENS.bracketStart);
      $.OPTION2(() => {
        // @ts-ignore
        $.SUBRULE1($.valueExpression);
      });
      $.CONSUME(TOKENS.bracketEnd);
    });

    $.RULE('arrayDefinition', () => {
      $.CONSUME(TOKENS.blockStart);
      $.MANY_SEP({
        SEP: TOKENS.comma,
        DEF: () => {
          // @ts-ignore
          $.SUBRULE($.arrayItemDefinition, {
            LABEL: 'items',
          });
        },
      });
      $.CONSUME(TOKENS.blockEnd);
    });
    $.RULE('arrayItemDefinition', () => {
      $.CONSUME(TOKENS.bracketStart);
      $.CONSUME(TOKENS.identifier, {
        LABEL: 'index',
      });
      $.CONSUME(TOKENS.bracketEnd);
      $.CONSUME(TOKENS.equal);
      // @ts-ignore
      $.SUBRULE($.valueExpression, {
        LABEL: 'value',
      });
    });

    $.RULE('fnCall', () => {
      $.CONSUME(TOKENS.identifier, {
        LABEL: 'name',
      });
      $.CONSUME(TOKENS.pthStart);
      $.MANY_SEP({
        SEP: TOKENS.comma,
        DEF: () => {
          // @ts-ignore
          $.SUBRULE($.valueExpression, {
            LABEL: 'params',
          });
        },
      });
      $.CONSUME(TOKENS.pthEnd);
    });

    $.RULE('valueExpression', () => {
      $.OR([
        {
          ALT: () => {
            // @ts-ignore
            $.SUBRULE($.fnCall);
          },
        },

        {
          ALT: () => {
            $.CONSUME1(TOKENS.identifier);
          },
        },
        {
          // array
          ALT: () => {
            // @ts-ignore
            $.SUBRULE($.arrayDefinition);
          },
        },
        {
          ALT: () => {
            $.CONSUME(TOKENS.num);
          },
        },
        // {
        //   ALT: () => {
        //     $.CONSUME2(TOKENS.identifier);
        //   },
        // },
      ]);
    });

    this.performSelfAnalysis();
  }
}

export const parser = new CParser();
