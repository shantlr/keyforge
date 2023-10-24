import { CstParser, ParserMethod } from 'chevrotain';
import { omit } from 'lodash';

type ParserRuleKeys<P, Key = keyof P> = Key extends keyof P
  ? P[Key] extends ParserMethod<any, any>
    ? Key
    : never
  : never;

export const createVisitor = <
  P extends CstParser,
  Visitors extends {
    [key in ParserRuleKeys<P>]?: (ctx: any, visit: (cst: any) => any) => any;
  }
>(
  parser: P,
  visitors: {
    [key in ParserRuleKeys<P>]?: Visitors[key];
  },
  opt?: {
    default?: (ctx: any, visit: (cst: any) => any) => any;
  }
) => {
  const visit = (cst: any) => {
    if (cst.name in visitors) {
      return visitors[cst.name](cst.children, visit);
    }
    if (opt?.default) {
      return opt.default(cst, visit);
    }
    return cst;
  };
  return visit;
};

export const visitSubRule = (
  cst: any,
  visitor: (cst: any) => any,
  opt?: { name?: string; omit?: string[]; error?: string }
) => {
  let c = cst;
  if (opt?.omit) {
    c = omit(c, opt.omit);
  }

  const keys = Object.keys(c);
  if (keys.length === 1 && c[keys[0]]?.length === 1) {
    return visitor(c[keys[0]][0]);
  }

  console.log(cst);
  throw new Error(
    opt?.error || `COULD NOT MAP '${opt?.name}' ${JSON.stringify(cst)}`
  );
};
