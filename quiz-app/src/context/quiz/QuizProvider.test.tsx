import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { QuizProvider } from './QuizProvider'
import { useQuizContext } from './useQuizContext'
import type { QuizQuestionType } from '../../core/hooks/types/quiz.types'

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

const mockQuestions: QuizQuestionType[] = [
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
    mockFetchQuestions.mockResolvedValue(mockQuestions)
  })

  it('loads questions and resets quiz state to initial values', async () => {
    const { result } = renderHook(() => useQuizContext(), { wrapper })

    await act(async () => {
      await result.current.loadQuestions({ numberOfQuestions: 2 })
    })

    expect(result.current.questions).toHaveLength(2)
    expect(result.current.currentQuestionIndex).toBe(0)
    expect(result.current.score).toBe(0)
    expect(result.current.userAnswers).toEqual({})
    expect(result.current.isQuizComplete).toBe(false)
  })

  it('stores selected answer in userAnswers object', async () => {
    const { result } = renderHook(() => useQuizContext(), { wrapper })

    await act(async () => {
      await result.current.loadQuestions({})
    })

    act(() => {
      result.current.selectAnswer('A')
    })

    expect(result.current.userAnswers).toEqual({ '1': 'A' })
  })

  it('increments score by 1 when the selected answer is correct', async () => {
    const { result } = renderHook(() => useQuizContext(), { wrapper })

    await act(async () => {
      await result.current.loadQuestions({})
    })

    act(() => {
      result.current.selectAnswer('A')
    })

    expect(result.current.score).toBe(1)
  })

  it('does not increment score when the selected answer is incorrect', async () => {
    const { result } = renderHook(() => useQuizContext(), { wrapper })

    await act(async () => {
      await result.current.loadQuestions({})
    })

    act(() => {
      result.current.selectAnswer('B')
    })

    expect(result.current.score).toBe(0)
  })

  it('prevents double-scoring when selectAnswer is called multiple times quickly for the same question', async () => {
    const { result } = renderHook(() => useQuizContext(), { wrapper })

    await act(async () => {
      await result.current.loadQuestions({})
    })

    act(() => {
      result.current.selectAnswer('A')
      result.current.selectAnswer('A')
    })

    expect(result.current.score).toBe(1)
    expect(result.current.userAnswers['1']).toBe('A')
  })

  it('moves to next question and increments currentQuestionIndex to 1', async () => {
    const { result } = renderHook(() => useQuizContext(), { wrapper })

    await act(async () => {
      await result.current.loadQuestions({})
    })

    act(() => {
      result.current.onNextQuestion()
    })

    expect(result.current.currentQuestionIndex).toBe(1)
  })

  it('marks quiz as complete when navigating past the last question', async () => {
    const { result } = renderHook(() => useQuizContext(), { wrapper })

    await act(async () => {
      await result.current.loadQuestions({})
    })

    act(() => {
      result.current.onNextQuestion()
      result.current.onNextQuestion()
    })

    expect(result.current.isQuizComplete).toBe(true)
  })

  it('resets quiz state and rethrows error when loadQuestions fails', async () => {
    mockFetchQuestions.mockRejectedValue(new Error('boom'))

    const { result } = renderHook(() => useQuizContext(), { wrapper })

    await expect(
      act(async () => {
        await result.current.loadQuestions({})
      })
    ).rejects.toThrow('boom')

    expect(result.current.questions).toEqual([])
    expect(result.current.currentQuestionIndex).toBe(0)
    expect(result.current.userAnswers).toEqual({})
    expect(result.current.score).toBe(0)
    expect(result.current.isQuizComplete).toBe(false)
  })

  it('resets all quiz state to initial values when resetQuiz is called', async () => {
    const { result } = renderHook(() => useQuizContext(), { wrapper })

    await act(async () => {
      await result.current.loadQuestions({})
    })

    act(() => {
      result.current.selectAnswer('A')
    })

    act(() => {
      result.current.resetQuiz()
    })

    expect(result.current.questions).toEqual([])
    expect(result.current.score).toBe(0)
    expect(result.current.userAnswers).toEqual({})
    expect(result.current.isQuizComplete).toBe(false)
  })
})