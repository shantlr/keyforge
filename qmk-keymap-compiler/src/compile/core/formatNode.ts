import { map } from 'lodash';
import { StatementNode, StatementsNode, ValueExprNode } from './types';

export const formatNode = (
  node: StatementsNode | StatementNode | ValueExprNode,
) => {
  if (typeof node === 'string') {
    return node;
  }
  if (node === true) {
    return 'true';
  }
  if (node === false) {
    return 'false';
  }
  if (typeof node === 'number') {
    return node.toString();
  }

  switch (node.type) {
    case 'statements': {
      return node.values.map(formatNode).join('\n');
    }
    case 'include': {
      return `#include ${
        'fileName' in node ? `"${node.fileName}"` : node.value
      }`;
    }
    case 'define': {
      return `#define ${node.name} ${formatNode(node.value)};`;
    }
    case 'enum': {
      return (
        [
          `enum ${node.name || ''} {`,
          ...node.values.map((v) => {
            if (v.name && v.value) {
              return `  ${v.name} = ${v.value},`;
            }
            return `  ${v.name},`;
          }),
          '}',
        ].join('\n') + ';'
      );
    }

    case 'var': {
      const res = [];
      if (node.const) {
        res.push(`const`);
      }
      if (node.varType) {
        res.push(node.varType);
      }
      if (node.modifier) {
        res.push(node.modifier);
      }
      if (node.arrayDim?.length) {
        const dim: string[] = [];
        node.arrayDim?.forEach((d) => {
          if (!d.value) {
            dim.push(`[]`);
          } else {
            dim.push(`[${formatNode(d.value)}]`);
          }
        });
        res.push(`${node.name}${dim.join('')}`);
      } else {
        res.push(node.name);
      }
      res.push('=', formatNode(node.value));
      return `${res.join(' ')};`;
    }
    case 'array': {
      return [
        '{',
        ...map(node.values, (v, key) => {
          return `  [${key}] = ${formatNode(v)},`;
        }),
        '}',
      ].join('\n');
    }

    case 'postCall': {
      return `${node.fn}${node.calls
        .map((params) => `(${params.map(formatNode).join(', ')})`)
        .join('')}`;
    }

    case 'add': {
      return node.values.map((v) => formatNode(v)).join(' && ');
    }
    case 'or': {
      return node.values.map((v) => formatNode(v)).join(' || ');
    }
    case 'lt': {
      return node.values.map((v) => formatNode(v)).join(' < ');
    }
    case 'lte': {
      return node.values.map((v) => formatNode(v)).join(' <= ');
    }
    case 'gt': {
      return node.values.map((v) => formatNode(v)).join(' > ');
    }
    case 'gte': {
      return node.values.map((v) => formatNode(v)).join(' >= ');
    }
    default: {
      throw new Error(`Unhandled node: ${node.type}`);
    }
  }
};
