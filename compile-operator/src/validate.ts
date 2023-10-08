import { z } from 'zod';

type KeyInput =
  | string
  | {
      key: string;
      params: (
        | {
            type: 'layer';
            value: string;
          }
        | {
            type: 'key';
            value: KeyInput;
          }
      )[];
    };

// @ts-ignore
const validateKey: z.ZodType<KeyInput> = z.union([
  z.string(),
  z.strictObject({
    key: z.string(),
    params: z
      .union([
        z.strictObject({
          type: z.enum(['layer']),
          value: z.string(),
        }),
        z.strictObject({
          type: z.enum(['key']),
          value: z.lazy(() => validateKey),
        }),
      ])
      .array(),
  }),
]);

export const validateCompileData = z.strictObject({
  keyboardQmkPath: z.string(),
  layout: z.string(),
  layers: z
    .strictObject({
      id: z.string(),
      name: z.string(),
      keys: validateKey.array(),
    })
    .array(),
});

export type CompileKeymapInput = z.output<typeof validateCompileData>;
