import { ComponentProps, forwardRef } from 'react';
import { Input } from '../input';

export const InputFit = forwardRef<
  HTMLInputElement,
  ComponentProps<typeof Input>
>(({ value, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      value={value}
      {...props}
      size={Math.max(value?.toString().length || 4, 4)}
    />
  );
});
InputFit.displayName = 'InputFit';
