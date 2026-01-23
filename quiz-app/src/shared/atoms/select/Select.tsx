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
}: SelectProps) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`${selectBaseStyles} ${
        hasError ? selectErrorStyles : ''
      }`}
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
