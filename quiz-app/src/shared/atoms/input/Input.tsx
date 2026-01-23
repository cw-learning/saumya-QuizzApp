import { memo } from 'react';
import type { InputProps } from './input.types';
import { inputBaseStyles, inputErrorStyles } from './input.styles';

function InputComponent({
  type = 'text',
  hasError = false,
  className = '',
  ...props
}: InputProps) {
  return (
    <input
      type={type}
      aria-invalid={hasError || undefined}
      className={[
        inputBaseStyles,
        hasError && inputErrorStyles,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}

export const Input = memo(InputComponent);
