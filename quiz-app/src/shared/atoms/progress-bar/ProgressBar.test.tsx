import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('clamps value below 0 to 0', () => {
    render(<ProgressBar value={-20} />);

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '0'
    );
  });

  it('clamps value above 100 to 100', () => {
    render(<ProgressBar value={200} />);

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '100'
    );
  });

  it('sets correct aria attributes', () => {
    render(<ProgressBar value={50} />);

    const bar = screen.getByRole('progressbar');

    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-valuenow', '50');
  });
});
