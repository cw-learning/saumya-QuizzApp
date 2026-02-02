import type { MouseEventHandler, ReactNode } from 'react';

export type ButtonVariantType = 'primary' | 'secondary';

export enum ButtonType {
  Button = 'button',
  Submit = 'submit',
  Reset = 'reset',
}
export interface ButtonProps {
  children: ReactNode;
  type?: ButtonType;
  variant?: ButtonVariantType;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  ariaLabel?: string;
  loading?: boolean;
}