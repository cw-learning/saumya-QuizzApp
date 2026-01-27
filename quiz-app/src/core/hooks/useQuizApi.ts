import { useCallback, useState } from 'react'
import axios from 'axios'

import { decodeHtmlEntities } from '../utils/decodeHtmlEntities'
import { shuffle } from '../utils/shuffle'
import {
  DEFAULT_QUIZ_OPTIONS,
  QUIZ_LIMITS,
} from '../constants/quiz.constants'
import type { FetchQuizOptions, QuizQuestion } from './types/quiz.types'

const QUIZ_API_URL =
  'https://raw.githubusercontent.com/SaumyaDwivedi179/quizApi/refs/heads/main/quiz-data.json'

export function useQuizApi() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchQuestions = useCallback(
    async (options: FetchQuizOptions = {}): Promise<QuizQuestion[]> => {
      const {
        numberOfQuestions = DEFAULT_QUIZ_OPTIONS.NUMBER_OF_QUESTIONS,
        category = '',
        difficulty = '',
        type = DEFAULT_QUIZ_OPTIONS.TYPE,
      } = options

      const amount = Number(numberOfQuestions)

      if (
        !Number.isInteger(amount) ||
        amount < QUIZ_LIMITS.MIN_QUESTIONS ||
        amount > QUIZ_LIMITS.MAX_QUESTIONS
      ) {
        throw new Error(
          `numberOfQuestions must be between ${QUIZ_LIMITS.MIN_QUESTIONS} and ${QUIZ_LIMITS.MAX_QUESTIONS}`
        )
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await axios.get(QUIZ_API_URL)
        const results = response?.data?.results

        if (!Array.isArray(results)) {
          throw new TypeError('Invalid API response format')
        }

        let filteredQuestions = results

        if (category) {
          filteredQuestions = filteredQuestions.filter(
            (q) => decodeHtmlEntities(q.category) === category
          )
        }

        if (difficulty) {
          filteredQuestions = filteredQuestions.filter(
            (q) => q.difficulty === difficulty
          )
        }

        filteredQuestions = filteredQuestions.filter(
          (q) => q.type === type
        )

        const limitedQuestions = shuffle(filteredQuestions).slice(
          0,
          amount
        )

        return limitedQuestions.map((q) => {
          const question = decodeHtmlEntities(q.question)
          const categoryName = decodeHtmlEntities(q.category)
          const correctAnswer = decodeHtmlEntities(q.correct_answer)
          const incorrectAnswers = (q.incorrect_answers ?? []).map(
            decodeHtmlEntities
          )

          return {
            id: `${categoryName}:${question}`,
            question,
            correctAnswer,
            incorrectAnswers,
            allAnswers: shuffle([correctAnswer, ...incorrectAnswers]),
            category: categoryName,
            difficulty: q.difficulty,
            type: q.type,
          }
        })
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Failed to fetch quiz questions'

        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const fetchCategories = useCallback(async (): Promise<string[]> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.get(QUIZ_API_URL)
      const results = response?.data?.results

      if (!Array.isArray(results)) {
        throw new TypeError('Invalid API response format')
      }

      const categories = Array.from(
        new Set(results.map((q) => q.category))
      )

      return categories.map(decodeHtmlEntities).toSorted()
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to fetch categories'

      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    fetchQuestions,
    fetchCategories,
  }
}
