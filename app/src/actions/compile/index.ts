'use server';

import axios, { AxiosError } from 'axios';
import { z } from 'zod';

import { COMPILE_CONTROLLER_API_URL } from '@/config';
import { keyboardList } from '@/lib/keyboards';
import { KeymapKeyDef } from '@/types';

const compileController = axios.create({
  baseURL: COMPILE_CONTROLLER_API_URL,
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
) => {
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
    return res.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.code === 'ECONNREFUSED') {
        throw new Error(`COMPILE_RUNNER_NOT_READY`);
      }

      throw new Error(
        `COMPILE_CREATE_JOB_ERROR: ${err.status} ${err.response?.data}`
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
