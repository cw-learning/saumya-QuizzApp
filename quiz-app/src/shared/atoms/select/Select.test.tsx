import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Select } from './Select';

describe('Select', () => {
  const options = [
    { value: 'easy', label: 'Easy' },
    { value: 'hard', label: 'Hard' },
  ];

  const renderComponent = (props?: Partial<React.ComponentProps<typeof Select>>) =>
    render(<Select options={options} {...props} />);

  const onChange = vi.fn();

  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders options', () => {
    renderComponent();

    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });

  it('calls onChange when option is selected', async () => {
    onChange.mockClear();

    renderComponent({ onChange });

    await userEvent.selectOptions(screen.getByRole('combobox'), 'hard');

    expect(onChange).toHaveBeenCalled();
  });

  it('sets aria-invalid when hasError is true', () => {
    renderComponent({ hasError: true });

    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });
});