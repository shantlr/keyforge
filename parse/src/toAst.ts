import { parser } from './parser';

export class ToAst extends parser.getBaseCstVisitorConstructor() {
  constructor() {
    super();

    this.validateVisitor();
  }

  statements(ctx: any) {
    return {
      type: 'statements',
      values: ctx.statement?.map((s) => this.visit(s)) || [],
    };
    // if (ctx.defineDeclaration) {
    //   return ctx.defineDeclaration.map((d) => this.visit(d));
    // }

    // return null;
  }
  statement(ctx: any) {
    if (ctx.enumDeclaration) {
      return this.visit(ctx.enumDeclaration[0]);
    }
    if (ctx.defineDeclaration) {
      return this.visit(ctx.defineDeclaration[0]);
    }
    if (ctx.varDeclaration) {
      return this.visit(ctx.varDeclaration[0]);
    }
    if (ctx.includeStatement) {
      return this.visit(ctx.includeStatement[0]);
    }
    console.log('STATEMENT', ctx);
    throw new Error(`Cannot map statment`);
  }
  includeStatement(ctx: any) {
    if (ctx.string) {
      return {
        type: 'include',
        fileName: ctx.string[0].image.slice(1, -1), // remove quotes
      };
    }
    throw new Error(`CANNOT MAP INCLUDE: ${JSON.stringify(ctx)}`);
  }
  enumDeclaration(ctx: any) {
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
              value: (prev ?? -1) + 1,
            });
          } else {
            throw new Error(`CANNOT add opt: ${JSON.stringify(opt)}`);
          }

          return acc;
        }, []) || [],
    };
  }
  enumOption(ctx: any) {
    if (ctx.name) {
      return ctx.name[0].image;
    }
    console.log('ENUM', ctx);
    throw new Error(`CANNOT map enum option`);
  }
  varDeclaration(ctx: any) {
    return {
      type: 'var',
      const: ctx.const.length > 0,
      varType: ctx.type[0].image,
      arrayDimension: null,
      progmem: ctx.progmem?.[0].image,
      name: ctx.name[0].image,
      value: this.visit(ctx.valueExpression[0]),
    };
  }
  varArrayDeclaration(ctx: any) {
    return ctx;
  }
  arrayDefinition(ctx: any) {
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
  fnCall(ctx: any) {
    return {
      type: 'fnCall',
      name: ctx.name[0].image,
      params: ctx.params.map((p) => {
        if (p.identifier) {
          return {
            type: 'identifier',
            value: p.image,
          };
        }

        return this.visit(p);
      }),
    };
  }
  valueExpression(ctx: any) {
    if (ctx.fnCall) {
      return this.visit(ctx.fnCall[0]);
    }
    if (ctx.identifier) {
      return ctx.identifier[0].image;
    }
    if (ctx.arrayDefinition) {
      return this.visit(ctx.arrayDefinition[0]);
    }

    console.log('VAL', ctx);
    return ctx;
  }

  defineDeclaration(ctx: any) {
    return {
      type: 'define',
      name: ctx.name[0].image,
      value: this.visit(ctx.value[0]),
    };
  }
}
