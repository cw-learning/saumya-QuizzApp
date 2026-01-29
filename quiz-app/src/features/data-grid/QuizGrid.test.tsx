import { render, screen } from '@testing-library/react'
import { describe, it, vi, expect } from 'vitest'

import QuizGrid from './QuizGrid'
import { useQuizContext } from '../../context/quiz/useQuizContext'
import type { QuizGridRow } from './quizGrid.types'
import type { QuizContextValue } from '../../context/quiz/quizContext.types'

// --- Mock Quiz Context ---
vi.mock('../../context/quiz/useQuizContext', () => ({
  useQuizContext: vi.fn(),
}))

const createMockQuizContext = (
  overrides: Partial<QuizContextValue> = {}
): QuizContextValue => ({
  questions: [],
  userAnswers: {},
  currentQuestionIndex: 0,
  score: 0,
  isQuizComplete: false,
  isLoading: false,
  error: null,
  loadQuestions: vi.fn(),
  selectAnswer: vi.fn(),
  nextQuestion: vi.fn(),
  resetQuiz: vi.fn(),
  ...overrides,
})

// --- Mock AG Grid ---
vi.mock('ag-grid-react', () => ({
  AgGridReact: ({ rowData }: { rowData?: QuizGridRow[] }) => (
    <div data-testid="ag-grid">
      {rowData?.map((row) => (
        <div key={row.question}>
          <span>{row.question}</span>
          <span>{row.userAnswer}</span>
          <span>{row.correctAnswer}</span>
          <span>{row.isCorrect ? 'Yes' : 'No'}</span>
          <span>{row.difficulty}</span>
        </div>
      ))}
    </div>
  ),
}))

describe('QuizGrid', () => {
  it('renders nothing when there are no questions', () => {
    vi.mocked(useQuizContext).mockReturnValue(
      createMockQuizContext()
    )

    const { container } = render(<QuizGrid />)

    expect(container.firstChild).toBeNull()
  })

  it('renders grid when questions exist', () => {
    vi.mocked(useQuizContext).mockReturnValue(
      createMockQuizContext({
        questions: [
          {
            id: '1',
            question: 'What is 2 + 2?',
            correctAnswer: '4',
            difficulty: 'easy',
            incorrectAnswers: [],
            allAnswers: [],
            category: 'Math',
            type: 'multiple',
          },
        ],
        userAnswers: {
          '1': '4',
        },
      })
    )

    render(<QuizGrid />)

    expect(screen.getByTestId('ag-grid')).toBeInTheDocument()
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument()
  })

  it('marks answer as correct when user answer matches correct answer', () => {
    vi.mocked(useQuizContext).mockReturnValue(
      createMockQuizContext({
        questions: [
          {
            id: '1',
            question: 'Capital of France?',
            correctAnswer: 'Paris',
            difficulty: 'easy',
            incorrectAnswers: [],
            allAnswers: [],
            category: 'Geography',
            type: 'multiple',
          },
        ],
        userAnswers: {
          '1': 'Paris',
        },
      })
    )

    render(<QuizGrid />)

    expect(screen.getByText('Yes')).toBeInTheDocument()
  })

  it('marks answer as incorrect when user answer does not match', () => {
    vi.mocked(useQuizContext).mockReturnValue(
      createMockQuizContext({
        questions: [
          {
            id: '1',
            question: 'Capital of Germany?',
            correctAnswer: 'Berlin',
            difficulty: 'medium',
            incorrectAnswers: [],
            allAnswers: [],
            category: 'Geography',
            type: 'multiple',
          },
        ],
        userAnswers: {
          '1': 'Munich',
        },
      })
    )

    render(<QuizGrid />)

    expect(screen.getByText('No')).toBeInTheDocument()
  })
})
