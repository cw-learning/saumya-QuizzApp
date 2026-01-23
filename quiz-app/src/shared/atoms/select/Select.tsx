import { memo } from 'react';
import type { SelectProps } from './select.types';
import { selectBaseStyles, selectErrorStyles } from './select.styles';

function SelectComponent({
  name,
  value,
  onChange,
  options = [],
  disabled = false,
  hasError = false,
  className = '',
  'aria-invalid': ariaInvalid,
  ...props
}: SelectProps) {
  const resolvedAriaInvalid = hasError ? true : ariaInvalid;

  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      aria-invalid={resolvedAriaInvalid}
      className={[
        selectBaseStyles,
        hasError && selectErrorStyles,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export const Select = memo(SelectComponent);
