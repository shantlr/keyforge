import { CompileKeymapInput } from '../../validate.js';

export interface CompileRunner {
  run(
    input: CompileKeymapInput,
    opt?: {
      onStdout?: (data: string) => void;
      onStderr?: (data: string) => void;
    },
  ): Promise<ArrayBuffer>;
}
