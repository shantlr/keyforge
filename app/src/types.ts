export type KeyboardInfo = {
  keyboard_name?: string;
  manufacturer?: string;
  url?: string;
  maintainer?: string;
  matrix_pins?: {
    cols: string[];
    rows: string[];
  };
  layouts: Record<
    string,
    {
      layout: {
        matrix: number[];
        x: number;
        y: number;
        w?: number;
        h?: number;
      }[];
    }
  >;
  keymaps: string[];
};

export type KeymapKeyParam =
  | {
      type: 'layer';
      value: string | null;
    }
  | {
      type: 'key';
      value: KeymapKeyDef | null;
    };

export type KeymapKeyDef =
  | string
  | {
      key: string;
      params: KeymapKeyParam[];
    };
export type CompileKeymapInput = {
  keyboardQmkPath: string;
  layout: string;
  layers: { id: string; name: string; keys: KeymapKeyDef[] }[];
};
