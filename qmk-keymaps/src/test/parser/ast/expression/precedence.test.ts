import { parseC } from '../../../../parser';

describe('parser', () => {
  describe('value expression', () => {
    describe('or', () => {
      it('should parse or 2', () => {
        const ast = parseC(`false || true && true`, (p) => p.valueExpression());
        expect(ast).toEqual({
          type: 'or',
          values: [
            false,
            {
              type: 'and',
              values: [true, true],
            },
          ],
        });
      });

      it('should parse or 3', () => {
        const ast = parseC(`A && B || C`, (p) => p.valueExpression());
        expect(ast).toEqual({
          type: 'or',
          values: [
            {
              type: 'and',
              values: ['A', 'B'],
            },
            'C',
          ],
        });
      });
    });
  });
});
