export type StatementsNode = {
  type: 'statements';
  values: StatementNode[];
};

export type StatementNode = DefineNode | IncludeNode | EnumNode | VarNode;

export type DefineNode = {
  type: 'define';
  name: string;
  value: ValueExprNode | null;
};

export type IncludeNode = {
  type: 'include';
  fileName: string;
};

export type EnumNode = {
  type: 'enum';
  name: string;
  values: {
    name: string;
    value: number | string;
  }[];
};

export type VarNode = {
  type: 'var';
  const: boolean;
  varType: string;
  arrayDim: null;
  modifier?: string;
  name: string;
  value: ValueExprNode;
};

export type FnDefNode = {
  type: 'fnDef';
  returnType: TypeNode;
  name: string;
  params: {
    type: string;
    name: string;
    modifier?: string;
    arrayDim?: null;
  }[];
  body: FnInstructionNode[];
};
export type FnInstructionNode =
  | ReturnNode
  | FnCallNode
  | IfNode
  | WhileNode
  | SwitchCaseNode;

export type IfNode = {
  type: 'if';
  condition: ValueExprNode;
  do: FnInstructionNode[];
  else: FnInstructionNode[];
};
export type WhileNode = {
  type: 'while';
  condition: ValueExprNode;
  do: FnInstructionNode[];
};
export type SwitchCaseNode = {
  type: 'switch';
  value: ValueExprNode;
  cases: {
    matches: ValueExprNode[];
    default: boolean;
    do: FnInstructionNode[];
  }[];
};
export type ReturnNode = {
  type: 'return';
  value: ValueExprNode;
};

export type FnCallNode = {
  type: 'fnCall';
  name: string;
  params: ValueExprNode[];
};

export type StringNode = {
  type: 'string';
  value: string;
};

export type ArrayNode = {
  type: 'array';
  values: Record<string, ValueExprNode>;
};

export type AccessFieldNode = {
  type: 'accessField';
  value: ValueExprNode;
  field: string;
};
export type ValueExprNode =
  | string
  | number
  | FnCallNode
  | ArrayNode
  | true
  | false
  | StringNode
  | AccessFieldNode;

export type VoidNode = {
  type: 'void';
};

export type PtrNode = {
  type: 'ptr';
  nest: number;
  targetType: string;
};

export type TypeNode = VoidNode | string | PtrNode;
