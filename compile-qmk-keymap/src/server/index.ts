import express from 'express';
import z from 'zod';
import { QMK_FOLDER, SERVER_PORT } from './config';
import { isDir } from '../lib/isDir';
import bodyParser from 'body-parser';
import { compileKeymap } from '../compile';
import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';

const validateKeymap = z
  .object({
    keyboardQmkPath: z.string().nonempty(),
    layout: z.string(),
    layers: z
      .object({
        name: z.string(),
        keys: z.string().array(),
      })
      .array(),
  })
  .required({
    keyboardQmkPath: true,
  });

export const main = async () => {
  console.log('qmk folder:', QMK_FOLDER);
  if (!(await isDir(QMK_FOLDER))) {
    console.warn(`qmk folder does not exists`);
  }

  const app = express();

  app.use(bodyParser.json());

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
