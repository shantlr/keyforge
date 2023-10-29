import Docker, { DockerOptions } from 'dockerode';

import { CompileKeymapInput } from '../../validate.js';
import { CompileRunner } from './interface.js';
import { sleep } from '../sleep.js';
import { randomInt } from 'node:crypto';
import axios from 'axios';
import { customAlphabet } from 'nanoid';

export class DockerCompileRunner implements CompileRunner {
  docker: Docker;

  static portRange = [6000, 7000] as const;

  static usedPorts = new Set<number>();
  static getAvailablePort() {
    for (let i = 0; i < 100; i += 1) {
      const port = randomInt(
        DockerCompileRunner.portRange[0],
        DockerCompileRunner.portRange[1],
      );

      if (!DockerCompileRunner.usedPorts.has(port)) {
        DockerCompileRunner.usedPorts.add(port);
        return port;
      }
    }
    throw new Error('No available port');
  }

  constructor(
    public config: {
      connection: DockerOptions;
      compileImage: string;
      networkModeHost?: boolean;
      usedNetwork?: string;
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
    const port = DockerCompileRunner.getAvailablePort();
    try {
      console.log(
        `[runner] starting qmk-keymap-compiler in server mode (port: ${port})...`,
      );
      const networkAlias = customAlphabet(
        '0123456789abcdefghijklmnopqrstuvwxxyz',
      )();
      const container = await this.docker.createContainer({
        // name: `qmk_compile_job_$`,
        Image: this.config.compileImage,
        Env: [`SERVER_PORT=${port}`],
        ExposedPorts: this.config.networkModeHost
          ? {
              [`${port}/tcp`]: {},
            }
          : undefined,
        HostConfig: {
          AutoRemove: true,
          PortBindings: this.config.networkModeHost
            ? {
                [`${port}/tcp`]: [{ HostPort: port.toString() }],
              }
            : undefined,
        },
        NetworkingConfig: {
          EndpointsConfig: this.config.usedNetwork
            ? {
                [this.config.usedNetwork]: {
                  Aliases: [networkAlias],
                },
              }
            : undefined,
        },
        Cmd: ['./cli', 'server'],
      });
      console.log(`[runner] container '${container.id}' created`);
      console.log(`[runner] waiting 'qmk-keymap-compiler' to be ready...`);

      const containerUrl = this.config.networkModeHost
        ? `http://localhost:${port}`
        : `http://${networkAlias}:${port}`;

      let stream: NodeJS.ReadWriteStream;
      try {
        await container.start();

        while (true) {
          const state = await container.inspect();
          if (!state.State.Running) {
            console.log('[runner] container is not running');
            throw new Error(`CONTAINER_FAILED_TO_START`);
          }

          try {
            await axios.get(`${containerUrl}/api/health/ready`);
            console.log('[runner] container is ready');
            break;
          } catch (err) {
            console.log('[runner] container is not ready yet');
          }
          await sleep(2000);
        }

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
        console.log('[runner] container output attached to stream');

        const res = await axios.post(`${containerUrl}/api/compile`, input, {
          responseType: 'arraybuffer',
        });

        return res.data;
      } finally {
        if (typeof stream?.end === 'function') {
          stream.end();
        }
        try {
          const state = await container.inspect();
          if (state.State.Running) {
            await container.kill();
            console.log(`[runner] container '${container.id}' killed`);
          }
        } catch (err) {
          console.error(`[runner] failed to remove container`, err);
        }
      }
    } finally {
      DockerCompileRunner.usedPorts.delete(port);
    }
  }
}
