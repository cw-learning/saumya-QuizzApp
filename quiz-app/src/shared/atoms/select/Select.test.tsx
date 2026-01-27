import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Select } from './Select';

describe('Select', () => {
  const options = [
    { value: 'easy', label: 'Easy' },
    { value: 'hard', label: 'Hard' },
  ];

  it('renders options', () => {
    render(<Select options={options} />);

    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });

  it('calls onChange when option is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Select options={options} onChange={onChange} />);

    await user.selectOptions(screen.getByRole('combobox'), 'hard');

    expect(onChange).toHaveBeenCalled();
  });

  it('sets aria-invalid when hasError is true', () => {
    render(<Select hasError />);

    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });
});
