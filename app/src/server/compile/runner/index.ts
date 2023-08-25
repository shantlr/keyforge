import { CompileKeymapInput } from '@/types';

export interface CompileRunner {
  run(input: CompileKeymapInput): Promise<ArrayBuffer>;
}
