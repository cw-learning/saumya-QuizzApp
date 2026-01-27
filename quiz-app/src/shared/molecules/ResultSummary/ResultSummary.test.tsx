import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ResultSummary } from './ResultSummary'

describe('ResultSummary', () => {
  it('renders emoji correctly', () => {
    render(
      <ResultSummary
        emoji="🏆"
        message="Perfect!"
        colorClass="text-yellow-600"
      />
    )

    expect(screen.getByText('🏆')).toBeInTheDocument()
  })

  it('renders result message', () => {
    render(
      <ResultSummary
        emoji="👍"
        message="Good Job"
        colorClass="text-blue-600"
      />
    )

    expect(screen.getByText('Good Job')).toBeInTheDocument()
  })

  it('updates when props change', () => {
    const { rerender } = render(
      <ResultSummary
        emoji="🙂"
        message="Okay"
        colorClass="text-gray-600"
      />
    )

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
    render(
      <ResultSummary
        emoji="💪"
        message="Keep Trying!"
        colorClass="text-red-600"
      />
    )

    expect(
      screen.getByText('Keep Trying!')
    ).toBeInTheDocument()
  })
})
