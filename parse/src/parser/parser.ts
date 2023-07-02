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
  hexa: createToken({ name: 'hexa', pattern: /0x[A-F0-9]+/ }),
  num: createToken({ name: 'num', pattern: /\d+/ }),
  identifier: createToken({ name: 'identifier', pattern: /[a-zA-Z0-9-_]+/ }),

  include: createToken({ name: 'include', pattern: '#include' }),
  define: createToken({ name: 'define', pattern: '#define' }),
  ifdef: createToken({ name: 'ifdef', pattern: '#ifdef' }),
  preprocIf: createToken({ name: 'preprocIf', pattern: '#if' }),
  preprocElif: createToken({ name: 'preprocElif', pattern: '#elif' }),
  preprocElse: createToken({ name: 'preprocElse', pattern: '#else' }),
  endif: createToken({ name: 'endif', pattern: '#endif' }),

  enum: createToken({ name: 'enum', pattern: 'enum' }),
  void: createToken({ name: 'void', pattern: 'void' }),
  if: createToken({ name: 'if', pattern: 'if' }),
  else: createToken({ name: 'else', pattern: 'else' }),
  while: createToken({ name: 'while', pattern: 'while' }),
  do: createToken({ name: 'do', pattern: 'do' }),
  continue: createToken({ name: 'continue', pattern: 'continue' }),
  break: createToken({ name: 'break', pattern: 'break' }),
  return: createToken({ name: 'return', pattern: 'return' }),
  true: createToken({ name: 'true', pattern: 'true' }),
  false: createToken({ name: 'false', pattern: 'false' }),
  dot: createToken({ name: 'dot', pattern: '.' }),
  switch: createToken({ name: 'switch', pattern: 'switch' }),
  case: createToken({ name: 'case', pattern: 'case' }),
  default: createToken({ name: 'default', pattern: 'default' }),
  colon: createToken({ name: 'colon', pattern: ':' }),
  arrow: createToken({ name: 'arrow', pattern: '->' }),
  tilde: createToken({ name: 'tilde', pattern: '~' }),
  excl: createToken({ name: 'excl', pattern: '!' }),

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
  equality: createToken({
    name: 'equality',
    pattern: '==',
  }),
  diff: createToken({
    name: 'diff',
    pattern: '!=',
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
  inc: createToken({
    name: 'inc',
    pattern: '++',
  }),
  dec: createToken({
    name: 'dec',
    pattern: '--',
  }),
  percent: createToken({
    name: 'percent',
    pattern: '%',
  }),
  plus: createToken({ name: 'plus', pattern: '+' }),
  minus: createToken({
    name: 'minus',
    pattern: '-',
  }),
  asterisk: createToken({
    name: 'asterisk',
    pattern: '*',
  }),
  slash: createToken({
    name: 'slash',
    pattern: '/',
  }),
  and: createToken({
    name: 'and',
    pattern: '&&',
  }),
  amp: createToken({
    name: 'amp',
    pattern: '&',
  }),
  or: createToken({
    name: 'or',
    pattern: '||',
  }),
  pipe: createToken({
    name: 'pipe',
    pattern: '|',
  }),
};

const allTokens = [
  TOKENS.multiLineComment,
  TOKENS.comment,
  TOKENS.ws,
  TOKENS.string,

  // Keywords
  // Preprocessing
  TOKENS.enum,
  TOKENS.define,
  TOKENS.ifdef,
  TOKENS.endif,
  TOKENS.preprocIf,
  TOKENS.preprocElif,
  TOKENS.preprocElse,

  TOKENS.include,
  TOKENS.const,
  TOKENS.void,
  TOKENS.if,
  TOKENS.else,
  TOKENS.while,
  TOKENS.do,
  TOKENS.continue,
  TOKENS.break,
  TOKENS.return,
  TOKENS.true,
  TOKENS.false,
  TOKENS.switch,
  TOKENS.case,
  TOKENS.default,
  TOKENS.colon,

  TOKENS.comma,
  TOKENS.dot,
  TOKENS.semicolon,
  TOKENS.blockStart,
  TOKENS.blockEnd,
  TOKENS.bracketStart,
  TOKENS.bracketEnd,
  TOKENS.pthStart,
  TOKENS.pthEnd,

  TOKENS.inc,
  TOKENS.dec,

  TOKENS.equality,
  TOKENS.diff,
  TOKENS.equal,
  TOKENS.plus,
  TOKENS.minus,
  TOKENS.asterisk,
  TOKENS.slash,

  TOKENS.arrow,
  TOKENS.gte,
  TOKENS.gt,
  TOKENS.lte,
  TOKENS.lt,

  TOKENS.and,
  TOKENS.or,
  TOKENS.amp,
  TOKENS.pipe,
  TOKENS.tilde,
  TOKENS.excl,
  TOKENS.percent,

  TOKENS.hexa,
  TOKENS.num,
  TOKENS.identifier,
];

export const lexer = new Lexer(allTokens);

export class CParser extends CstParser {
  statements = this.RULE('statements', () => {
    this.MANY(() => {
      this.SUBRULE(this.statement);
    });
  });

  statement = this.RULE('statement', () => {
    this.OR([
      {
        ALT: () => {
          this.SUBRULE(this.defineDeclaration);
        },
      },
      {
        ALT: () => {
          this.SUBRULE(this.includeStatement);
        },
      },
      {
        ALT: () => {
          this.SUBRULE(this.enumDeclaration);
        },
      },
      {
        ALT: () => {
          this.SUBRULE(this.fnDefinition);
        },
        IGNORE_AMBIGUITIES: true,
      },
      {
        ALT: () => {
          this.SUBRULE(this.varDeclaration);
        },
      },
      {
        ALT: () => {
          this.SUBRULE(this.rPreprocIfDef);
        },
      },
      {
        ALT: () => {
          this.SUBRULE(this.rPreprocIf);
        },
      },
    ]);
  });

  rPreprocIfDef = this.RULE('rPreprocIfDef', () => {
    this.CONSUME(TOKENS.ifdef);
    this.CONSUME(TOKENS.identifier);
    this.MANY(() => {
      this.SUBRULE(this.statement, {
        LABEL: 'do',
      });
    });
    this.CONSUME(TOKENS.endif);
  });
  rPreprocIf = this.RULE('rPreprocIf', () => {
    this.CONSUME(TOKENS.preprocIf);
    this.SUBRULE(this.valueExpression, {
      LABEL: 'condition',
    });

    this.MANY1(() => {
      this.SUBRULE(this.statement, {
        LABEL: 'do',
      });
    });

    this.MANY2(() => {
      this.SUBRULE(this.rPreprocElif, {
        LABEL: 'elifs',
      });
    });
    this.OPTION(() => {
      this.SUBRULE(this.rPreprocElse);
    });
    this.CONSUME(TOKENS.endif);
  });
  rPreprocElif = this.RULE('rPreprocElif', () => {
    this.CONSUME(TOKENS.preprocElif);
    this.MANY(() => {
      this.SUBRULE(this.statement, {
        LABEL: 'do',
      });
    });
  });
  rPreprocElse = this.RULE('rPreprocElse', () => {
    this.CONSUME(TOKENS.preprocElse);
    this.MANY(() => {
      this.SUBRULE(this.statement, {
        LABEL: 'do',
      });
    });
  });

  defineDeclaration = this.RULE('defineDeclaration', () => {
    this.CONSUME(TOKENS.define);
    this.CONSUME(TOKENS.identifier, {
      LABEL: 'name',
    });

    this.OPTION(() => {
      this.SUBRULE(this.valueExpression, {
        LABEL: 'value',
      });
    });
  });
  includeStatement = this.RULE('includeStatement', () => {
    this.CONSUME(TOKENS.include);
    this.OR([
      {
        // include using define
        ALT: () => {
          this.CONSUME(TOKENS.string);
        },
      },
      {
        // include using define
        ALT: () => {
          this.CONSUME(TOKENS.identifier);
        },
      },
    ]);
  });

  enumDeclaration = this.RULE('enumDeclaration', () => {
    this.CONSUME(TOKENS.enum);
    this.CONSUME1(TOKENS.identifier, {
      LABEL: 'name',
    });
    this.CONSUME(TOKENS.blockStart);

    // enum values
    this.AT_LEAST_ONE_SEP({
      SEP: TOKENS.comma,
      // enum value assignation
      DEF: () => {
        this.SUBRULE(this.enumOption);
      },
    });

    this.CONSUME(TOKENS.blockEnd);
    this.CONSUME(TOKENS.semicolon);
  });
  enumOption = this.RULE('enumOption', () => {
    this.CONSUME(TOKENS.identifier, {
      LABEL: 'name',
    });
    this.OPTION(() => {
      this.CONSUME(TOKENS.equal);

      this.SUBRULE(this.valueExpression, {
        LABEL: 'value',
      });
    });
  });

  varDeclaration = this.RULE('varDeclaration', () => {
    this.OPTION(() => {
      this.CONSUME(TOKENS.const, {
        LABEL: 'const',
      });
    });
    // // type
    // this.SUBRULE(this.valueType, {
    //   LABEL: 'type',
    // });

    // // progmem
    // this.OPTION1(() => {
    //   this.CONSUME2(TOKENS.identifier, {
    //     LABEL: 'progmem',
    //   });
    // });

    // // var name
    // this.CONSUME3(TOKENS.identifier, {
    //   LABEL: 'name',
    // });

    // // array
    // this.MANY(() => {
    //   this.SUBRULE(this.arrayDimensionDeclaration);
    // });

    this.SUBRULE(this.typedIdentifier, {
      LABEL: 'typedIdentifier',
    });

    this.CONSUME(TOKENS.equal);

    this.SUBRULE2(this.valueExpression, {
      LABEL: 'value',
    });
    this.CONSUME(TOKENS.semicolon);
  });
  arrayDimensionDeclaration = this.RULE('arrayDimensionDeclaration', () => {
    this.CONSUME(TOKENS.bracketStart);
    this.OPTION2(() => {
      this.SUBRULE1(this.valueExpression);
    });
    this.CONSUME(TOKENS.bracketEnd);
  });

  fnDefinition = this.RULE('fnDefinition', () => {
    this.SUBRULE(this.valueType, {
      LABEL: 'type',
    });
    this.CONSUME(TOKENS.identifier, {
      LABEL: 'name',
    });
    this.CONSUME(TOKENS.pthStart);

    const p = this.LA(1);
    if (p.tokenType === TOKENS.void) {
      this.CONSUME(TOKENS.void);
    } else {
      this.MANY_SEP({
        SEP: TOKENS.comma,
        DEF: () => {
          this.SUBRULE(this.typedIdentifier, {
            LABEL: 'params',
          });
        },
      });
    }
    this.CONSUME(TOKENS.pthEnd);
    this.CONSUME(TOKENS.blockStart);
    this.MANY(() => {
      this.SUBRULE(this.fnStatement, {
        LABEL: 'body',
      });
    });
    this.CONSUME(TOKENS.blockEnd);
  });
  fnStatement = this.RULE('fnStatement', () => {
    this.OR([
      {
        ALT: () => {
          this.SUBRULE(this.varDeclaration);
        },
      },
      {
        ALT: () => {
          this.SUBRULE(this.valueExpression);
          this.CONSUME(TOKENS.semicolon);
        },
        IGNORE_AMBIGUITIES: true,
      },
      {
        ALT: () => {
          this.SUBRULE(this.returnStatement);
        },
      },
      {
        ALT: () => {
          this.SUBRULE(this.ifStatement);
        },
      },
      {
        ALT: () => {
          this.SUBRULE(this.whileStatement);
        },
      },
      {
        ALT: () => {
          this.SUBRULE(this.switchStatement);
        },
      },
      {
        ALT: () => {
          this.SUBRULE(this.rPreprocFnIf);
        },
      },
      {
        ALT: () => {
          this.SUBRULE(this.rPreprocFnIfDef);
        },
      },
      {
        ALT: () => {
          this.CONSUME(TOKENS.break);
          this.CONSUME2(TOKENS.semicolon);
        },
      },
      {
        ALT: () => {
          this.CONSUME(TOKENS.continue);
          this.CONSUME3(TOKENS.semicolon);
        },
      },
    ]);
  });

  //#region fn statements
  //#region preproc
  rPreprocFnIfDef = this.RULE('rPreprocFnIfDef', () => {
    this.CONSUME(TOKENS.ifdef);
    this.CONSUME(TOKENS.identifier);
    this.MANY(() => {
      this.SUBRULE(this.fnStatement, {
        LABEL: 'do',
      });
    });
    this.CONSUME(TOKENS.endif);
  });
  rPreprocFnIf = this.RULE('rPreprocFnIf', () => {
    this.CONSUME(TOKENS.preprocIf);
    this.SUBRULE1(this.valueExpression, {
      LABEL: 'condition',
    });

    this.MANY1(() => {
      this.SUBRULE(this.fnStatement, {
        LABEL: 'do',
      });
    });

    this.MANY2(() => {
      this.SUBRULE(this.rPreprocFnElif);
    });
    this.OPTION(() => {
      this.SUBRULE(this.rPreprocFnElse);
    });
    this.CONSUME(TOKENS.endif);
  });
  rPreprocFnElif = this.RULE('rPreprocFnElif', () => {
    this.CONSUME(TOKENS.preprocElif);
    this.MANY(() => {
      this.SUBRULE(this.fnStatement, {
        LABEL: 'do',
      });
    });
  });
  rPreprocFnElse = this.RULE('rPreprocFnElse', () => {
    this.CONSUME(TOKENS.preprocElse);
    this.MANY(() => {
      this.SUBRULE(this.fnStatement, {
        LABEL: 'do',
      });
    });
  });
  //#endregion

  returnStatement = this.RULE('returnStatement', () => {
    this.CONSUME(TOKENS.return);
    const token = this.LA(1);
    if (token.tokenType !== TOKENS.semicolon) {
      this.SUBRULE(this.valueExpression, {
        LABEL: 'value',
      });
    }
    this.CONSUME(TOKENS.semicolon);
  });
  ifStatement = this.RULE('ifStatement', () => {
    this.CONSUME(TOKENS.if);

    // condition
    this.CONSUME(TOKENS.pthStart);
    this.SUBRULE(this.valueExpression, {
      LABEL: 'condition',
    });
    this.CONSUME(TOKENS.pthEnd);

    // body
    this.SUBRULE(this.statementBlock, {
      LABEL: 'do',
    });

    this.MANY(() => {
      this.SUBRULE(this.elseif, {
        LABEL: 'elseifs',
      });
    });
    this.OPTION(() => {
      this.SUBRULE(this.elseCase, {
        LABEL: 'else',
      });
    });
  });
  elseif = this.RULE('elseif', () => {
    this.CONSUME(TOKENS.else);
    this.CONSUME(TOKENS.if);
    this.CONSUME(TOKENS.pthStart);
    this.SUBRULE(this.valueExpression, {
      LABEL: 'condition',
    });
    this.CONSUME(TOKENS.pthEnd);
    this.SUBRULE(this.statementBlock, {
      LABEL: 'do',
    });
  });
  elseCase = this.RULE('elseCase', () => {
    this.CONSUME(TOKENS.else);
    this.SUBRULE(this.statementBlock, {
      LABEL: 'do',
    });
  });

  statementBlock = this.RULE('statementBlock', () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(TOKENS.blockStart);
          this.MANY(() => {
            this.SUBRULE1(this.fnStatement, {
              LABEL: 'do',
            });
          });
          this.CONSUME(TOKENS.blockEnd);
        },
      },
      {
        GATE: () => this.LA(1).tokenType !== TOKENS.blockStart,
        ALT: () => {
          this.SUBRULE2(this.fnStatement, {
            LABEL: 'do',
          });
        },
      },
    ]);

    // const next = this.LA(1);
    // const isBlockBody = next.tokenType === TOKENS.blockStart;
    // if (isBlockBody) {
    //   this.CONSUME(TOKENS.blockStart);
    // } else {
    //   this.SUBRULE1(this.fnStatement, {
    //     LABEL: 'body',
    //   });
    // }

    // this.MANY({
    //   GATE: () => isBlockBody,
    //   DEF: () => {
    //     this.SUBRULE2(this.fnStatement, {
    //       LABEL: 'body',
    //     });
    //   },
    // });

    // if (isBlockBody) {
    //   this.CONSUME(TOKENS.blockEnd);
    // }
  });

  whileStatement = this.RULE('whileStatement', () => {
    this.CONSUME(TOKENS.while);
    this.CONSUME(TOKENS.pthStart);
  });
  switchStatement = this.RULE('switchStatement', () => {
    this.CONSUME(TOKENS.switch);
    this.CONSUME(TOKENS.pthStart);
    this.SUBRULE(this.valueExpression, {
      LABEL: 'value',
    });
    this.CONSUME(TOKENS.pthEnd);
    this.CONSUME(TOKENS.blockStart);
    this.MANY(() => {
      this.SUBRULE(this.switchCase, {
        LABEL: 'cases',
      });
    });
    this.CONSUME(TOKENS.blockEnd);
  });
  switchCase = this.RULE('switchCase', () => {
    this.AT_LEAST_ONE(() => {
      this.SUBRULE(this.switchCaseMatch, {
        LABEL: 'matches',
      });
    });
    this.OR([
      {
        GATE: () => this.LA(1).tokenType === TOKENS.blockStart,
        ALT: () => {
          this.CONSUME(TOKENS.blockStart);
          this.MANY1(() => {
            this.SUBRULE1(this.fnStatement, {
              LABEL: 'do',
            });
          });
          this.CONSUME(TOKENS.blockEnd);
        },
      },
      {
        GATE: () => this.LA(1).tokenType !== TOKENS.blockStart,
        ALT: () => {
          this.MANY2(() => {
            this.SUBRULE2(this.fnStatement, {
              LABEL: 'do',
            });
          });
        },
      },
    ]);
  });
  switchCaseMatch = this.RULE('switchCaseMatch', () => {
    this.OR([
      {
        GATE: () => this.LA(1).tokenType === TOKENS.case,
        ALT: () => {
          this.CONSUME(TOKENS.case);
          this.SUBRULE(this.valueExpression, {
            LABEL: 'value',
          });
          this.CONSUME1(TOKENS.colon);
        },
      },
      {
        ALT: () => {
          this.CONSUME(TOKENS.default);
          this.CONSUME2(TOKENS.colon);
        },
      },
    ]);
  });

  typedIdentifier = this.RULE('typedIdentifier', () => {
    this.SUBRULE(this.valueType, {
      LABEL: 'type',
    });

    const nextToken = this.LA(2);
    if (nextToken.tokenType === TOKENS.identifier) {
      this.CONSUME(TOKENS.identifier, {
        LABEL: 'modifier',
      });
    }

    this.CONSUME2(TOKENS.identifier, {
      LABEL: 'name',
    });

    this.MANY(() => {
      this.SUBRULE(this.arrayDimensionDeclaration, {
        LABEL: 'arrayDim',
      });
    });
  });
  valueType = this.RULE('valueType', () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(TOKENS.void);
        },
      },
      {
        ALT: () => {
          this.CONSUME(TOKENS.identifier);
        },
      },
    ]);
    this.MANY(() => {
      this.CONSUME(TOKENS.asterisk, {
        LABEL: 'ptr',
      });
    });
  });

  valueExpression = this.RULE('valueExpression', () => {
    this.SUBRULE(this.valueAssignExpression);
  });

  valueAssignExpression = this.RULE('valueAssignExpression', () => {
    this.SUBRULE(this.valueOrExpression, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.equal);
      this.SUBRULE2(this.valueOrExpression, {
        LABEL: 'rights',
      });
    });
  });
  valueOrExpression = this.RULE('valueOrExpression', () => {
    this.SUBRULE1(this.valueAndExpression, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.or);
      this.SUBRULE2(this.valueAndExpression, {
        LABEL: 'rights',
      });
    });
  });
  valueAndExpression = this.RULE('valueAndExpression', () => {
    this.SUBRULE1(this.valueEqualExpression, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.and);
      this.SUBRULE2(this.valueEqualExpression, {
        LABEL: 'rights',
      });
    });
  });

  valueEqualExpression = this.RULE('valueEqualExpression', () => {
    this.SUBRULE1(this.valueDiffExpression, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.equality);
      this.SUBRULE2(this.valueDiffExpression, {
        LABEL: 'rights',
      });
    });
  });
  valueDiffExpression = this.RULE('valueDiffExpression', () => {
    this.SUBRULE1(this.valueAddExpression, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.diff);
      this.SUBRULE2(this.valueAddExpression, {
        LABEL: 'rights',
      });
    });
  });

  valueAddExpression = this.RULE('valueAddExpression', () => {
    this.SUBRULE1(this.valueSubtractExpression, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.plus);
      this.SUBRULE2(this.valueSubtractExpression, {
        LABEL: 'rights',
      });
    });
  });
  valueSubtractExpression = this.RULE('valueSubtractExpression', () => {
    this.SUBRULE1(this.valueMultExpression, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.minus);
      this.SUBRULE2(this.valueMultExpression, {
        LABEL: 'rights',
      });
    });
  });
  valueMultExpression = this.RULE('valueMultExpression', () => {
    this.SUBRULE1(this.valueModuloExpression, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.asterisk);
      this.SUBRULE2(this.valueModuloExpression, {
        LABEL: 'rights',
      });
    });
  });
  valueModuloExpression = this.RULE('valueModuloExpression', () => {
    this.SUBRULE1(this.valueDivideExpression, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.percent);
      this.SUBRULE2(this.valueDivideExpression, {
        LABEL: 'rights',
      });
    });
  });
  valueDivideExpression = this.RULE('valueDivideExpression', () => {
    this.SUBRULE1(this.valueWithPostExpression, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.slash);
      this.SUBRULE2(this.valueWithPostExpression, {
        LABEL: 'rights',
      });
    });
  });

  //#region Array
  valueArrayExpression = this.RULE('valueArrayExpression', () => {
    this.CONSUME(TOKENS.blockStart);
    this.MANY_SEP({
      SEP: TOKENS.comma,
      DEF: () => {
        this.SUBRULE(this.valueArrayItemExpression, {
          LABEL: 'items',
        });
      },
    });
    this.OPTION(() => {
      this.CONSUME(TOKENS.comma);
    });
    this.CONSUME(TOKENS.blockEnd);
  });
  valueArrayItemExpression = this.RULE('valueArrayItemExpression', () => {
    this.CONSUME(TOKENS.bracketStart);
    this.CONSUME(TOKENS.identifier, {
      LABEL: 'index',
    });
    this.CONSUME(TOKENS.bracketEnd);
    this.CONSUME(TOKENS.equal);

    this.SUBRULE(this.valueExpression, {
      LABEL: 'value',
    });
  });
  valueArrayListExpression = this.RULE('valueArrayListExpression', () => {
    this.CONSUME(TOKENS.blockStart);
    this.MANY_SEP({
      SEP: TOKENS.comma,
      DEF: () => {
        this.SUBRULE(this.valueExpression, {
          LABEL: 'items',
        });
      },
    });
    this.CONSUME(TOKENS.blockEnd);
  });

  //#endregion

  //#region post expression
  valueWithPostExpression = this.RULE('valueWithPostExpression', () => {
    this.SUBRULE(this.valueWithPosBracketIndex);
  });
  valueWithPosBracketIndex = this.RULE('valueWithPosBracketIndex', () => {
    this.SUBRULE1(this.valueWithPostDotIndex, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.bracketStart);
      this.SUBRULE2(this.valueWithPostDotIndex, {
        LABEL: 'rights',
      });
      this.CONSUME(TOKENS.bracketEnd);
    });
  });
  valueWithPostDotIndex = this.RULE('valueWithPostDotIndex', () => {
    this.SUBRULE1(this.valueWithPostArrowIndex, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.dot);
      this.SUBRULE2(this.valueWithPostArrowIndex, {
        LABEL: 'rights',
      });
    });
  });
  valueWithPostArrowIndex = this.RULE('valueWithPostArrowIndex', () => {
    this.SUBRULE1(this.valueWithPostCall, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.arrow);
      this.SUBRULE2(this.valueWithPostCall, {
        LABEL: 'rights',
      });
    });
  });
  valueWithPostCall = this.RULE('valueWithPostCall', () => {
    this.SUBRULE(this.valuePostInc, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.SUBRULE(this.valueWithPostCallArgList, {
        LABEL: 'rights',
      });
    });
  });
  valueWithPostCallArgList = this.RULE('valueWithPostCallArgList', () => {
    this.CONSUME(TOKENS.pthStart);
    this.MANY_SEP({
      SEP: TOKENS.comma,
      DEF: () => {
        this.SUBRULE(this.valueExpression, {
          LABEL: 'list',
        });
      },
    });
    this.CONSUME(TOKENS.pthEnd);
  });
  valuePostInc = this.RULE('valuePostInc', () => {
    this.SUBRULE(this.valuePostDec, {
      LABEL: 'left',
    });
    // TODO: improve
    this.MANY(() => {
      this.CONSUME(TOKENS.inc, {
        LABEL: 'rights',
      });
    });
  });
  valuePostDec = this.RULE('valuePostDec', () => {
    this.SUBRULE(this.valueAtomic, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.dec, {
        LABEL: 'rights',
      });
    });
  });
  //#endregion

  valuePthExpression = this.RULE('valuePthExpression', () => {
    this.CONSUME(TOKENS.pthStart);
    this.SUBRULE(this.valueExpression, {
      LABEL: 'value',
    });
    this.CONSUME(TOKENS.pthEnd);
  });

  valueAtomic = this.RULE('valueAtomic', () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(TOKENS.void);
        },
      },
      {
        ALT: () => {
          this.CONSUME(TOKENS.true);
        },
      },
      {
        ALT: () => {
          this.CONSUME(TOKENS.false);
        },
      },
      {
        ALT: () => {
          this.CONSUME(TOKENS.num);
        },
      },
      {
        ALT: () => {
          this.CONSUME(TOKENS.hexa);
        },
      },
      {
        ALT: () => {
          this.CONSUME(TOKENS.string);
        },
      },
      {
        ALT: () => {
          this.CONSUME(TOKENS.identifier);
        },
      },
      {
        ALT: () => {
          this.SUBRULE(this.valueArrayExpression);
        },
      },
      {
        ALT: () => {
          this.SUBRULE(this.valueArrayListExpression);
        },
        IGNORE_AMBIGUITIES: true,
      },
      {
        ALT: () => {
          this.SUBRULE(this.valuePthExpression);
        },
      },
    ]);
  });
  //#endregion

  constructor() {
    super(allTokens);

    const $ = this;

    this.performSelfAnalysis();
  }
}

export const parser = new CParser();
