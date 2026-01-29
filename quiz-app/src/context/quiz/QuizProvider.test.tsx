import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { QuizProvider } from './QuizProvider'
import { useQuizContext } from './useQuizContext'
import type { QuizQuestion } from '../../core/hooks/types/quiz.types'

// ---- mock useQuizApi ----
const mockFetchQuestions = vi.fn()

vi.mock('../../core/hooks/useQuizApi', () => ({
  useQuizApi: () => ({
    fetchQuestions: mockFetchQuestions,
    isLoading: false,
    error: null,
  }),
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <QuizProvider>{children}</QuizProvider>
)

const mockQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'Q1',
    correctAnswer: 'A',
    incorrectAnswers: ['B'],
    allAnswers: ['A', 'B'],
    category: 'Test',
    difficulty: 'easy',
    type: 'multiple',
  },
  {
    id: '2',
    question: 'Q2',
    correctAnswer: 'C',
    incorrectAnswers: ['D'],
    allAnswers: ['C', 'D'],
    category: 'Test',
    difficulty: 'easy',
    type: 'multiple',
  },
]

describe('QuizProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads questions and resets quiz state', async () => {
    mockFetchQuestions.mockResolvedValue(mockQuestions)

    const { result } = renderHook(() => useQuizContext(), {
      wrapper,
    })

    await act(async () => {
      await result.current.loadQuestions({ numberOfQuestions: 2 })
    })

    expect(result.current.questions).toHaveLength(2)
    expect(result.current.currentQuestionIndex).toBe(0)
    expect(result.current.score).toBe(0)
    expect(result.current.userAnswers).toEqual({})
    expect(result.current.isQuizComplete).toBe(false)
  })

  it('stores selected answer', async () => {
    mockFetchQuestions.mockResolvedValue(mockQuestions)

    const { result } = renderHook(() => useQuizContext(), {
      wrapper,
    })

    await act(async () => {
      await result.current.loadQuestions({})
    })

    await act(async () => {
      result.current.selectAnswer('A')
    })

    expect(result.current.userAnswers).toEqual({
      '1': 'A',
    })
  })

  it('increments score when answer is correct', async () => {
    mockFetchQuestions.mockResolvedValue(mockQuestions)

    const { result } = renderHook(() => useQuizContext(), {
      wrapper,
    })

    await act(async () => {
      await result.current.loadQuestions({})
    })

    await act(async () => {
      result.current.selectAnswer('A')
    })

    expect(result.current.score).toBe(1)
  })

  it('does not increment score for wrong answer', async () => {
    mockFetchQuestions.mockResolvedValue(mockQuestions)

    const { result } = renderHook(() => useQuizContext(), {
      wrapper,
    })

    await act(async () => {
      await result.current.loadQuestions({})
    })

    await act(async () => {
      result.current.selectAnswer('B')
    })

    expect(result.current.score).toBe(0)
  })

  it('moves to next question', async () => {
    mockFetchQuestions.mockResolvedValue(mockQuestions)

    const { result } = renderHook(() => useQuizContext(), {
      wrapper,
    })

    await act(async () => {
      await result.current.loadQuestions({})
    })

    await act(async () => {
      result.current.nextQuestion()
    })

    expect(result.current.currentQuestionIndex).toBe(1)
  })

  it('marks quiz complete when last question is passed', async () => {
    mockFetchQuestions.mockResolvedValue(mockQuestions)

    const { result } = renderHook(() => useQuizContext(), {
      wrapper,
    })

    await act(async () => {
      await result.current.loadQuestions({})
    })

    await act(async () => {
      result.current.nextQuestion()
      result.current.nextQuestion()
    })

    expect(result.current.isQuizComplete).toBe(true)
  })

  it('resets quiz state', async () => {
    mockFetchQuestions.mockResolvedValue(mockQuestions)

    const { result } = renderHook(() => useQuizContext(), {
      wrapper,
    })

    await act(async () => {
      await result.current.loadQuestions({})
    })

    
    await act(async () => {
      result.current.selectAnswer('A')
    })

    
    await act(async () => {
      result.current.resetQuiz()
    })

    expect(result.current.questions).toEqual([])
    expect(result.current.score).toBe(0)
    expect(result.current.userAnswers).toEqual({})
    expect(result.current.isQuizComplete).toBe(false)
  })
})
