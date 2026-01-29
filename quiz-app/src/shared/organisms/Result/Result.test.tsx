import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Result } from './Result'

// ---- mocks ----
const resetQuiz = vi.fn()

vi.mock('../../../context/quiz/useQuizContext', () => ({
  useQuizContext: () => ({
    score: 7,
    questions: new Array(10).fill({}),
    resetQuiz,
  }),
}))

describe('Result organism', () => {
  it('renders derived score and percentage', () => {
    render(<Result />)

    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument() 
    expect(screen.getByText('70%')).toBeInTheDocument()
  })

  it('renders progress bar with derived value', () => {
    render(<Result />)

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '70')
  })

  it('resets quiz when retake button is clicked', async () => {
    const user = userEvent.setup()
    render(<Result />)

    await user.click(
      screen.getByRole('button', { name: /retake/i })
    )

    expect(resetQuiz).toHaveBeenCalledOnce()
  })
})
