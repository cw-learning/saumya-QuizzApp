import { SelectHTMLAttributes } from 'react'

export interface SelectOptionProps {
  value: string | number
  label: string
}

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOptionProps[]
  hasError?: boolean
}
