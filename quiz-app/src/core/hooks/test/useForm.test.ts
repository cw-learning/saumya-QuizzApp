import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useForm } from '../useForm'

type FormValues = {
  name: string
  age: string
}

describe('useForm', () => {
  it('initializes with initial values', () => {
    const { result } = renderHook(() =>
      useForm<FormValues>({
        initialValues: { name: '', age: '' },
        onSubmit: vi.fn(),
      })
    )

    expect(result.current.values).toEqual({
      name: '',
      age: '',
    })
  })

  it('updates value on handleChange', () => {
    const { result } = renderHook(() =>
      useForm<FormValues>({
        initialValues: { name: '', age: '' },
        onSubmit: vi.fn(),
      })
    )

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Saumya' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.values.name).toBe('Saumya')
  })

  it('clears field error on change', () => {
    const { result } = renderHook(() =>
      useForm<FormValues>({
        initialValues: { name: '', age: '' },
        validationSchema: {
          name: (value) =>
            value ? undefined : 'Required',
        },
        onSubmit: vi.fn(),
      })
    )

    // trigger validation error
    act(() => {
      result.current.handleBlur({
        target: { name: 'name', value: '' },
      } as React.FocusEvent<HTMLInputElement>)
    })

    expect(result.current.errors.name).toBe(
      'Required'
    )

    // change value → error should clear
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Saumya' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.errors.name).toBeUndefined()
  })

  it('marks field as touched on blur', () => {
    const { result } = renderHook(() =>
      useForm<FormValues>({
        initialValues: { name: '', age: '' },
        onSubmit: vi.fn(),
      })
    )

    act(() => {
      result.current.handleBlur({
        target: { name: 'name', value: '' },
      } as React.FocusEvent<HTMLInputElement>)
    })

    expect(result.current.touched.name).toBe(true)
  })

  it('sets validation error on blur', () => {
    const { result } = renderHook(() =>
      useForm<FormValues>({
        initialValues: { name: '', age: '' },
        validationSchema: {
          name: (value) =>
            value ? undefined : 'Required',
        },
        onSubmit: vi.fn(),
      })
    )

    act(() => {
      result.current.handleBlur({
        target: { name: 'name', value: '' },
      } as React.FocusEvent<HTMLInputElement>)
    })

    expect(result.current.errors.name).toBe(
      'Required'
    )
  })

  it('calls onSubmit when no validation errors', () => {
    const onSubmit = vi.fn()

    const { result } = renderHook(() =>
      useForm<FormValues>({
        initialValues: { name: 'Saumya', age: '25' },
        validationSchema: {
          name: (value) =>
            value ? undefined : 'Required',
        },
        onSubmit,
      })
    )

    act(() => {
      result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>)
    })

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Saumya',
      age: '25',
    })
  })

  it('does not call onSubmit when validation errors exist', () => {
    const onSubmit = vi.fn()

    const { result } = renderHook(() =>
      useForm<FormValues>({
        initialValues: { name: '', age: '' },
        validationSchema: {
          name: (value) =>
            value ? undefined : 'Required',
        },
        onSubmit,
      })
    )

    act(() => {
      result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>)
    })

    expect(onSubmit).not.toHaveBeenCalled()
    expect(result.current.errors.name).toBe(
      'Required'
    )
  })

  it('resets form state correctly', () => {
    const { result } = renderHook(() =>
      useForm<FormValues>({
        initialValues: { name: 'Initial', age: '10' },
        onSubmit: vi.fn(),
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
