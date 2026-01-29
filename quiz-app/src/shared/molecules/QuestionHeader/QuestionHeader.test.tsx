import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { QuestionHeader } from './QuestionHeader'

describe('QuestionHeader', () => {
  it('renders question counter correctly', () => {
    render(
      <QuestionHeader
        currentQuestion={1}
        totalQuestions={5}
        question="Test question"
      />
    )

    expect(screen.getByText('Question 1 of 5')).toBeInTheDocument()
  })

  it('renders the question text', () => {
    render(
      <QuestionHeader
        currentQuestion={1}
        totalQuestions={5}
        question="What is JavaScript?"
      />
    )

    expect(
      screen.getByText('What is JavaScript?')
    ).toBeInTheDocument()
  })

  it('updates when props change', () => {
    const { rerender } = render(
      <QuestionHeader
        currentQuestion={1}
        totalQuestions={5}
        question="Q1"
      />
    )

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
    render(
      <QuestionHeader
        currentQuestion={10}
        totalQuestions={10}
        question="Final question"
      />
    )

    expect(
      screen.getByText('Question 10 of 10')
    ).toBeInTheDocument()
  })
})
