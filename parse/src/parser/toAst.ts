import { parser } from './parser';
import {
  ArrayNode,
  DefineNode,
  EnumNode,
  FnCallNode,
  FnDefNode,
  IfNode,
  IncludeNode,
  ReturnNode,
  StatementNode,
  StatementsNode,
  SwitchCaseNode,
  ValueExprNode,
  VarNode,
} from './types';

export class ToAst extends parser.getBaseCstVisitorConstructor() {
  constructor() {
    super();

    this.validateVisitor();
  }

  statements(ctx: any): StatementsNode {
    return {
      type: 'statements',
      values: ctx.statement?.map((s) => this.visit(s)) || [],
    };
  }
  statement(ctx: any): StatementNode {
    const keys = Object.keys(ctx);
    if (keys.length === 1 && ctx[keys[0]].length === 1) {
      return this.visit(ctx[keys[0]][0]);
    }

    console.log('STATEMENT', ctx);
    throw new Error(`Cannot map statment`);
  }
  includeStatement(ctx: any): IncludeNode {
    if (ctx.string) {
      return {
        type: 'include',
        fileName: ctx.string[0].image.slice(1, -1), // remove quotes
      };
    }
    throw new Error(`CANNOT MAP INCLUDE: ${JSON.stringify(ctx)}`);
  }
  enumDeclaration(ctx: any): EnumNode {
    return {
      type: 'enum',
      name: ctx.name[0].image,
      values:
        ctx.enumOption?.reduce((acc, o) => {
          const prev = acc[acc.length - 1];
          const opt = this.visit(o);
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
  }
  enumOption(ctx: any): string {
    if (ctx.name) {
      return ctx.name[0].image;
    }
    console.log('ENUM', ctx);
    throw new Error(`CANNOT map enum option`);
  }
  varDeclaration(ctx: any): VarNode {
    const { name, modifier, arrayDim, varType } = this.visit(
      ctx.typedIdentifier[0]
    ) as ReturnType<(typeof this)['typedIdentifier']>;
    return {
      type: 'var',
      const: ctx.const.length > 0,
      varType,
      arrayDim,
      modifier,
      name,
      value: this.visit(ctx.value[0]),
    };
  }

  valueType(ctx: any) {
    if (ctx.void) {
      return 'void';
    }
    if (ctx.identifier) {
      return ctx.identifier[0].image;
    }
    throw new Error(`CANNOT MAP VALUE TYPE: ${JSON.stringify(ctx)}`);
  }
  typedIdentifier(ctx: any): {
    varType: string;
    modifier?: string;
    name: string;
    arrayDim: null;
  } {
    return {
      varType: this.visit(ctx.type[0]),
      modifier: ctx.modifier?.[0].image,
      name: ctx.name[0].image,
      arrayDim: null,
      // arrayDim: ctx.arrayDim ? this.visit(ctx.arrayDim) : null,
    };
  }
  arrayDimensionDeclaration(ctx: any) {
    return ctx;
  }

  varArrayDeclaration(ctx: any) {
    return ctx;
  }
  arrayDefinition(ctx: any): ArrayNode {
    const values = {};
    ctx.items.forEach((item) => {
      const mappedItem = this.visit(item);
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
  }
  arrayItemDefinition(ctx: any) {
    return {
      key: ctx.index[0].image,
      value: this.visit(ctx.value[0]),
    };
  }

  valueExpressionBase(ctx: any): ValueExprNode {
    if (ctx.true) {
      return true;
    }
    if (ctx.false) {
      return false;
    }
    if (ctx.identifier) {
      return ctx.identifier[0].image;
    }
    if (ctx.num) {
      return Number(ctx.num[0].image);
    }

    if (ctx.fnCall) {
      return this.visit(ctx.fnCall[0]);
    }
    if (ctx.arrayDefinition) {
      return this.visit(ctx.arrayDefinition[0]);
    }
    if (ctx.string) {
      return {
        type: 'string',
        value: ctx.string[0].image,
      };
    }

    console.log('VAL', ctx);
    throw new Error(`CANNOT PARSE VALUE EXPR: ${JSON.stringify(ctx)}`);
  }
  valueExpression(ctx: any): ValueExprNode {
    let v = this.valueExpressionBase(ctx);
    if (ctx.accessField) {
      ctx.accessField.forEach((accessField) => {
        v = {
          type: 'accessField',
          value: v,
          field: accessField.image,
        };
      });
    }
    return v;
  }

  fnDefinition(ctx: any): FnDefNode {
    let params = ctx.params?.map((p) => this.visit(p)) || [];
    if (params.length === 1 && params[0]?.type === 'void') {
      params = [];
    }
    return {
      type: 'fnDef',
      returnType: this.visit(ctx.type[0]),
      name: ctx.name[0].image,
      params,
      body: ctx.body?.map((p) => this.visit(p)) || [],
    };
  }
  fnStatement(ctx: any) {
    if (ctx.semicolon) {
      delete ctx.semicolon;
    }
    const keys = Object.keys(ctx);
    if (keys.length === 1 && ctx[keys[0]].length === 1) {
      return this.visit(ctx[keys[0]][0]);
    }

    throw new Error(`CANNOT MAP FN STATEMENT: ${JSON.stringify(ctx)}`);
  }
  fnCall(ctx: any): FnCallNode {
    return {
      type: 'fnCall',
      name: ctx.name[0].image,
      params:
        ctx.params?.map((p) => {
          if (p.identifier) {
            return {
              type: 'identifier',
              value: p.image,
            };
          }

          return this.visit(p);
        }) || [],
    };
  }
  returnStatement(ctx: any): ReturnNode {
    return {
      type: 'return',
      value: ctx.value ? this.visit(ctx.value[0]) : undefined,
    };
  }

  defineDeclaration(ctx: any): DefineNode {
    return {
      type: 'define',
      name: ctx.name[0].image,
      value: ctx.value ? this.visit(ctx.value[0]) : null,
    };
  }

  ifFlow(ctx: any): IfNode {
    return {
      type: 'if',
      condition: this.visit(ctx.conditionValue[0]),
      do: ctx.body?.map((b) => this.visit(b)) || [],
      else: [],
    };
  }
  whileFlow(ctx: any) {
    return ctx;
  }
  switchFlow(ctx: any): SwitchCaseNode {
    const cases = ctx.cases?.map((c) => this.visit(c)) || [];
    return {
      type: 'switch',
      value: this.visit(ctx.value[0]),
      cases: cases,
    };
  }
  switchCase(ctx: any): SwitchCaseNode['cases'][number] {
    const matches = ctx.matches.map((m) => this.visit(m));
    return {
      matches: matches.filter((m) => m?.type !== 'case_default'),
      default: matches.some((m) => m?.type === 'case_default'),
      do: ctx.do?.map((d) => this.visit(d)) || [],
    };
  }
  switchCaseMatch(ctx: any): { type: 'case_default' } | ValueExprNode {
    if (ctx.default) {
      return { type: 'case_default' };
    }
    if (ctx.case) {
      return this.visit(ctx.value[0]);
    }
    return ctx;
  }
}
