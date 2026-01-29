import { InputHTMLAttributes } from 'react';

export type InputType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'search'
  | 'tel'
  | 'url';

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  type?: InputType;
  hasError?: boolean;
}
