import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useForm } from './Useform';

describe('useForm Hook', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { username: '', email: '' },
        validationSchema: {},
        onSubmit: vi.fn()
      })
    );

    expect(result.current.values).toEqual({ username: '', email: '' });
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should handle input change', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { username: '' },
        validationSchema: {},
        onSubmit: vi.fn()
      })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'username', value: 'johndoe' }
      });
    });

    expect(result.current.values.username).toBe('johndoe');
  });

  it('should clear error when field value changes', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { username: '' },
        validationSchema: {
          username: (value) => (value ? '' : 'Username is required')
        },
        onSubmit: vi.fn()
      })
    );

    // Trigger validation error
    act(() => {
      result.current.handleSubmit({ preventDefault: vi.fn() });
    });

    expect(result.current.errors.username).toBe('Username is required');

    // Change value should clear error
    act(() => {
      result.current.handleChange({
        target: { name: 'username', value: 'johndoe' }
      });
    });

    expect(result.current.errors.username).toBeUndefined();
  });

  it('should handle blur event and validate field', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { username: '' },
        validationSchema: {
          username: (value) => (value ? '' : 'Username is required')
        },
        onSubmit: vi.fn()
      })
    );

    act(() => {
      result.current.handleBlur({
        target: { name: 'username', value: '' }
      });
    });

    expect(result.current.touched.username).toBe(true);
    expect(result.current.errors.username).toBe('Username is required');
  });

  it('should not set error on blur if field is valid', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { username: 'johndoe' },
        validationSchema: {
          username: (value) => (value ? '' : 'Username is required')
        },
        onSubmit: vi.fn()
      })
    );

    act(() => {
      result.current.handleBlur({
        target: { name: 'username', value: 'johndoe' }
      });
    });

    expect(result.current.touched.username).toBe(true);
    expect(result.current.errors.username).toBeUndefined();
  });

  it('should call onSubmit with values when form is valid', () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() =>
      useForm({
        initialValues: { username: 'johndoe', email: 'john@example.com' },
        validationSchema: {
          username: (value) => (value ? '' : 'Username is required'),
          email: (value) => (value ? '' : 'Email is required')
        },
        onSubmit
      })
    );

    act(() => {
      result.current.handleSubmit({ preventDefault: vi.fn() });
    });

    expect(onSubmit).toHaveBeenCalledWith({
      username: 'johndoe',
      email: 'john@example.com'
    });
  });

  it('should not call onSubmit when form is invalid', () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() =>
      useForm({
        initialValues: { username: '', email: '' },
        validationSchema: {
          username: (value) => (value ? '' : 'Username is required'),
          email: (value) => (value ? '' : 'Email is required')
        },
        onSubmit
      })
    );

    act(() => {
      result.current.handleSubmit({ preventDefault: vi.fn() });
    });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.errors).toHaveProperty('username');
    expect(result.current.errors).toHaveProperty('email');
  });

  it('should set all fields as touched on submit', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { username: '', email: '' },
        validationSchema: {
          username: (value) => (value ? '' : 'Username is required'),
          email: (value) => (value ? '' : 'Email is required')
        },
        onSubmit: vi.fn()
      })
    );

    act(() => {
      result.current.handleSubmit({ preventDefault: vi.fn() });
    });

    expect(result.current.touched.username).toBe(true);
    expect(result.current.touched.email).toBe(true);
  });

  it('should reset form to initial values', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { username: '', email: '' },
        validationSchema: {},
        onSubmit: vi.fn()
      })
    );

    // Change values
    act(() => {
      result.current.handleChange({
        target: { name: 'username', value: 'johndoe' }
      });
      result.current.handleChange({
        target: { name: 'email', value: 'john@example.com' }
      });
    });

    expect(result.current.values).toEqual({
      username: 'johndoe',
      email: 'john@example.com'
    });

    // Reset form
    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values).toEqual({ username: '', email: '' });
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should set field value programmatically', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { username: '' },
        validationSchema: {},
        onSubmit: vi.fn()
      })
    );

    act(() => {
      result.current.setFieldValue('username', 'newvalue');
    });

    expect(result.current.values.username).toBe('newvalue');
  });

  it('should set field error programmatically', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { username: '' },
        validationSchema: {},
        onSubmit: vi.fn()
      })
    );

    act(() => {
      result.current.setFieldError('username', 'Custom error message');
    });

    expect(result.current.errors.username).toBe('Custom error message');
  });

  it('should handle multiple field changes', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { username: '', email: '', password: '' },
        validationSchema: {},
        onSubmit: vi.fn()
      })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'username', value: 'johndoe' }
      });
      result.current.handleChange({
        target: { name: 'email', value: 'john@example.com' }
      });
      result.current.handleChange({
        target: { name: 'password', value: 'secret123' }
      });
    });

    expect(result.current.values).toEqual({
      username: 'johndoe',
      email: 'john@example.com',
      password: 'secret123'
    });
  });

  it('should validate all fields on submit', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { username: 'john', email: 'invalid' },
        validationSchema: {
          username: (value) => (value.length >= 5 ? '' : 'Username too short'),
          email: (value) => (value.includes('@') ? '' : 'Invalid email')
        },
        onSubmit: vi.fn()
      })
    );

    act(() => {
      result.current.handleSubmit({ preventDefault: vi.fn() });
    });

    expect(result.current.errors).toHaveProperty('username');
    expect(result.current.errors).toHaveProperty('email');
    expect(result.current.errors.username).toBe('Username too short');
    expect(result.current.errors.email).toBe('Invalid email');
  });

  it('should prevent default form submission', () => {
    const preventDefault = vi.fn();
    const { result } = renderHook(() =>
      useForm({
        initialValues: { username: 'johndoe' },
        validationSchema: {},
        onSubmit: vi.fn()
      })
    );

    act(() => {
      result.current.handleSubmit({ preventDefault });
    });

    expect(preventDefault).toHaveBeenCalled();
  });
});
