import { CompileKeymapInput } from '@/types';
import { CompileRunner } from '.';
import axios from 'axios';

export class ApiCompileRunner implements CompileRunner {
  constructor(public config: { url: string }) {}

  async run(input: CompileKeymapInput) {
    console.log(`[runner] {api}: sending compile request...`);
    const res = await axios.post(`${this.config.url}/api/compile`, input, {
      responseType: 'arraybuffer',
    });
    console.log(`[runner] {api}: compiled`);
    return res.data;
  }
}
