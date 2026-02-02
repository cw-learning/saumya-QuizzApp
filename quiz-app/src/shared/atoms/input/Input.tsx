import clsx from 'clsx';
import type { InputProps } from './input.types';
import { inputBaseStyles, inputErrorStyles } from './input.styles';

export function Input({
  type = 'text',
  hasError = false,
  className,
  ariaInvalid,
  ...props
}: InputProps) {
  const resolvedAriaInvalid = hasError ? true : ariaInvalid;

  return (
    <input
     type={type}
      aria-invalid={resolvedAriaInvalid}
      className={clsx(
        inputBaseStyles,
        hasError && inputErrorStyles,
        className
      )}
    {...props}
    />
  );
}
