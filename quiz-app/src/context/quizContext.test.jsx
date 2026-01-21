import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QuizProvider, useQuizContext } from './quizContext';
import { fetchQuizQuestions } from '../services/quizApi';

// Mock the API module
vi.mock('../services/quizApi', () => ({
  fetchQuizQuestions: vi.fn(),
}));

describe('QuizContext', () => {
  const mockQuestions = [
    {
      question: 'Question 1?',
      correct_answer: 'Answer 1',
      incorrect_answers: ['Wrong 1', 'Wrong 2', 'Wrong 3'],
    },
    {
      question: 'Question 2?',
      correct_answer: 'Answer 2',
      incorrect_answers: ['Wrong 1', 'Wrong 2', 'Wrong 3'],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw error when useQuizContext is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useQuizContext())).toThrow(
      'useQuizContext must be used within QuizProvider'
    );
    consoleSpy.mockRestore();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useQuizContext(), { wrapper: QuizProvider });

    expect(result.current.questions).toEqual([]);
    expect(result.current.currentQuestionIndex).toBe(0);
    expect(result.current.score).toBe(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.isQuizComplete).toBe(false);
  });

  it('should load questions successfully', async () => {
    fetchQuizQuestions.mockResolvedValue(mockQuestions);

    const { result } = renderHook(() => useQuizContext(), { wrapper: QuizProvider });

    await act(async () => {
      await result.current.loadQuestions(10);
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.questions).toEqual(mockQuestions);
    expect(result.current.error).toBe(null);
  });

  it('should forward params to fetchQuizQuestions', async () => {
    fetchQuizQuestions.mockResolvedValue([]);

    const { result } = renderHook(() => useQuizContext(), { wrapper: QuizProvider });

    await act(async () => {
      await result.current.loadQuestions(5, '9', 'easy');
    });

    expect(fetchQuizQuestions).toHaveBeenCalledWith({
      numberOfQuestions: 5,
      category: '9',
      difficulty: 'easy',
    });
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Failed to fetch questions';
    fetchQuizQuestions.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useQuizContext(), { wrapper: QuizProvider });

    await act(async () => {
      await result.current.loadQuestions(10);
    });

    await waitFor(() => expect(result.current.error).toBe(errorMessage));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.questions).toEqual([]);
  });

  it('should no-op selectAnswer when no questions are loaded', () => {
    const { result } = renderHook(() => useQuizContext(), { wrapper: QuizProvider });

    act(() => {
      result.current.selectAnswer('Anything');
    });

    expect(result.current.userAnswers).toEqual([]);
    expect(result.current.score).toBe(0);
  });

  it('should select answer and update score when correct', async () => {
    fetchQuizQuestions.mockResolvedValue(mockQuestions);

    const { result } = renderHook(() => useQuizContext(), { wrapper: QuizProvider });

    await act(async () => {
      await result.current.loadQuestions(10);
    });

    act(() => {
      result.current.selectAnswer('Answer 1');
    });

    expect(result.current.score).toBe(1);
    expect(result.current.userAnswers).toContain('Answer 1');
  });

  it('should not update score when answer is incorrect', async () => {
    fetchQuizQuestions.mockResolvedValue(mockQuestions);

    const { result } = renderHook(() => useQuizContext(), { wrapper: QuizProvider });

    await act(async () => {
      await result.current.loadQuestions(10);
    });

    act(() => {
      result.current.selectAnswer('Wrong 1');
    });

    expect(result.current.score).toBe(0);
    expect(result.current.userAnswers).toContain('Wrong 1');
  });

  it('should move to next question', async () => {
    fetchQuizQuestions.mockResolvedValue(mockQuestions);

    const { result } = renderHook(() => useQuizContext(), { wrapper: QuizProvider });

    await act(async () => {
      await result.current.loadQuestions(10);
    });

    act(() => {
      result.current.nextQuestion();
    });

    expect(result.current.currentQuestionIndex).toBe(1);
    expect(result.current.isQuizComplete).toBe(false);
  });

  it('should mark quiz as complete when reaching last question', async () => {
    fetchQuizQuestions.mockResolvedValue(mockQuestions);

    const { result } = renderHook(() => useQuizContext(), { wrapper: QuizProvider });

    await act(async () => {
      await result.current.loadQuestions(10);
    });

    act(() => {
      result.current.nextQuestion();
      result.current.nextQuestion();
    });

    expect(result.current.isQuizComplete).toBe(true);
  });

  it('should not advance index after quiz is complete', async () => {
    fetchQuizQuestions.mockResolvedValue(mockQuestions);

    const { result } = renderHook(() => useQuizContext(), { wrapper: QuizProvider });

    await act(async () => {
      await result.current.loadQuestions(10);
    });

    // Complete the quiz
    act(() => {
      result.current.nextQuestion();
      result.current.nextQuestion();
    });

    const indexAfterComplete = result.current.currentQuestionIndex;

    act(() => {
      result.current.nextQuestion();
    });

    expect(result.current.currentQuestionIndex).toBe(indexAfterComplete);
    expect(result.current.isQuizComplete).toBe(true);
  });

  it('should reset quiz to initial state', async () => {
    fetchQuizQuestions.mockResolvedValue(mockQuestions);

    const { result } = renderHook(() => useQuizContext(), { wrapper: QuizProvider });

    await act(async () => {
      await result.current.loadQuestions(10);
    });

    act(() => {
      result.current.selectAnswer('Answer 1');
      result.current.nextQuestion();
    });

    act(() => {
      result.current.resetQuiz();
    });

    expect(result.current.questions).toEqual([]);
    expect(result.current.currentQuestionIndex).toBe(0);
    expect(result.current.score).toBe(0);
    expect(result.current.userAnswers).toEqual([]);
    expect(result.current.isQuizComplete).toBe(false);
  });
});
