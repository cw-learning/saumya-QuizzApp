import { memo } from 'react';
import type { ButtonProps } from './button.types';
import {
  BASE_BUTTON_CLASSES,
  VARIANT_CLASSES,
  FULL_WIDTH_CLASS,
} from './button.styles';

function ButtonComponent({
  children,
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        BASE_BUTTON_CLASSES,
        VARIANT_CLASSES[variant],
        fullWidth && FULL_WIDTH_CLASS,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
export const Button = memo(ButtonComponent);
