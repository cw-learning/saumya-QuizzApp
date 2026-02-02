import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';
import { ButtonType } from './button.types';  // Add this import

const renderComponent = (props?: Partial<React.ComponentProps<typeof Button>>) =>
  render(<Button {...props}>Click</Button>);

describe('Button', () => {
  const onClick = vi.fn();

  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    onClick.mockClear();

    renderComponent({ onClick });

    await userEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    onClick.mockClear();

    renderComponent({ disabled: true, onClick });

    await userEvent.click(screen.getByRole('button'));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('defaults type to button', () => {
    renderComponent();

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('sets type when provided', () => {
    renderComponent({ type: ButtonType.Submit });  

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('sets aria-label when provided', () => {
    renderComponent({ ariaLabel: 'save' });

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'save');
  });
});