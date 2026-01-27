import type { ChangeEventHandler } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps {

  name?: string;

  value?: string | number;

  onChange?: ChangeEventHandler<HTMLSelectElement>;

  options?: SelectOption[];

  disabled?: boolean;

  hasError?: boolean;

  className?: string;

  ariaInvalid?: boolean;
}
