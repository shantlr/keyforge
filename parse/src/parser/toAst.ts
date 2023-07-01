import { createVisitor, visitSubRule } from './createVisitor';
import { parser } from './parser';
import {
  AddNode,
  ArrayNode,
  DefineNode,
  EnumNode,
  FnDefNode,
  FnInstructionNode,
  IfNode,
  IncludeNode,
  PreprocIfNode,
  ReturnNode,
  StatementNode,
  StatementsNode,
  SubtractNode,
  SwitchCaseNode,
  ValueExprNode,
  VarNode,
  WhileNode,
} from './types';

export const toCAst = createVisitor(parser, {
  statements(ctx: any): StatementsNode {
    return {
      type: 'statements',
      values: ctx.statement?.map((s) => toCAst(s)) || [],
    };
  },
  statement(ctx: any): StatementNode {
    const keys = Object.keys(ctx);
    if (keys.length === 1 && ctx[keys[0]].length === 1) {
      return toCAst(ctx[keys[0]][0]);
    }

    console.log('STATEMENT', ctx);
    throw new Error(`Cannot map statment`);
  },

  //#region PREPROCESSOR
  defineDeclaration(ctx: any): DefineNode {
    return {
      type: 'define',
      name: ctx.name[0].image,
      value: ctx.value ? toCAst(ctx.value[0]) : null,
    };
  },
  includeStatement(ctx: any): IncludeNode {
    if (ctx.string) {
      return {
        type: 'include',
        fileName: ctx.string[0].image.slice(1, -1), // remove quotes
      };
    }
    throw new Error(`CANNOT MAP INCLUDE: ${JSON.stringify(ctx)}`);
  },
  //#endregion

  enumDeclaration(ctx: any): EnumNode {
    return {
      type: 'enum',
      name: ctx.name[0].image,
      values:
        ctx.enumOption?.reduce((acc, o) => {
          const prev = acc[acc.length - 1];
          const opt = toCAst(o);
          if (typeof opt === 'string') {
            acc.push({
              name: opt,
              value: (prev?.value ?? -1) + 1,
            });
          } else {
            throw new Error(`CANNOT add opt: ${JSON.stringify(opt)}`);
          }

          return acc;
        }, []) || [],
    };
  },
  enumOption(ctx: any): string {
    if (ctx.name) {
      return ctx.name[0].image;
    }
    console.log('ENUM', ctx);
    throw new Error(`CANNOT map enum option`);
  },
  varDeclaration(ctx: any): VarNode {
    const { name, modifier, arrayDim, varType } = toCAst(
      ctx.typedIdentifier[0]
    ) as ReturnType<(typeof this)['typedIdentifier']>;
    return {
      type: 'var',
      const: ctx.const?.length > 0,
      varType,
      arrayDim,
      modifier,
      name,
      value: toCAst(ctx.value[0]),
    };
  },

  valueType(ctx: any) {
    if (ctx.void) {
      return 'void';
    }
    if (ctx.identifier) {
      return ctx.identifier[0].image;
    }
    throw new Error(`CANNOT MAP VALUE TYPE: ${JSON.stringify(ctx)}`);
  },
  typedIdentifier(ctx: any): {
    varType: string;
    modifier?: string;
    name: string;
    arrayDim: null;
  } {
    return {
      varType: toCAst(ctx.type[0]),
      modifier: ctx.modifier?.[0].image,
      name: ctx.name[0].image,
      arrayDim: null,
      // arrayDim: ctx.arrayDim ? toCAst(ctx.arrayDim) : null,
    };
  },
  arrayDimensionDeclaration(ctx: any) {
    return ctx;
  },

  //#region value expression
  valueExpression(ctx: any): ValueExprNode {
    let value: ValueExprNode = visitSubRule(ctx, toCAst, {
      omit: ['post'],
      name: 'valueExpression',
    });

    if (ctx.post) {
      ctx.post.forEach((p) => {
        console.log(p);
      });
    }

    return value;
  },
  valueAddExpression(ctx, visit): AddNode {
    const left = visit(ctx.left[0]);
    const rights = ctx.rights?.map((r) => visit(r));
    if (!rights?.length) {
      return left;
    }

    return {
      type: 'add',
      values: [left, ...rights],
    };
  },
  valueSubtractExpression(ctx, visit): SubtractNode {
    const left = visit(ctx.left[0]);
    const rights = ctx.rights?.map((r) => visit(r));
    if (!rights?.length) {
      return left;
    }

    return {
      type: 'subtract',
      values: [left, ...rights],
    };
  },
  valueMultExpression(ctx, visit) {
    const left = visit(ctx.left[0]);
    const rights = ctx.rights?.map((r) => visit(r));
    if (!rights?.length) {
      return left;
    }

    return {
      type: 'mult',
      values: [left, ...rights],
    };
  },
  valueDivideExpression(ctx, visit) {
    const left = visit(ctx.left[0]);
    const rights = ctx.rights?.map((r) => visit(r));
    if (!rights?.length) {
      return left;
    }

    return {
      type: 'divide',
      values: [left, ...rights],
    };
  },
  valueWithPostExpression(ctx, visit) {
    return visitSubRule(ctx, visit, {
      name: 'valueWithPostExpression',
    });
  },
  valueWithPosBracketIndex(ctx, visit) {
    const left = visit(ctx.left[0]);
    const rights = ctx.rights?.map((r) => visit(r));
    if (!rights?.length) {
      return left;
    }

    return {
      type: 'postBracketIndex',
      values: [left, ...rights],
    };
  },
  valueWithPostDotIndex(ctx, visit) {
    const left = visit(ctx.left[0]);
    const rights = ctx.rights?.map((r) => visit(r));
    if (!rights?.length) {
      return left;
    }

    return {
      type: 'postDotIndex',
      values: [left, ...rights],
    };
  },
  valueWithPostArrowIndex(ctx, visit) {
    const left = visit(ctx.left[0]);
    const rights = ctx.rights?.map((r) => visit(r));
    if (!rights?.length) {
      return left;
    }

    return {
      type: 'postArrowIndex',
      values: [left, ...rights],
    };
  },
  valueWithPostCall(ctx, visit) {
    const left = visit(ctx.left[0]);
    const rights = ctx.rights?.map((r) => visit(r));
    if (!rights?.length) {
      return left;
    }

    return {
      type: 'postCall',
      fn: left,
      calls: rights,
    };
  },
  valueWithPostCallArgList(ctx, visit) {
    return ctx.list?.map((l) => visit(l)) || [];
  },
  valuePostInc(ctx, visit) {
    const left = visit(ctx.left[0]);
    const rights = ctx.rights?.map((r) => visit(r));
    if (!rights?.length) {
      return left;
    }

    return {
      type: 'postInc',
      values: [left, ...rights],
    };
  },
  valuePostDec(ctx, visit) {
    const left = visit(ctx.left[0]);
    const rights = ctx.rights?.map((r) => visit(r));
    if (!rights?.length) {
      return left;
    }

    return {
      type: 'postDec',
      values: [left, ...rights],
    };
  },
  valueArrayExpression(ctx, visit): ArrayNode {
    const values = {};
    ctx.items.forEach((item) => {
      const mappedItem = visit(item);
      if (!('key' in mappedItem) || !('value' in mappedItem)) {
        throw new Error(
          `UNEXPECTED ARRAY ITEM: ${JSON.stringify(mappedItem, null, 2)}`
        );
      }
      values[mappedItem.key] = mappedItem.value;
    });
    return {
      type: 'array',
      values,
    };
  },
  valueArrayItemExpression(ctx, visit) {
    return {
      key: ctx.index[0].image,
      value: visit(ctx.value[0]),
    };
  },
  valuePthExpression(ctx, visit) {
    return visit(ctx.value[0]);
  },
  valueAtomic(ctx, visit): ValueExprNode {
    if (ctx.num) {
      return Number(ctx.num[0].image);
    }
    if (ctx.identifier) {
      return ctx.identifier[0].image;
    }
    if (ctx.false) {
      return false;
    }
    if (ctx.true) {
      return true;
    }
    if (ctx.void) {
      return 'void';
    }
    if (ctx.string) {
      return {
        type: 'string',
        value: ctx.string[0].image,
      };
    }
    if (ctx.valueArrayExpression) {
      return visit(ctx.valueArrayExpression[0]);
    }
    if (ctx.valuePthExpression) {
      return visit(ctx.valuePthExpression[0]);
    }

    console.log('val', ctx);
    throw new Error(`CANNOT MAP VALUE ATOMIC: ${JSON.stringify(ctx)}`);
  },
  //#endregion

  //#region Function
  fnDefinition(ctx: any): FnDefNode {
    let params = ctx.params?.map((p) => toCAst(p)) || [];
    if (params.length === 1 && params[0]?.type === 'void') {
      params = [];
    }
    return {
      type: 'fnDef',
      returnType: toCAst(ctx.type[0]),
      name: ctx.name[0].image,
      params,
      body: ctx.body?.map((p) => toCAst(p)) || [],
    };
  },
  fnStatement(ctx: any) {
    if (ctx.semicolon) {
      delete ctx.semicolon;
    }
    const keys = Object.keys(ctx);
    if (keys.length === 1 && ctx[keys[0]].length === 1) {
      return toCAst(ctx[keys[0]][0]);
    }

    throw new Error(`CANNOT MAP FN STATEMENT: ${JSON.stringify(ctx)}`);
  },
  returnStatement(ctx: any): ReturnNode {
    return {
      type: 'return',
      value: ctx.value ? toCAst(ctx.value[0]) : undefined,
    };
  },
  ifDefFnStatement(ctx, visit): PreprocIfNode<FnInstructionNode[]> {
    return {
      type: 'preprocIf',
      condition: visit(ctx.condition[0]),
      value: ctx.do?.map((d) => visit(d)) || [],
    };
  },
  //#endregion
  ifDefCondition(ctx, visit) {
    if (ctx.identifier) {
      return ctx.identifier[0].image;
    }
    if (ctx.condition) {
      return visit(ctx.condition[0]);
    }

    throw new Error(`CANNOT MAP #IF CONDITION: ${JSON.stringify(ctx)}`);
  },
  ifDefStatement(ctx, visit) {
    return {
      type: 'preprocIf',
      condition: visit(ctx.condition[0]),
      value: ctx.do?.map((d) => visit(d)) || [],
    };
  },

  //#region if
  ifStatement(ctx, visit): IfNode {
    return {
      type: 'if',
      condition: visit(ctx.condition[0]),
      do: ctx.do ? visit(ctx.do[0]) : [],
      elseifs: ctx.elseifs?.map((e) => visit(e)) || [],
      else: ctx.else ? visit(ctx.else[0]) : [],
    };
  },
  elseif(ctx, visit): IfNode['elseifs'][number] {
    return {
      condition: visit(ctx.condition[0]),
      do: visit(ctx.do[0]),
    };
  },
  elseCase(ctx, visit): FnInstructionNode[] {
    return visit(ctx.do[0]);
  },
  //#endregion
  statementBlock(ctx, visit): FnInstructionNode[] {
    return ctx.do?.map((d) => visit(d)) || [];
  },
  whileStatement(ctx: any): WhileNode {
    return ctx;
  },
  //#region switch
  switchStatement(ctx: any): SwitchCaseNode {
    const cases = ctx.cases?.map((c) => toCAst(c)) || [];
    return {
      type: 'switch',
      value: toCAst(ctx.value[0]),
      cases: cases,
    };
  },
  switchCase(ctx: any): SwitchCaseNode['cases'][number] {
    const matches = ctx.matches.map((m) => toCAst(m));
    return {
      matches: matches.filter((m) => m?.type !== 'case_default'),
      default: matches.some((m) => m?.type === 'case_default'),
      do: ctx.do?.map((d) => toCAst(d)) || [],
    };
  },
  switchCaseMatch(ctx: any): { type: 'case_default' } | ValueExprNode {
    if (ctx.default) {
      return { type: 'case_default' };
    }
    if (ctx.case) {
      return toCAst(ctx.value[0]);
    }
    return ctx;
  },
  //#endregion
});
