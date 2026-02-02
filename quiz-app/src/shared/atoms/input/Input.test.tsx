import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  const renderComponent = (props?: Partial<React.ComponentProps<typeof Input>>) =>
    render(<Input value="" {...props} />);

  const onChange = vi.fn();

  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with given value', () => {
    renderComponent({ value: 'test' });

    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    onChange.mockClear();

    renderComponent({ onChange });

    await userEvent.type(screen.getByRole('textbox'), 'a');

    expect(onChange).toHaveBeenCalled();
  });

  it('sets aria-invalid when hasError is true', () => {
    renderComponent({ hasError: true });

    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('does not allow aria-invalid override when hasError is true', () => {
    renderComponent({ hasError: true, ariaInvalid: false });

    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });
});