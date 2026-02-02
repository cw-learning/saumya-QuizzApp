import type { ChangeEventHandler } from 'react';

export type InputType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'search'
  | 'tel'
  | 'url';

export interface InputProps {
  type?: InputType;
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
  min?: number;
  max?: number;
  className?: string;
  ariaInvalid?: boolean;
}
