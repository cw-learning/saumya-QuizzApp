import type { MouseEventHandler, ReactNode } from 'react';

export type ButtonVariantType = 'primary' | 'secondary';

export interface ButtonProps {
  children: ReactNode;

  type?: 'button' | 'submit' | 'reset';

  variant?: ButtonVariantType;

  fullWidth?: boolean;

  disabled?: boolean;

  onClick?: MouseEventHandler<HTMLButtonElement>;

  className?: string;

  ariaLabel?: string;
}
