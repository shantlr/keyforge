export type StatementsNode = {
  type: 'statements';
  values: StatementNode[];
};

export type StatementNode =
  | DefineNode
  | IncludeNode
  | EnumNode
  | VarNode
  | PreprocIfNode<StatementNode[]>
  | FnDefNode;

export type DefineNode = {
  type: 'define';
  name: string;
  value: ValueExprNode | null;
};
export type IncludeNode =
  | {
      type: 'include';
      fileName: string;
    }
  | {
      type: 'include';
      value: string;
    };
export type PreprocIfNode<T> = {
  type: 'preprocIf';
  condition: any;
  value: T;
  elseifs: {
    condition: any;
    value: T;
  }[];
  else?: PreprocIfNode<T> | null;
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
  | SwitchCaseNode
  | PreprocIfNode<FnInstructionNode[]>
  | ContinueNode
  | BreakNode;
export type ContinueNode = {
  type: 'continue';
};
export type BreakNode = {
  type: 'break';
};

export type IfNode = {
  type: 'if';
  condition: ValueExprNode;
  do: FnInstructionNode[];

  elseifs: {
    condition: ValueExprNode;
    do: FnInstructionNode[];
  }[];
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

export type PostBracketIndexNode = {
  type: 'postBracketIndex';
  values: ValueExprNode[];
};
export type PostDotIndexNode = {
  type: 'postDotIndex';
  values: ValueExprNode[];
};
export type PostArrowIndexNode = {
  type: 'postArrowIndex';
  values: ValueExprNode[];
};
export type PostCallNode = {
  type: 'postCall';
  fn: ValueExprNode;
  calls: ValueExprNode[][];
};
export type PostIncNode = {
  type: 'postInc';
  values: ValueExprNode[];
};
export type PostDecNode = {
  type: 'postDec';
  values: ValueExprNode[];
};

export type AndNode = {
  type: 'and';
  values: ValueExprNode[];
};
export type OrNode = {
  type: 'or';
  values: ValueExprNode[];
};
export type AddNode = {
  type: 'add';
  values: ValueExprNode[];
};
export type SubtractNode = {
  type: 'subtract';
  values: ValueExprNode[];
};
export type MultNode = {
  type: 'mult';
  values: ValueExprNode[];
};
export type DivideNode = {
  type: 'divide';
  values: ValueExprNode[];
};
export type ModuloNode = {
  type: 'modulo';
  values: ValueExprNode[];
};
export type EqualNode = {
  type: 'equal';
  values: ValueExprNode[];
};
export type DiffNode = {
  type: 'diff';
  values: ValueExprNode[];
};
export type ShiftRightNode = {
  type: 'shiftRight';
  values: ValueExprNode[];
};
export type ShiftLeftNode = {
  type: 'shiftLeft';
  values: ValueExprNode[];
};
export type BitAndNode = {
  type: 'bitAnd';
  values: ValueExprNode[];
};
export type BitOrNode = {
  type: 'bitOr';
  values: ValueExprNode[];
};
export type LtNode = {
  type: 'lt';
  values: ValueExprNode[];
};
export type LteNode = {
  type: 'lte';
  values: ValueExprNode[];
};
export type GtNode = {
  type: 'gt';
  values: ValueExprNode[];
};
export type GteNode = {
  type: 'gte';
  values: ValueExprNode[];
};
export type TernaryNode = {
  type: 'ternary';
  condition: ValueExprNode;
  true: ValueExprNode;
  false: ValueExprNode;
};

export type ValueExprNode =
  | string
  | number
  | FnCallNode
  | ArrayNode
  | true
  | false
  | StringNode
  | TernaryNode
  | AndNode
  | OrNode
  | AddNode
  | LtNode
  | LteNode
  | GtNode
  | GteNode
  | ShiftLeftNode
  | ShiftRightNode
  | BitAndNode
  | BitOrNode
  | SubtractNode
  | MultNode
  | DivideNode
  | ModuloNode
  | DiffNode
  | EqualNode
  | PostArrowIndexNode
  | PostBracketIndexNode
  | PostDotIndexNode
  | PostCallNode
  | PostIncNode
  | PostDecNode;

export type VoidNode = {
  type: 'void';
};

export type PtrNode = {
  type: 'ptr';
  nest: number;
  targetType: string;
};

export type TypeNode = VoidNode | string | PtrNode;
