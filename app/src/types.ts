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
