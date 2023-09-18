export type KeyInput =
  | string
  | {
      key: string;
      params: (
        | {
            type: 'layer';
            value: string;
          }
        | {
            type: 'key';
            value: string | KeyInput;
          }
      )[];
    };

export type KeymapInput = {
  keyboardQmkPath: string;
  layout: string;
  layers: {
    id: string;
    name: string;
    keys: KeyInput[];
  }[];
};

export type KeyboardInfo = {
  keyboard_name: string;
  layout_aliases?: Record<string, string>;
  layouts?: Record<
    string,
    {
      layout: {
        matrix: [number, number];
        x: number;
        y: number;
      }[];
    }
  >;
};
