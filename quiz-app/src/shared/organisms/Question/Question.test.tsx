import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Question } from './Question'

const mockQuestionData = {
  question: 'What is React?',
  options: ['A', 'B', 'C'],
  correctOption: 'A',
}

describe('Question organism', () => {
  it('renders question text and options', () => {
    render(
      <Question
        questionData={mockQuestionData}
        currentQuestion={1}
        totalQuestions={5}
        onSubmitAnswer={vi.fn()}
        onNext={vi.fn()}
      />
    )

    expect(screen.getByText('What is React?')).toBeInTheDocument()

    mockQuestionData.options.forEach((option) => {
      expect(
        screen.getByRole('button', { name: option })
      ).toBeInTheDocument()
    })
  })

  it('disables submit button when no option is selected', () => {
    render(
      <Question
        questionData={mockQuestionData}
        currentQuestion={1}
        totalQuestions={5}
        onSubmitAnswer={vi.fn()}
        onNext={vi.fn()}
      />
    )

    expect(
      screen.getByRole('button', { name: /submit/i })
    ).toBeDisabled()
  })

  it('calls onSubmitAnswer with selected option', async () => {
    const user = userEvent.setup()
    const onSubmitAnswer = vi.fn()

    render(
      <Question
        questionData={mockQuestionData}
        currentQuestion={1}
        totalQuestions={5}
        onSubmitAnswer={onSubmitAnswer}
        onNext={vi.fn()}
      />
    )

    await user.click(screen.getByRole('button', { name: 'B' }))
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(onSubmitAnswer).toHaveBeenCalledOnce()
    expect(onSubmitAnswer).toHaveBeenCalledWith('B')
  })

  it('shows next button and calls onNext after submission', async () => {
    const user = userEvent.setup()
    const onNext = vi.fn()

    render(
      <Question
        questionData={mockQuestionData}
        currentQuestion={1}
        totalQuestions={5}
        onSubmitAnswer={vi.fn()}
        onNext={onNext}
      />
    )

    await user.click(screen.getByRole('button', { name: 'A' }))
    await user.click(screen.getByRole('button', { name: /submit/i }))

    const nextButton = screen.getByRole('button', {
      name: /next/i,
    })

    expect(nextButton).toBeInTheDocument()

    await user.click(nextButton)

    expect(onNext).toHaveBeenCalledOnce()
  })
})
