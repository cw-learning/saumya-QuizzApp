export const DEFAULT_QUIZ_OPTIONS = {
  NUMBER_OF_QUESTIONS: 10,
  TYPE: 'multiple',
} as const

export const QUIZ_DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const

export const QUIZ_LIMITS = {
  MIN_QUESTIONS: 1,
  MAX_QUESTIONS: 50,
} as const

export const SCORE_THRESHOLDS = {
  PERFECT: 100,
  EXCELLENT: 80,
  GOOD: 60,
  OK: 40,
} as const
