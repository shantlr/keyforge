import clsx from 'clsx';
import { CSSProperties, ReactNode } from 'react';

export type KeyTheme = {
  primary: string;
  secondary: string;
};

export const KEY_THEME: Record<string, KeyTheme> = {
  default: {
    primary: 'bg-slate-400',
    secondary: 'bg-slate-600',
  },
};

export const Key = ({
  style,
  children,
  onClick,
  textSize,
  isDown,
  theme: {
    primary = KEY_THEME.default.primary,
    secondary = KEY_THEME.default.secondary,
  } = KEY_THEME.default,
}: {
  style?: CSSProperties;
  children: ReactNode;
  onClick?: () => void;
  textSize?: string;
  isDown?: boolean;
  theme?: KeyTheme;
}) => {
  return (
    <div
      className={clsx(
        'group absolute select-none cursor-pointer rounded p-[2px] pb-[8px] transition-all hover:pb-[6px] active:pb-[2px] hover:mt-[2px] active:mt-[6px]',
        secondary
      )}
      style={style}
      onClick={onClick}
    >
      <div
        className={clsx(
          `text-mainbg ${primary} whitespace-pre group-hover:${secondary} text-center rounded-sm w-full h-full flex items-center justify-center transition`,
          textSize,
          {
            '': isDown,
            '': !isDown,
          }
        )}
      >
        {children}
      </div>
    </div>
  );
};
