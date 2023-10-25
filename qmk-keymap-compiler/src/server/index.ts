import express from 'express';
import z from 'zod';
import { QMK_FOLDER, SERVER_PORT } from './config';
import { isDir } from '../lib/isDir';
import bodyParser from 'body-parser';
import { compileKeymap } from '../compile';
import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';
import { KeyInput } from '../types';

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

const validateKeymap = z.strictObject({
  keyboardQmkPath: z.string().nonempty(),
  layout: z.string(),
  layers: z
    .strictObject({
      id: z.string(),
      name: z.string(),
      keys: validateKey.array(),
    })
    .array(),
});

export const main = async () => {
  console.log('qmk folder:', QMK_FOLDER);
  if (!(await isDir(QMK_FOLDER))) {
    console.warn(`qmk folder does not exists`);
  }

  const app = express();

  app.use(bodyParser.json());

  app.get('/api/health/ready', (req, res) => {
    return res.send('OK');
  });

  app.post('/api/compile', async (req, res) => {
    try {
      const body = validateKeymap.parse(req.body);

      await compileKeymap({
        keymap: body as any,
        qmkCwd: QMK_FOLDER,
        cleanKeymap: true,

        onBin: async ({ binPath }) => {
          await pipeline(createReadStream(binPath), res);
        },
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).send({
          success: false,
          code: 'INVALID_BODY',
          errors: err.errors,
        });
      }

      console.error(err);
      return res.status(500).send();
    }
  });

  app.listen(SERVER_PORT, () => {
    console.log(`Listnening to http://localhost:${SERVER_PORT}`);
  });
};

main().catch((err) => {
  console.error(err, `main failed (exiting...)`);
  process.exit(1);
});
