import { parserCFile } from '../../../parser';

describe('parser', () => {
  describe('ast', () => {
    describe('include', () => {
      it('should parse include file', () => {
        const res = parserCFile(`#include "file.h"`);
        expect(res).toEqual({
          type: 'statements',
          values: [{ type: 'include', fileName: 'file.h' }],
        });
      });
    });
  });
});
