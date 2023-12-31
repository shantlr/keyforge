'use server';

import axios, { AxiosError } from 'axios';
import { z } from 'zod';

import { COMPILE_OPERATOR_API_URL } from '@/config';
import { keyboardList } from '@/lib/keyboards';
import { KeymapKeyDef } from '@/types';

const compileController = axios.create({
  baseURL: COMPILE_OPERATOR_API_URL,
});

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

const validateCompileJobData = z.strictObject({
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

export type CompileJob = {
  id: string;
  state: 'pending' | 'ready' | 'ongoing' | 'done';
  logs: string[];
};

export const $$compileCreateJob = async (
  data: z.input<typeof validateCompileJobData>
): Promise<{
  success: boolean;
  job?: CompileJob;
  error_code?: 'COMPILE_OPERATOR_NOT_READY' | 'COMPILE_OPERATOR_NOT_SETUP';
}> => {
  if (!COMPILE_OPERATOR_API_URL) {
    return {
      success: false,
      error_code: 'COMPILE_OPERATOR_NOT_SETUP',
    };
  }
  try {
    const parsed = validateCompileJobData.parse(data);
    const list = await keyboardList.get();
    const keyboard = list.find((l) => l.key === parsed.keyboardKey);
    if (!keyboard) {
      throw new Error(`KEYBOARD_NOT_FOUND`);
    }
    const res = await compileController.post<{
      job: CompileJob;
    }>('/compile/job', {
      keyboardQmkPath: keyboard.qmkpath,
      layout: parsed.layout,
      layers: parsed.layers,
    });
    return {
      success: true,
      job: res.data.job,
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.code === 'ECONNREFUSED') {
        console.log('Failed to connect to ', COMPILE_OPERATOR_API_URL);

        return {
          success: false,
          error_code: 'COMPILE_OPERATOR_NOT_READY',
        };
      }
      if (err.code === 'EAI_AGAIN') {
        console.log(`failed to resolved dns`, COMPILE_OPERATOR_API_URL);
      }

      throw new Error(
        `COMPILE_CREATE_JOB_ERROR: [${err.code}] {${err.status}} s`
      );
    }

    console.error(err, `failed to create compile job`);
    throw new Error(`INTERNAL_SERVER_ERROR`);
  }
};

export const $$compilePingJob = async (jobId: string) => {
  const res = await compileController.get<CompileJob>(`/compile/job/${jobId}`);
  return res.data;
};

export const $$compileRunJob = async (jobId: string) => {
  const res = await compileController.post(`/compile/job/${jobId}/run`);
  return res.data;
};
