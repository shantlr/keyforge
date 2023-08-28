import { spawn } from 'child_process';
import kill from 'tree-kill';
import { sleep } from '@/lib/sleep';
import getPort from 'get-port';
import { CompileRunner } from '.';
import { CompileKeymapInput } from '@/types';
import axios, { AxiosError } from 'axios';

const serverIsReady = async (url: string) => {
  while (true) {
    try {
      const res = await axios.get(`${url}/api/health/ready`);
      if (res.status === 200) {
        return;
      }
    } catch (err) {}
    await sleep(200);
  }
};

export class LocalCompileRunner implements CompileRunner {
  constructor(public config: { path: string; command: string[] }) {}

  async run(
    input: CompileKeymapInput,
    opt?: {
      onStdout?: (data: string) => void;
      onStderr?: (data: string) => void;
    }
  ) {
    const port = await getPort();

    console.log(`[runner] {local}: starting server...`);
    const p = spawn(this.config.command[0], this.config.command.slice(1), {
      cwd: this.config.path,
      env: {
        PATH: process.env.PATH,
        NODE_ENV: process.env.NODE_ENV,
        TZ: process.env.TZ,
        SERVER_PORT: port.toString(),
      },
    });

    p.stdout?.on('data', (data: Buffer) => {
      const str = data.toString();
      console.log(`[runner] {local}`, str);
      opt?.onStdout?.(str);
    });
    p.stderr?.on('data', (data: Buffer) => {
      const str = data.toString();
      console.error(`[runner] {local}`, str);
      opt?.onStderr?.(str);
    });

    try {
      const url = `http://localhost:${port}`;

      await Promise.race([
        serverIsReady(url),
        new Promise((resolve, reject) => {
          setTimeout(() => reject(new Error('')), 10 * 1000);
        }),
      ]);
      console.log(`[runner] {local}: server ready`);

      const res = await axios.post(`${url}/api/compile`, input, {
        responseType: 'arraybuffer',
      });
      console.log(`[runner] {local}: compiled`);
      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new Error(`COMPILED_FAILED: ${err.message}`);
      }
      throw err;
    } finally {
      if (!p.pid) {
        return;
      }

      kill(p.pid as number, 'SIGKILL');
      console.log(`[runner] {local}:`, p.pid, 'killed');
    }
  }
}
