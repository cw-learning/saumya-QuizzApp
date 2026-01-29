import { memo } from 'react'
import type { InputProps } from './input.types'
import { inputBaseStyles, inputErrorStyles } from './input.styles'

function InputComponent({
  type = 'text',
  hasError = false,
  className = '',
  'aria-invalid': ariaInvalid,
  ...props
}: InputProps) {
  const resolvedAriaInvalid = hasError ? true : ariaInvalid

  return (
    <input
      {...props}
      type={type}
      aria-invalid={resolvedAriaInvalid}
      className={[
        inputBaseStyles,
        hasError && inputErrorStyles,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}

export const Input = memo(InputComponent)
