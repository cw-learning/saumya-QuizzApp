import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Click</Button>);

    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Click
      </Button>
    );

    await user.click(screen.getByRole('button'));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('defaults type to button', () => {
    render(<Button>Click</Button>);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('sets aria-label when provided', () => {
    render(<Button ariaLabel="save">Save</Button>);

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'save');
  });
});
