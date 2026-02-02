import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import axios from 'axios'

import { useQuizApi } from '../useQuizApi'
import type { QuizQuestionType } from '../types/quiz.types'

vi.mock('axios')

vi.mock('../utils/decodeHtmlEntities', () => ({
  decodeHtmlEntities: (value: string) => value,
}))

vi.mock('../utils/shuffle', () => ({
  shuffle: <T>(items: T[]) => items,
}))

const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>
}

const mockApiResponse = {
  results: [
    {
      category: 'Science',
      question: 'What is JS?',
      correct_answer: 'JavaScript',
      incorrect_answers: ['Java'],
      difficulty: 'easy',
      type: 'multiple',
    },
    {
      category: 'History',
      question: 'Who was Napoleon?',
      correct_answer: 'General',
      incorrect_answers: ['Doctor'],
      difficulty: 'medium',
      type: 'multiple',
    },
  ],
}

describe('useQuizApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedAxios.get = vi.fn().mockResolvedValue({
      data: mockApiResponse,
    })
  })

  it('fetches and normalizes quiz questions from API response', async () => {
    const { result } = renderHook(() => useQuizApi())

    let questions: QuizQuestionType[] = []

    await act(async () => {
      questions = await result.current.fetchQuestions({
        numberOfQuestions: 1,
      })
    })

    expect(questions).toHaveLength(1)
    expect(
      ['What is JS?', 'Who was Napoleon?']
    ).toContain(questions[0]!.question)
  })

  it('throws error and sets error state for invalid numberOfQuestions', async () => {
    const { result } = renderHook(() => useQuizApi())

    let thrown: unknown

    await act(async () => {
      try {
        await result.current.fetchQuestions({
          numberOfQuestions: -1,
        })
      } catch (error) {
        thrown = error
      }
    })

    expect(thrown).toBeInstanceOf(Error)
    expect(result.current.error).toMatch(
      /numberOfQuestions must be between/i
    )
  })

  it('filters questions by category and returns matching questions', async () => {
    const { result } = renderHook(() => useQuizApi())

    let questions: QuizQuestionType[] = []

    await act(async () => {
      questions = await result.current.fetchQuestions({
        category: 'Science',
      })
    })

    expect(questions).toHaveLength(1)
    expect(questions[0]!.category).toBe('Science')
  })

  it('filters questions by difficulty and returns matching questions', async () => {
    const { result } = renderHook(() => useQuizApi())

    let questions: QuizQuestionType[] = []

    await act(async () => {
      questions = await result.current.fetchQuestions({
        difficulty: 'medium',
      })
    })

    expect(questions).toHaveLength(1)
    expect(questions[0]!.difficulty).toBe('medium')
  })

  it('sets error when API response format is invalid', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({
      data: { results: null },
    })

    const { result } = renderHook(() => useQuizApi())

    let thrown: unknown

    await act(async () => {
      try {
        await result.current.fetchQuestions()
      } catch (error) {
        thrown = error
      }
    })

    expect(thrown).toBeInstanceOf(Error)
    expect(result.current.error).toBe(
      'Invalid API response format'
    )
  })

  it('fetches unique and sorted categories from API', async () => {
    const { result } = renderHook(() => useQuizApi())

    let categories: string[] = []

    await act(async () => {
      categories = await result.current.fetchCategories()
    })

    expect(categories).toEqual(['History', 'Science'])
  })

  it('sets error when fetchCategories fails due to network error', async () => {
    mockedAxios.get = vi.fn().mockRejectedValue(
      new Error('Network error')
    )

    const { result } = renderHook(() => useQuizApi())

    let thrown: unknown

    await act(async () => {
      try {
        await result.current.fetchCategories()
      } catch (error) {
        thrown = error
      }
    })

    expect(thrown).toBeInstanceOf(Error)
    expect(result.current.error).toBe('Network error')
  })
})