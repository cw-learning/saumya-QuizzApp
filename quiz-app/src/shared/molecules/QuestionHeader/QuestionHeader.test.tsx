import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { QuestionHeader } from './QuestionHeader'

describe('QuestionHeader', () => {
  const renderComponent = (props?: Partial<React.ComponentProps<typeof QuestionHeader>>) =>
    render(<QuestionHeader currentQuestion={1} totalQuestions={5} question="Test question" {...props} />)

  it('renders correctly', () => {
    renderComponent()

    expect(screen.getByText('Question 1 of 5')).toBeInTheDocument()
  })

  it('renders question counter correctly', () => {
    renderComponent()

    expect(screen.getByText('Question 1 of 5')).toBeInTheDocument()
  })

  it('renders the question text', () => {
    renderComponent({ question: "What is JavaScript?" })

    expect(
      screen.getByText('What is JavaScript?')
    ).toBeInTheDocument()
  })

  it('updates when props change', () => {
    const { rerender } = renderComponent()

    rerender(
      <QuestionHeader
        currentQuestion={2}
        totalQuestions={5}
        question="Q2"
      />
    )

    expect(screen.getByText('Question 2 of 5')).toBeInTheDocument()
    expect(screen.getByText('Q2')).toBeInTheDocument()
  })

  it('handles last question correctly', () => {
    renderComponent({ currentQuestion: 10, totalQuestions: 10, question: "Final question" })

    expect(
      screen.getByText('Question 10 of 10')
    ).toBeInTheDocument()
  })
})