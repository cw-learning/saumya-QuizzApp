import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ResultSummary } from './ResultSummary'

describe('ResultSummary', () => {
  const defaultProps = {
    emoji: "🏆",
    message: "Perfect!",
    colorClass: "text-yellow-600"
  }

  const renderComponent = (additionalProps?: Partial<React.ComponentProps<typeof ResultSummary>>) =>
    render(<ResultSummary {...defaultProps} {...additionalProps} />)

  it('renders correctly', () => {
    renderComponent()

    expect(screen.getByText('🏆')).toBeInTheDocument()
  })

  it('renders emoji correctly', () => {
    renderComponent()

    expect(screen.getByText('🏆')).toBeInTheDocument()
  })

  it('renders result message', () => {
    renderComponent({ message: "Good Job" })

    expect(screen.getByText('Good Job')).toBeInTheDocument()
  })

  it('updates when props change', () => {
    const { rerender } = renderComponent()

    rerender(
      <ResultSummary
        emoji="🎉"
        message="Excellent"
        colorClass="text-green-600"
      />
    )

    expect(screen.getByText('🎉')).toBeInTheDocument()
    expect(screen.getByText('Excellent')).toBeInTheDocument()
  })

  it('supports different messages dynamically', () => {
    renderComponent({ message: "Keep Trying!" })

    expect(
      screen.getByText('Keep Trying!')
    ).toBeInTheDocument()
  })
})