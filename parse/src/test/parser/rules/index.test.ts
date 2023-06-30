import { lexer, parser } from '../../../parser';

describe('parser', () => {
  describe('rules', () => {
    describe(`type`, () => {
      it('should parse simple typed identifier', () => {
        const text = `uint8_t`;
        const l = lexer.tokenize(text);
        parser.input = l.tokens;
        const res = parser.valueType();
        expect(res).toMatchObject({
          name: 'valueType',
          children: {
            identifier: [
              {
                image: `uint8_t`,
              },
            ],
          },
        });
      });
    });

    describe('typed identifier', () => {
      it('should parse typed identifier without modifier', () => {
        const text = `uint8_t led_min`;
        const l = lexer.tokenize(text);
        parser.input = l.tokens;
        const res = parser.typedIdentifier();
        expect(res).toMatchObject({
          children: {
            type: [
              {
                children: {
                  identifier: [
                    {
                      image: 'uint8_t',
                    },
                  ],
                },
              },
            ],
            name: [
              {
                image: 'led_min',
              },
            ],
          },
        });
      });
      it('should parse typed identifier with modifier', () => {
        const text = `uint8_t PROGMEM led_min`;
        const l = lexer.tokenize(text);
        parser.input = l.tokens;
        const res = parser.typedIdentifier();
        expect(res).toMatchObject({
          children: {
            type: [
              {
                children: {
                  identifier: [
                    {
                      image: 'uint8_t',
                    },
                  ],
                },
              },
            ],
            modifier: [
              {
                image: 'PROGMEM',
              },
            ],
            name: [
              {
                image: 'led_min',
              },
            ],
          },
        });
      });
    });
  });
});
