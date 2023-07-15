import { parseC } from '../../../../parser';

describe('parser', () => {
  describe('value expression', () => {
    it('should parse int array list', () => {
      const ast = parseC(`{ 1, 2, 3}`, (p) => p.valueExpression());
      expect(ast).toEqual({
        type: 'array',
        values: {
          0: 1,
          1: 2,
          2: 3,
        },
      });
    });

    it('should parse int array list with dangling comma', () => {
      const ast = parseC(`{ 1, 2, 3, }`, (p) => p.valueExpression());
      expect(ast).toEqual({
        type: 'array',
        values: {
          0: 1,
          1: 2,
          2: 3,
        },
      });
    });

    it('should parse call array list', () => {
      const ast = parseC(`{ test(), test(), test()}`, (p) =>
        p.valueExpression(),
      );
      expect(ast).toEqual({
        type: 'array',
        values: {
          0: {
            type: 'postCall',
            fn: 'test',
            calls: [[]],
          },
          1: {
            type: 'postCall',
            fn: 'test',
            calls: [[]],
          },
          2: {
            type: 'postCall',
            fn: 'test',
            calls: [[]],
          },
        },
      });
    });
  });
});
