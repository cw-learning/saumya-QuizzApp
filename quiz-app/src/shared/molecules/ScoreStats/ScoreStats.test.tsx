import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ScoreStats } from './ScoreStats'

describe('ScoreStats', () => {
  const defaultProps = {
    correct: 5,
    incorrect: 3,
    percentage: 62
  }

  const renderComponent = (additionalProps?: Partial<React.ComponentProps<typeof ScoreStats>>) =>
    render(<ScoreStats {...defaultProps} {...additionalProps} />)

  it('renders correctly', () => {
    renderComponent()

    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders correct count', () => {
    renderComponent()

    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('Correct')).toBeInTheDocument()
  })

  it('renders incorrect count', () => {
    renderComponent()

    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Incorrect')).toBeInTheDocument()
  })

  it('renders percentage value', () => {
    renderComponent({ correct: 8, incorrect: 2, percentage: 80 })

    expect(screen.getByText('80%')).toBeInTheDocument()
  })

  it('updates values when props change', () => {
    const { rerender } = renderComponent({ correct: 1, incorrect: 9, percentage: 10 })

    rerender(
      <ScoreStats correct={7} incorrect={3} percentage={70} />
    )

    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('70%')).toBeInTheDocument()
  })
})