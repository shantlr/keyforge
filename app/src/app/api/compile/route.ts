import { keyboardInfo } from '@/lib/keyboards';
import { COMPILE } from '@/server/compile';
import { KeymapKeyDef } from '@/types';
import { NextResponse } from 'next/server';
import { ZodError, z } from 'zod';

const validateKey: z.ZodType<KeymapKeyDef> = z.union([
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

const validate = z.strictObject({
  keyboardKey: z.string(),
  layout: z.string(),
  layers: z
    .strictObject({
      id: z.string(),
      name: z.string(),
      keys: validateKey.array(),
    })
    .array(),
});

/**
 * Create a compile job
 */
export async function POST(request: Request) {
  try {
    const parsed = validate.parse(await request.json());

    const kb = await keyboardInfo.get(parsed.keyboardKey);
    const job = COMPILE.createJob({
      keyboardQmkPath: kb.qmkpath,
      layers: parsed.layers,
      layout: parsed.layout,
    });

    return NextResponse.json({
      success: true,
      job,
    });
    // request.signal.addEventListener('abort', () => {
    //   console.log('[compile] request aborted: cancelling job');
    //   COMPILE.canceJob(job.id);
    // });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({
        success: false,
        code: 'INVALID_INPUT',
        errors: err.errors,
      });
    }

    console.error(err);
    return NextResponse.json({
      success: false,
      code: 'INTERNAL',
    });
  }
}
