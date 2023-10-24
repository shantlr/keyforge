import { parseC } from '../../../../parser';

describe('parser', () => {
  describe('value expression', () => {
    describe('or', () => {
      it('should parse or', () => {
        const ast = parseC(`false || true`, (p) => p.valueExpression());
        expect(ast).toEqual({
          type: 'or',
          values: [false, true],
        });
      });
    });
  });
});
