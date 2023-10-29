export const SERVICE_PORT = process.env.SERVICE_PORT || 3022;

export const MAX_PARALLEL_JOB = Number(process.env.MAX_PARALLEL_JOB) || 1;
export const COMPILE_JOB_ALIVE_TIMEOUT_MS =
  Number(process.env.COMPILE_JOB_ALIVE_TIMEOUT_MS) || 30_000;

export const RUNNER_MODE = process.env.RUNNER_MODE;
export const RUNNER_LOCAL_PATH = process.env.RUNNER_LOCAL_PATH;

export const RUNNER_DOCKER_SOCKET = process.env.RUNNER_DOCKER_SOCKET || '';
export const RUNNER_DOCKER_IMAGE = process.env.RUNNER_DOCKER_IMAGE || '';
export const RUNNER_DOCKER_NETWORK = process.env.RUNNER_DOCKER_NETWORK || '';
export const RUNNER_DOCKER_NETWORK_MODE_HOST =
  process.env.RUNNER_DOCKER_NETWORK_MODE_HOST === 'true';
