import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import axios from 'axios'

import { useQuizApi } from '../useQuizApi'
import type { QuizQuestion } from '../types/quiz.types'

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
  })

  it('fetches and normalizes quiz questions', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({
      data: mockApiResponse,
    })

    const { result } = renderHook(() => useQuizApi())

    let questions: QuizQuestion[] = []

    await act(async () => {
      questions = await result.current.fetchQuestions({
        numberOfQuestions: 1,
      })
    })

    expect(questions).toHaveLength(1)
    expect(questions[0] && (questions[0].question === 'What is JS?' || questions[0].question === 'Who was Napoleon?')).toBe(true)
  })

  it('throws error for invalid numberOfQuestions', async () => {
    const { result } = renderHook(() => useQuizApi())

    await expect(
      result.current.fetchQuestions({
        numberOfQuestions: -1,
      })
    ).rejects.toThrow()
  })

  it('filters questions by category', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({
      data: mockApiResponse,
    })

    const { result } = renderHook(() => useQuizApi())

    let questions: QuizQuestion[] = []

    await act(async () => {
      questions = await result.current.fetchQuestions({
        category: 'Science',
      })
    })

    expect(questions).toHaveLength(1)
    expect(questions[0]!.category).toBe('Science')
  })

  it('filters questions by difficulty', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({
      data: mockApiResponse,
    })

    const { result } = renderHook(() => useQuizApi())

    let questions: QuizQuestion[] = []

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

    await expect(
      result.current.fetchQuestions()
    ).rejects.toThrow()

    await act(async () => {
    })
    expect(result.current.error).toBeTruthy()
  })

  it('fetches unique and sorted categories', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({
      data: mockApiResponse,
    })

    const { result } = renderHook(() => useQuizApi())

    let categories: string[] = []

    await act(async () => {
      categories = await result.current.fetchCategories()
    })

    expect(categories).toEqual(['History', 'Science'])
  })

  it('sets error when fetchCategories fails', async () => {
    mockedAxios.get = vi.fn().mockRejectedValue(
      new Error('Network error')
    )

    const { result } = renderHook(() => useQuizApi())

    await expect(
      result.current.fetchCategories()
    ).rejects.toThrow()

    await act(async () => {
    })
    expect(result.current.error).toBeTruthy()
  })
})
