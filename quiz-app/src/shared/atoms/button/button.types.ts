import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary';

export type ButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    variant?: ButtonVariant;
    fullWidth?: boolean;
  };
