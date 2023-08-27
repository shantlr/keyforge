export type KeymapInput = {
  keyboardQmkPath: string;
  layout: string;
  layers: {
    id: string;
    name: string;
    keys: (
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
                value: string;
              }
          )[];
        }
    )[];
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
