declare global {
  declare namespace NodeJS {
    interface ProcessEnv {
      MAX_PARALLEL_JOB?: string;
      RUNNER_MODE?: string;
    }
  }
}
