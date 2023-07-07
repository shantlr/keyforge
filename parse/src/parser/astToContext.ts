import { EnumNode, FnDefNode, StatementsNode, VarNode } from './types';

export type Context = {
  identifiers: Record<
    string,
    | FnDefNode
    | VarNode
    | EnumNode
    | {
        type: 'enumOption';
        name: string;
        value: string | number;
        enumName: string;
        /**
         * offset amongs enum options
         */
        offset: number;
      }
  >;
};

export const astToContext = (
  ast: StatementsNode,
  context: Context = {
    identifiers: {},
  },
) => {
  console.log(ast);

  ast.values.forEach((statement) => {
    if (statement.type === 'fnDef') {
      if (statement.name in context.identifiers) {
        console.warn(`identifier '${statement.name}' defined multiple times`);
      }
      context.identifiers[statement.name] = statement;
    } else if (statement.type === 'var') {
      if (statement.name in context.identifiers) {
        console.warn(`identifier '${statement.name}' defined multiple times`);
      }
      context.identifiers[statement.name] = statement;
    } else if (statement.type === 'enum') {
      if (statement.name in context.identifiers) {
        console.warn(`identifier '${statement.name}' defined multiple times`);
      }
      context.identifiers[statement.name] = statement;

      statement.values.forEach((v, offset) => {
        if (v.name in context.identifiers) {
          console.warn(
            `identifier '${statement.name} is defined multiple times`,
          );
        }

        context.identifiers[v.name] = {
          type: 'enumOption',
          name: v.name,
          value: v.value,
          offset,
          enumName: statement.name,
        };
      });
    }
  });

  return context;
};

export type AstContext = ReturnType<typeof astToContext>;
