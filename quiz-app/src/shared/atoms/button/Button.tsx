import { memo } from 'react';
import type { ButtonPropsType } from './button.types';
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
  ...additionalProps
}: ButtonPropsType) {
  const buttonClasses = [
    BASE_BUTTON_CLASSES,
    VARIANT_CLASSES[variant],
    fullWidth && FULL_WIDTH_CLASS,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      {...additionalProps}
    >
      {children}
    </button>
  )
}
export const Button = ButtonComponent;
