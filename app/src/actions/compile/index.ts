'use server';

import { keyboardInfo } from '@/lib/keyboards';
import { sleep } from '@/lib/sleep';
import { COMPILE } from '@/server/compile';
import { z } from 'zod';

const validate = z.strictObject({
  keyboardKey: z.string(),
  layout: z.string(),
  layers: z
    .strictObject({
      name: z.string(),
      keys: z.string().array(),
    })
    .array(),
});

export const $$compileKeymap = async (input: {
  keyboardKey: string;
  layout: string;
  layers: {
    name: string;
    keys: string[];
  }[];
}) => {
  const parsed = validate.parse(input);

  try {
    const kb = await keyboardInfo.get(parsed.keyboardKey);
    const job = COMPILE.createJob({
      keyboardQmkPath: kb.qmkpath,
      layers: parsed.layers,
      layout: parsed.layout,
    });
    while (true) {
      const j = COMPILE.getJob(job.id);
      if (j.state === 'done') {
        console.log(typeof j.result);
        return {
          success: true,
          blob: j.result,
        };
      }
      await sleep(500);
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
    };
  }
};
