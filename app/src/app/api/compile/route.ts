import { keyboardInfo } from '@/lib/keyboards';
import { COMPILE } from '@/server/compile';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const validate = z.strictObject({
  keyboardKey: z.string(),
  layout: z.string(),
  layers: z
    .strictObject({
      id: z.string(),
      name: z.string(),
      keys: z
        .union([
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
                  value: z.string(),
                }),
              ])
              .array(),
          }),
        ])
        .array(),
    })
    .array(),
});

/**
 * Create a compile job
 */
export async function POST(request: Request) {
  const parsed = validate.parse(await request.json());

  try {
    const kb = await keyboardInfo.get(parsed.keyboardKey);
    const job = COMPILE.createJob({
      keyboardQmkPath: kb.qmkpath,
      layers: parsed.layers,
      layout: parsed.layout,
    });

    return NextResponse.json(job);
    // request.signal.addEventListener('abort', () => {
    //   console.log('[compile] request aborted: cancelling job');
    //   COMPILE.canceJob(job.id);
    // });

    // while (true) {
    //   if (request.signal.aborted) {
    //     console.log('[compile] request aborted.');
    //     return;
    //   }

    //   const j = COMPILE.getJob(job.id);
    //   if (j.state === 'done') {
    //     return new Response(j.result, {
    //       status: 200,
    //     });
    //   }
    //   await sleep(500);
    // }
  } catch (err) {
    console.error(err);
    return {
      success: false,
    };
  }
}
