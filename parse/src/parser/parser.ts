import { CstParser, TokenType } from 'chevrotain';

import { TOKENS, TOKEN_LIST } from './lexer';

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
          this.SUBRULE(this.pragmaStatement);
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
      {
        ALT: () => {
          this.CONSUME(TOKENS.semicolon);
        },
      },
    ]);
  });

  pragmaStatement = this.RULE('pragmaStatement', () => {
    this.CONSUME(TOKENS.pragma);
    this.CONSUME(TOKENS.identifier);
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

    this.OPTION1(() => {
      this.CONSUME(TOKENS.pthStart);
      this.MANY_SEP({
        SEP: TOKENS.comma,
        DEF: () => {
          this.CONSUME2(TOKENS.identifier, {
            LABEL: 'params',
          });
        },
      });
      this.CONSUME(TOKENS.pthEnd);
    });

    this.OPTION2(() => {
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

    this.SEP({
      SEP: TOKENS.comma,
      dangling: true,
      DEF: (i) => {
        this.subrule(i, this.enumOption);
      },
    });
    // // enum values
    // this.MANY_SEP({
    //   SEP: TOKENS.comma,
    //   // enum value assignation
    //   DEF: () => {
    //     this.SUBRULE(this.enumOption);
    //   },
    // });
    // this.OPTION(() => {
    //   this.CONSUME(TOKENS.comma);
    // });

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
  //#endregion

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

  //#region Value expression
  valueExpression = this.RULE('valueExpression', () => {
    this.SUBRULE(this.valueAssignExpression);
  });

  valueAssignExpression = this.RULE('valueAssignExpression', () => {
    this.SUBRULE(this.valueTernaryExpression, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.equal);
      this.SUBRULE2(this.valueTernaryExpression, {
        LABEL: 'rights',
      });
    });
  });

  valueTernaryExpression = this.RULE('valueTernaryExpression', () => {
    this.SUBRULE1(this.valueOrExpression, {
      LABEL: 'left',
    });

    this.OPTION(() => {
      this.CONSUME(TOKENS.question);
      this.SUBRULE2(this.valueOrExpression, {
        LABEL: 'then',
      });
      this.CONSUME(TOKENS.colon);
      this.SUBRULE3(this.valueTernaryExpression, {
        LABEL: 'else',
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
    this.SUBRULE1(this.valueBitAndExpression, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.and);
      this.SUBRULE2(this.valueBitAndExpression, {
        LABEL: 'rights',
      });
    });
  });

  valueBitAndExpression = this.RULE('valueBitAndExpression', () => {
    this.SUBRULE1(this.valueBitOrExpression, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.amp);
      this.SUBRULE2(this.valueBitOrExpression, {
        LABEL: 'rights',
      });
    });
  });
  valueBitOrExpression = this.RULE('valueBitOrExpression', () => {
    this.SUBRULE1(this.valueEqualExpression, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.pipe);
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
    this.SUBRULE1(this.valueLtExpression, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.diff);
      this.SUBRULE2(this.valueLtExpression, {
        LABEL: 'rights',
      });
    });
  });

  valueLtExpression = this.RULE('valueLtExpression', () => {
    this.SUBRULE1(this.valueGtExpression, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.lt);
      this.SUBRULE2(this.valueGtExpression, {
        LABEL: 'rights',
      });
    });
  });
  valueGtExpression = this.RULE('valueGtExpression', () => {
    this.SUBRULE1(this.valueLteExpression, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.gt);
      this.SUBRULE2(this.valueLteExpression, {
        LABEL: 'rights',
      });
    });
  });
  valueLteExpression = this.RULE('valueLteExpression', () => {
    this.SUBRULE1(this.valueGteExpression, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.lte);
      this.SUBRULE2(this.valueGteExpression, {
        LABEL: 'rights',
      });
    });
  });
  valueGteExpression = this.RULE('valueGteExpression', () => {
    this.SUBRULE1(this.valueShiftRightExpression, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.gte);
      this.SUBRULE2(this.valueShiftRightExpression, {
        LABEL: 'rights',
      });
    });
  });

  valueShiftRightExpression = this.RULE('valueShiftRightExpression', () => {
    this.SUBRULE1(this.valueShiftLeftExpression, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.shiftRight);
      this.SUBRULE2(this.valueShiftLeftExpression, {
        LABEL: 'rights',
      });
    });
  });
  valueShiftLeftExpression = this.RULE('valueShiftLeftExpression', () => {
    this.SUBRULE1(this.valueAddExpression, {
      LABEL: 'left',
    });
    this.MANY(() => {
      this.CONSUME(TOKENS.shiftLeft);
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
  valuePthExpression = this.RULE('valuePthExpression', () => {
    this.CONSUME(TOKENS.pthStart);
    this.SUBRULE(this.valueExpression, {
      LABEL: 'value',
    });
    this.CONSUME(TOKENS.pthEnd);
  });
  //#endregion

  SEP({
    SEP,
    DEF,
    dangling,
  }: {
    SEP: TokenType;
    DEF: (idx: number) => void;
    dangling?: boolean;
  }) {
    this.OPTION1(() => {
      DEF(0);
    });
    this.MANY(() => {
      this.CONSUME1(SEP);
      DEF(1);
    });
    if (dangling) {
      this.OPTION2(() => {
        this.CONSUME2(SEP);
      });
    }
  }

  constructor() {
    super(TOKEN_LIST);

    this.performSelfAnalysis();
  }
}

export const parser = new CParser();
