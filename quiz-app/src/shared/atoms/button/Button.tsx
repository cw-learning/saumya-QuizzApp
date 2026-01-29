import { memo } from 'react'
import clsx from 'clsx'
import type { ButtonPropsType } from './button.types'
import {
  BASE_BUTTON_CLASSES,
  VARIANT_CLASSES,
  FULL_WIDTH_CLASS,
} from './button.styles'

function ButtonComponent({
  children,
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}: ButtonPropsType) {
  return (
    <button
      type={type}
      className={clsx(
        BASE_BUTTON_CLASSES,
        VARIANT_CLASSES[variant],
        fullWidth && FULL_WIDTH_CLASS,
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export const Button = memo(ButtonComponent)
