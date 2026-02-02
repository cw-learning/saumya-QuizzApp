import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariantType = 'primary' | 'secondary';

export type ButtonPropsType =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    variant?: ButtonVariantType;
    fullWidth?: boolean;
  };
