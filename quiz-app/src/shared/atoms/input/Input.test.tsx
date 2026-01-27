import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('renders with given value', () => {
    render(<Input value="test" />);

    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Input value="" onChange={onChange} />);

    await user.type(screen.getByRole('textbox'), 'a');

    expect(onChange).toHaveBeenCalled();
  });

  it('sets aria-invalid when hasError is true', () => {
    render(<Input hasError />);

    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('does not allow aria-invalid override when hasError is true', () => {
    render(<Input hasError ariaInvalid={false} />);

    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });
});
