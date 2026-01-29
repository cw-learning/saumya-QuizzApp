import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Question } from './Question'

// ---- mocks ----
const selectAnswer = vi.fn()
const nextQuestion = vi.fn()

vi.mock('../../../context/quiz/useQuizContext', () => ({
  useQuizContext: () => ({
    questions: [
      {
        id: 'q1',
        question: 'What is React?',
        allAnswers: ['A', 'B', 'C'],
        correctAnswer: 'A',
      },
      {
        id: 'q2',
        question: 'What is JSX?',
        allAnswers: ['X', 'Y', 'Z'],
        correctAnswer: 'X',
      },
    ],
    currentQuestionIndex: 0,
    selectAnswer,
    nextQuestion,
  }),
}))


describe('Question organism', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders question header and options', () => {
    render(<Question />)

    expect(
      screen.getByText('What is React?')
    ).toBeInTheDocument()

    ;['A', 'B', 'C'].forEach((option) => {
      expect(
        screen.getByRole('button', { name: option })
      ).toBeInTheDocument()
    })
  })

  it('disables submit button until an option is selected', () => {
    render(<Question />)

    const submitButton = screen.getByRole('button', {
      name: /submit/i,
    })

    expect(submitButton).toBeDisabled()
  })

  it('submits selected answer and shows next button', async () => {
    const user = userEvent.setup()
    render(<Question />)

    await user.click(
      screen.getByRole('button', { name: 'B' })
    )

    await user.click(
      screen.getByRole('button', { name: /submit/i })
    )

    expect(selectAnswer).toHaveBeenCalledOnce()
    expect(selectAnswer).toHaveBeenCalledWith('B')

    expect(
      screen.getByRole('button', { name: /next/i })
    ).toBeInTheDocument()
  })

  it('advances to next question and resets local state', async () => {
    const user = userEvent.setup()
    render(<Question />)

    await user.click(
      screen.getByRole('button', { name: 'A' })
    )

    await user.click(
      screen.getByRole('button', { name: /submit/i })
    )

    await user.click(
      screen.getByRole('button', { name: /next/i })
    )

    expect(nextQuestion).toHaveBeenCalledOnce()

    
    expect(
      screen.getByRole('button', { name: /submit/i })
    ).toBeDisabled()
  })
})
