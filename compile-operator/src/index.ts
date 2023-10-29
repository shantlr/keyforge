import bodyParser from 'body-parser';
import express from 'express';
import { createJobQueue } from './lib/jobQueue.js';
import {
  COMPILE_JOB_ALIVE_TIMEOUT_MS,
  MAX_PARALLEL_JOB,
  RUNNER_DOCKER_IMAGE,
  RUNNER_DOCKER_SOCKET,
  RUNNER_LOCAL_PATH,
  RUNNER_MODE,
  SERVICE_PORT,
} from './config/index.js';
import { CompileRunner } from './lib/compileRunner/interface.js';
import { CompileKeymapInput, validateCompileData } from './validate.js';
import { ZodError } from 'zod';
import { LocalCompileRunner } from './lib/compileRunner/local.js';
import { DockerCompileRunner } from './lib/compileRunner/docker.js';

const main = async () => {
  const app = express();

  app.use(bodyParser.json());

  let runner: CompileRunner;
  //#region Init runner
  if (RUNNER_MODE === 'local') {
    const localPath = RUNNER_LOCAL_PATH;
    const cmd = ['yarn', 'start'];
    runner = new LocalCompileRunner({
      path: localPath,
      command: cmd,
    });
    console.log(
      `[runner] local runner inited (path=${localPath} cmd=${cmd.join(' ')})`,
    );
  } else if (RUNNER_MODE === 'docker') {
    runner = new DockerCompileRunner({
      connection: {
        socketPath: RUNNER_DOCKER_SOCKET,
      },
      compileImage: RUNNER_DOCKER_IMAGE,
      tmpDir: './tmp',
    });
    console.log(
      `[runner] docker runner inited (socket=${RUNNER_DOCKER_SOCKET} image=${RUNNER_DOCKER_IMAGE} dir=./tmp)`,
    );
  } else if (RUNNER_MODE) {
    console.error(`Unrecognized runner mode: ${RUNNER_MODE}`);
  } else {
    console.error('Runner mode not provided, please set `RUNNER_MODE` env var');
  }
  if (!runner) {
    throw new Error('Could not initialize runner');
  }
  //#endregion

  const compileQueue = createJobQueue<CompileKeymapInput, ArrayBuffer>({
    handler: async (data, job) => {
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
    },
    maxParallel: MAX_PARALLEL_JOB,
    jobTimeoutMs: COMPILE_JOB_ALIVE_TIMEOUT_MS,
  });

  app.use((req, res, next) => {
    console.log(`[IN] [${req.method}] ${req.path}`);
    const onRes = () => {
      console.log(`[OUT] [${req.method}] ${req.path} {${res.statusCode}}`);
      res.off('close', onRes);
    };
    res.on('close', onRes);
    next?.();
  });

  app.post('/compile/job', async (req, res) => {
    try {
      const data = validateCompileData.parse(req.body);
      const job = compileQueue.createJob(data);
      return res.send({
        success: true,
        job,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        console.error('validation error', err);
        return res.send({
          success: false,
          code: 'VALIDATE_INPUT_ERRORS',
          errors: err.errors,
        });
      }
      console.error(err);
      return res.status(500).send();
    }
  });
  app.get('/compile/job/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const job = compileQueue.getJob(id);
      return res.send(job);
    } catch (err) {
      console.error(err);
      return res.status(500).send();
    }
  });
  app.post('/compile/job/:id/run', async (req, res) => {
    try {
      const { id } = req.params;
      const buffer = await compileQueue.runJob(id);
      return res.send(buffer);
    } catch (err) {
      console.error(err);
      return res.status(500).send();
    }
  });

  app.listen(SERVICE_PORT, () => {
    console.log(`Listening to http://localhost:${SERVICE_PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
  console.error('exiting (1)...');
  process.exit(1);
});
