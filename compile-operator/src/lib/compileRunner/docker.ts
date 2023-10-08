import Docker, { DockerOptions } from 'dockerode';
import path from 'node:path';

import { CompileKeymapInput } from '../../validate.js';
import { CompileRunner } from './interface.js';
import { nanoid } from 'nanoid';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { sleep } from '../sleep.js';

export class DockerCompileRunner implements CompileRunner {
  docker: Docker;

  constructor(
    public config: {
      connection: DockerOptions;
      compileImage: string;
      tmpDir: string;
    },
  ) {
    this.docker = new Docker(this.config.connection);
  }

  async run(
    input: CompileKeymapInput,
    opt?: {
      onStdout?: (data: string) => void;
      onStderr?: (data: string) => void;
    },
  ): Promise<ArrayBuffer> {
    const dir = path.resolve(this.config.tmpDir, nanoid());
    await mkdir(dir, { recursive: true });
    await writeFile(
      path.resolve(dir, 'keymapInput.json'),
      JSON.stringify(input),
    );
    console.log(`[runner] keymapInput.json wrote to ${dir}`);

    const container = await this.docker.createContainer({
      Image: this.config.compileImage,
      Volumes: {
        '/data': {},
      },
      HostConfig: {
        Mounts: [
          {
            Type: 'bind',
            Source: dir,
            Target: '/data',
            ReadOnly: false,
          },
        ],
      },
      Cmd: [
        './cli',
        'compile',
        '/data/keymapInput.json',
        '-o',
        '/data/firmware.bin',
      ],
    });
    console.log(`[runner] container '${container.id}' created`);
    let stream: NodeJS.ReadWriteStream;
    try {
      stream = await container.attach({
        stdout: true,
        stderr: true,
        stream: true,
      });
      stream.on('data', (data: Buffer) => {
        // docker attach format: https://docs.docker.com/engine/api/v1.28/#tag/Container/operation/ContainerAttach
        // header := [8]byte{STREAM_TYPE, 0, 0, 0, SIZE1, SIZE2, SIZE3, SIZE4}
        // STREAM_TYPE: 0=stding, 1=stdout, 2=stderr:
        const HEADER_SIZE = 8;
        const streamType = data.readInt8();
        const str = data.toString('utf-8', HEADER_SIZE);
        if (streamType === 1) {
          opt?.onStdout(str);
        } else {
          opt?.onStderr(str);
        }
      });
      await container.start();

      while (true) {
        const info = await container.inspect();
        if (info.State.Status === 'exited') {
          if (info.State.ExitCode === 0) {
            console.log(
              `[runner] container '${container.id} successfully exited (${info.State.ExitCode})`,
            );
            const buffer = await readFile(path.resolve(dir, 'firmware.bin'));
            return buffer;
          }

          console.log(
            `[runner] container '${container.id} failed: exited with ${info.State.ExitCode}`,
          );
          throw new Error(`COMPILE_FAILED`);
        }

        await sleep(500);
      }
    } finally {
      if (stream?.end) {
        stream.end();
      }
      await container.remove({});
      await rm(dir, { recursive: true });
      console.log(`[runner] container '${container.id}' removed`);
    }
  }
}
