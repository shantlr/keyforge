export type KeymapInput = {
  keyboardName: string;
  layout: string;
  layers: {
    name: string;
    keys: string[];
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
