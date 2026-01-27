import clsx from 'clsx';
import type { SelectProps } from './select.types';
import { selectBaseStyles, selectErrorStyles } from './select.styles';

export function Select({
  name,
  value,
  onChange,
  options = [],
  disabled = false,
  hasError = false,
  className,
  ariaInvalid,
}: SelectProps) {
  const resolvedAriaInvalid = hasError ? true : ariaInvalid;

  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      aria-invalid={resolvedAriaInvalid}
      className={clsx(
        selectBaseStyles,
        hasError && selectErrorStyles,
        className
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
