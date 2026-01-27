import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Result } from './Result'

describe('Result organism', () => {
  const summary = {
    emoji: '🎉',
    message: 'Excellent!',
    colorClass: 'text-green-600',
  }

  it('renders result summary', () => {
    render(
      <Result
        correct={8}
        total={10}
        percentage={80}
        summary={summary}
        onRetake={vi.fn()}
      />
    )

    expect(screen.getByText('🎉')).toBeInTheDocument()
    expect(screen.getByText('Excellent!')).toBeInTheDocument()
  })

  it('renders score statistics', () => {
    render(
      <Result
        correct={7}
        total={10}
        percentage={70}
        summary={summary}
        onRetake={vi.fn()}
      />
    )

    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument() // incorrect
    expect(screen.getByText('70%')).toBeInTheDocument()
  })

  it('renders progress bar with correct aria value', () => {
    render(
      <Result
        correct={5}
        total={10}
        percentage={50}
        summary={summary}
        onRetake={vi.fn()}
      />
    )

    const progressBar = screen.getByRole('progressbar')

    expect(progressBar).toHaveAttribute('aria-valuenow', '50')
  })

  it('calls onRetake when retake button is clicked', async () => {
    const user = userEvent.setup()
    const onRetake = vi.fn()

    render(
      <Result
        correct={6}
        total={10}
        percentage={60}
        summary={summary}
        onRetake={onRetake}
      />
    )

    await user.click(
      screen.getByRole('button', { name: /retake/i })
    )

    expect(onRetake).toHaveBeenCalledOnce()
  })
})
