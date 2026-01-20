import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QuizProvider, useQuizContext } from './QuizContext';

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
    
    expect(() => {
      renderHook(() => useQuizContext());
    }).toThrow('useQuizContext must be used within QuizProvider');
    
    consoleSpy.mockRestore();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useQuizContext(), {
      wrapper: QuizProvider,
    });

    expect(result.current.questions).toEqual([]);
    expect(result.current.currentQuestionIndex).toBe(0);
    expect(result.current.score).toBe(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.isQuizComplete).toBe(false);
  });

  it('should load questions successfully', async () => {
    const { fetchQuizQuestions } = await import('../services/quizApi');
    vi.mocked(fetchQuizQuestions).mockResolvedValue(mockQuestions);

    const { result } = renderHook(() => useQuizContext(), {
      wrapper: QuizProvider,
    });

    await act(async () => {
      await result.current.loadQuestions(10);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.questions).toEqual(mockQuestions);
    expect(result.current.error).toBe(null);
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Failed to fetch questions';
    const { fetchQuizQuestions } = await import('../services/quizApi');
    vi.mocked(fetchQuizQuestions).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useQuizContext(), {
      wrapper: QuizProvider,
    });

    await act(async () => {
      await result.current.loadQuestions(10);
    });

    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.questions).toEqual([]);
  });

  it('should select answer and update score when correct', async () => {
    const { fetchQuizQuestions } = await import('../services/quizApi');
    vi.mocked(fetchQuizQuestions).mockResolvedValue(mockQuestions);

    const { result } = renderHook(() => useQuizContext(), {
      wrapper: QuizProvider,
    });

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
    const { fetchQuizQuestions } = await import('../services/quizApi');
    vi.mocked(fetchQuizQuestions).mockResolvedValue(mockQuestions);

    const { result } = renderHook(() => useQuizContext(), {
      wrapper: QuizProvider,
    });

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
    const { fetchQuizQuestions } = await import('../services/quizApi');
    vi.mocked(fetchQuizQuestions).mockResolvedValue(mockQuestions);

    const { result } = renderHook(() => useQuizContext(), {
      wrapper: QuizProvider,
    });

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
    const { fetchQuizQuestions } = await import('../services/quizApi');
    vi.mocked(fetchQuizQuestions).mockResolvedValue(mockQuestions);

    const { result } = renderHook(() => useQuizContext(), {
      wrapper: QuizProvider,
    });

    await act(async () => {
      await result.current.loadQuestions(10);
    });

    act(() => {
      result.current.nextQuestion();
      result.current.nextQuestion();
    });

    expect(result.current.isQuizComplete).toBe(true);
  });

  it('should reset quiz to initial state', async () => {
    const { fetchQuizQuestions } = await import('../services/quizApi');
    vi.mocked(fetchQuizQuestions).mockResolvedValue(mockQuestions);

    const { result } = renderHook(() => useQuizContext(), {
      wrapper: QuizProvider,
    });

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
