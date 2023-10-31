import Docker, { Container, DockerOptions } from 'dockerode';
import { randomInt } from 'node:crypto';
import axios from 'axios';
import { customAlphabet } from 'nanoid';

import { CompileKeymapInput } from '../../validate.js';
import { CompileRunner } from './interface.js';
import { sleep } from '../sleep.js';

export class DockerCompileRunner implements CompileRunner {
  docker: Docker;

  static portRange = [6000, 7000] as const;
  static DEFAULT_TIMEOUT = 5 * 60 * 1000;

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
      timeout?: number;
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
      const container = await this.createContainer({
        port,
        networkAlias,
      });
      console.log(`[runner] container '${container.id}' created`);
      console.log(`[runner] waiting 'qmk-keymap-compiler' to be ready...`);

      try {
        await container.start();
        let timeout: NodeJS.Timeout;

        const res = await Promise.race([
          this.compileFirmware({
            input,
            container,
            networkAlias,
            port,
            onStderr: opt?.onStderr,
            onStdout: opt?.onStdout,
          }),
          new Promise<void>((_, reject) => {
            timeout = setTimeout(() => {
              reject(new Error('COMPILE_TIMEOUT'));
            }, this.config.timeout || DockerCompileRunner.DEFAULT_TIMEOUT);
          }),
        ]);
        if (timeout) {
          clearTimeout(timeout);
        }

        return res as ArrayBuffer;
      } finally {
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

  protected async compileFirmware({
    input,
    networkAlias,
    port,
    container,
    onStdout,
    onStderr,
  }: {
    input: CompileKeymapInput;
    networkAlias: string;
    port: number;
    container: Container;
    onStdout?: (str: string) => void;
    onStderr?: (str: string) => void;
  }): Promise<ArrayBuffer> {
    let stream: NodeJS.ReadWriteStream;
    const containerUrl = this.config.networkModeHost
      ? `http://localhost:${port}`
      : `http://${networkAlias}:${port}`;

    try {
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
          onStdout?.(str);
        } else {
          onStderr?.(str);
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
    }
  }
  protected async createContainer({
    networkAlias,
    port,
  }: {
    networkAlias: string;
    port: number;
  }) {
    return await this.docker.createContainer({
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
  }
}
