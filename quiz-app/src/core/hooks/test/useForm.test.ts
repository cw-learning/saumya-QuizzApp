import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useForm } from '../useForm'

type FormValuesType = {
  name: string
  age: string
}

describe('useForm', () => {
  const onSubmit = vi.fn()
  const initialValues = { name: '', age: '' }
  const validationSchema = {
    name: (value: string) => (value ? undefined : 'Required'),
  }

  beforeEach(() => {
    onSubmit.mockClear()
  })

  it('initializes form values with provided initial values', () => {
    const { result } = renderHook(() =>
      useForm<FormValuesType>({
        initialValues,
        onSubmit,
      })
    )

    expect(result.current.values).toEqual(initialValues)
  })

  it('updates field value when handleChange is called', () => {
    const { result } = renderHook(() =>
      useForm<FormValuesType>({
        initialValues,
        onSubmit,
      })
    )

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Saumya' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.values.name).toBe('Saumya')
  })

  it('clears field error when value changes after validation error', () => {
    const { result } = renderHook(() =>
      useForm<FormValuesType>({
        initialValues,
        validationSchema,
        onSubmit,
      })
    )

    act(() => {
      result.current.handleBlur({
        target: { name: 'name', value: '' },
      } as React.FocusEvent<HTMLInputElement>)
    })

    expect(result.current.errors.name).toBe('Required')

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Alice' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.errors.name).toBeUndefined()
  })

  it('marks field as touched when handleBlur is called', () => {
    const { result } = renderHook(() =>
      useForm<FormValuesType>({
        initialValues,
        onSubmit,
      })
    )

    act(() => {
      result.current.handleBlur({
        target: { name: 'name', value: '' },
      } as React.FocusEvent<HTMLInputElement>)
    })

    expect(result.current.touched.name).toBe(true)
  })

  it('sets validation error when handleBlur is called on invalid field', () => {
    const { result } = renderHook(() =>
      useForm<FormValuesType>({
        initialValues,
        validationSchema,
        onSubmit,
      })
    )

    act(() => {
      result.current.handleBlur({
        target: { name: 'name', value: '' },
      } as React.FocusEvent<HTMLInputElement>)
    })

    expect(result.current.errors.name).toBe('Required')
  })

  it('calls onSubmit with form values when no validation errors exist', () => {
    const { result } = renderHook(() =>
      useForm<FormValuesType>({
        initialValues: { name: 'Alice', age: '25' },
        validationSchema,
        onSubmit,
      })
    )

    act(() => {
      result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>)
    })

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Alice',
      age: '25',
    })
  })

  it('does not call onSubmit and sets errors when validation errors exist', () => {
    const { result } = renderHook(() =>
      useForm<FormValuesType>({
        initialValues,
        validationSchema,
        onSubmit,
      })
    )

    act(() => {
      result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>)
    })

    expect(onSubmit).not.toHaveBeenCalled()
    expect(result.current.errors.name).toBe('Required')
  })

  it('resets form state to initial values and clears errors and touched fields', () => {
    const { result } = renderHook(() =>
      useForm<FormValuesType>({
        initialValues: { name: 'Initial', age: '10' },
        onSubmit,
      })
    )

    act(() => {
      result.current.setFieldValue('name', 'Changed')
      result.current.resetForm()
    })

    expect(result.current.values).toEqual({
      name: 'Initial',
      age: '10',
    })
    expect(result.current.errors).toEqual({})
    expect(result.current.touched).toEqual({})
  })
})