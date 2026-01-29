import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, vi, expect, beforeEach } from 'vitest'

import { Quiz } from './Quiz'

const mockUseQuizContext = vi.fn()

vi.mock('../../../context/quiz/useQuizContext', () => ({
  useQuizContext: () => mockUseQuizContext(),
}))

describe('Quiz feature', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders setup screen initially', () => {
    mockUseQuizContext.mockReturnValue({
      questions: [],
      isLoading: false,
      error: null,
      isQuizComplete: false,
      loadQuestions: vi.fn(),
    })

    render(<Quiz />)

    expect(
      screen.getByRole('button', { name: /start quiz/i })
    ).toBeInTheDocument()
  })

  it('submits form and triggers question load', async () => {
    const user = userEvent.setup()
    const loadQuestions = vi.fn()

    mockUseQuizContext.mockReturnValue({
      questions: [],
      isLoading: false,
      error: null,
      isQuizComplete: false,
      loadQuestions,
    })

    render(<Quiz />)

    const amountInput = screen.getByRole('spinbutton')
    await user.clear(amountInput)
    await user.type(amountInput, '5')

    await user.click(
      screen.getByRole('button', { name: /start quiz/i })
    )

    expect(loadQuestions).toHaveBeenCalledWith({
      numberOfQuestions: 5,
    })
  })

  it('renders loading state', () => {
    mockUseQuizContext.mockReturnValue({
      questions: [],
      isLoading: true,
      error: null,
      isQuizComplete: false,
      loadQuestions: vi.fn(),
    })

    render(<Quiz />)

    expect(
      screen.getByText(/loading quiz/i)
    ).toBeInTheDocument()
  })
})
