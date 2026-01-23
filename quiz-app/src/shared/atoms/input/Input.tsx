import { memo } from 'react';
import type { InputProps } from './input.types';
import { inputBaseStyles, inputErrorStyles } from './input.styles';

function InputComponent({
  type = 'text',
  value,
  onChange,
  name,
  placeholder,
  disabled = false,
  hasError = false,
  min,
  max,
}: InputProps) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
      className={`${inputBaseStyles} ${hasError ? inputErrorStyles : ''}`}
    />
  );
}

export const Input = memo(InputComponent);
