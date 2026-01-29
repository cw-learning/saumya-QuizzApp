import { render, screen } from '@testing-library/react'
import { describe, it, vi, expect } from 'vitest'

import QuizGrid from './QuizGrid'
import { useQuizContext } from '../../context/quiz/useQuizContext'

// --- Mock Quiz Context ---
vi.mock('../../context/quiz/useQuizContext', () => ({
  useQuizContext: vi.fn(),
}))

// --- Mock AG Grid ---
vi.mock('ag-grid-react', () => ({
  AgGridReact: (props: any) => {
    return (
      <div data-testid="ag-grid">
        {props.rowData?.map((row: any, index: number) => (
          <div key={index}>
            <span>{row.question}</span>
            <span>{row.userAnswer}</span>
            <span>{row.correctAnswer}</span>
            <span>{row.isCorrect ? 'Yes' : 'No'}</span>
            <span>{row.difficulty}</span>
          </div>
        ))}
      </div>
    )
  },
}))

describe('QuizGrid', () => {
  it('renders nothing when there are no questions', () => {
    vi.mocked(useQuizContext).mockReturnValue({
      questions: [],
      userAnswers: {},
    } as any)

    const { container } = render(<QuizGrid />)

    expect(container.firstChild).toBeNull()
  })

  it('renders grid when questions exist', () => {
    vi.mocked(useQuizContext).mockReturnValue({
      questions: [
        {
          id: '1',
          question: 'What is 2 + 2?',
          correctAnswer: '4',
          difficulty: 'easy',
        },
      ],
      userAnswers: {
        '1': '4',
      },
    } as any)

    render(<QuizGrid />)

    expect(screen.getByTestId('ag-grid')).toBeInTheDocument()
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument()
  })

  it('marks answer as correct when user answer matches correct answer', () => {
    vi.mocked(useQuizContext).mockReturnValue({
      questions: [
        {
          id: '1',
          question: 'Capital of France?',
          correctAnswer: 'Paris',
          difficulty: 'easy',
        },
      ],
      userAnswers: {
        '1': 'Paris',
      },
    } as any)

    render(<QuizGrid />)

    expect(screen.getByText('Yes')).toBeInTheDocument()
  })

  it('marks answer as incorrect when user answer does not match', () => {
    vi.mocked(useQuizContext).mockReturnValue({
      questions: [
        {
          id: '1',
          question: 'Capital of Germany?',
          correctAnswer: 'Berlin',
          difficulty: 'medium',
        },
      ],
      userAnswers: {
        '1': 'Munich',
      },
    } as any)

    render(<QuizGrid />)

    expect(screen.getByText('No')).toBeInTheDocument()
  })
})
