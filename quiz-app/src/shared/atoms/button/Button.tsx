import clsx from 'clsx';
import type { ButtonProps, ButtonVariantType } from './button.types';
import {
  BASE_BUTTON_CLASSES,
  PRIMARY_BUTTON_CLASSES,
  SECONDARY_BUTTON_CLASSES,
  FULL_WIDTH_CLASS,
} from './button.styles';

const VARIANT_CLASS_MAP: Record<ButtonVariantType, string> = {
  primary: PRIMARY_BUTTON_CLASSES,
  secondary: SECONDARY_BUTTON_CLASSES,
};

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  className,
  onClick,
  ariaLabel,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      className={clsx(
        BASE_BUTTON_CLASSES,
        VARIANT_CLASS_MAP[variant],
        fullWidth && FULL_WIDTH_CLASS,
        className
      )}
    >
      {children}
    </button>
  );
}
