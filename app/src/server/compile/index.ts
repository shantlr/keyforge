import { COMPILE_JOB_ALIVE_TIMEOUT_MS, MAX_PARALLEL_JOB } from '@/constants';
import { CompileRunner } from './runner';
import { CompileKeymapInput } from '@/types';
import { LocalCompileRunner } from './runner/local';
import { ApiCompileRunner } from './runner/api';
import { Job, createJobQueue } from '@/lib/jobQueue';

let runner: CompileRunner;

if (process.env.RUNNER_MODE === 'local') {
  const localPath = (process.env.RUNNER_LOCAL_PATH ||
    '../compile-qmk-keymap') as string;
  const cmd = ['yarn', 'start'];
  runner = new LocalCompileRunner({
    path: localPath,
    command: cmd,
  });
  console.log(
    `[runner] local runner inited (path=${localPath} cmd=${cmd.join(' ')})`
  );
} else if (process.env.RUNNER_MODE === 'api') {
  runner = new ApiCompileRunner({ url: process.env.RUNNER_API_URL as string });
  console.log(`[runner] api runner inited (url=${process.env.RUNNER_API_URL})`);
} else {
  console.log(`[runner] missing configuration`);
}

const compile = async (
  data: CompileKeymapInput,
  job: Job<CompileKeymapInput, ArrayBuffer>
) => {
  if (!runner) {
    throw new Error('No runner available');
  }

  return await runner.run(data, {
    onStdout(data) {
      job.logs.push(data);
    },
    onStderr(data) {
      job.logs.push(data);
    },
  });
};

export const COMPILE = createJobQueue({
  handler: compile,
  maxParallel: MAX_PARALLEL_JOB,
  jobTimeoutMs: COMPILE_JOB_ALIVE_TIMEOUT_MS,
});
