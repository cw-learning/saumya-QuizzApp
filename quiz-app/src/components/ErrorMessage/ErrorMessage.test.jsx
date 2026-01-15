import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage Component', () => {
  it('should render error message', () => {
    render(<ErrorMessage message="Test error message" />);

    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('should render default message when no message provided', () => {
    render(<ErrorMessage />);

    expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
  });

  it('should show error icon', () => {
    render(<ErrorMessage message="Test error" />);

    expect(screen.getByText('❌')).toBeInTheDocument();
  });

  it('should show "Error" heading', () => {
    render(<ErrorMessage message="Test error" />);

    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    const onRetry = vi.fn();
    render(<ErrorMessage message="Test error" onRetry={onRetry} />);

    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Test error" />);

    expect(screen.queryByText('Retry')).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorMessage message="Test error" onRetry={onRetry} />);

    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should have proper styling classes', () => {
    const { container } = render(<ErrorMessage message="Test error" />);

    const errorContainer = container.querySelector('.bg-red-50');
    expect(errorContainer).toBeInTheDocument();
  });
});
