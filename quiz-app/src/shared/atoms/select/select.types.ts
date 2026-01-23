import { SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  hasError?: boolean;
}
