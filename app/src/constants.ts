export const MAX_LAYERS = 32;

export const MAX_PARALLEL_JOB = Number(process.env.MAX_PARALLEL_JOB || 3);

export const COMPILE_JOB_ALIVE_TIMEOUT_MS =
  Number(process.env.COMPILE_JOB_ALIVE_TIMEOUT_MS) || 30 * 1000;
