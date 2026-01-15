import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { fetchQuizQuestions, fetchQuizCategories } from './quizApi';

// Mock axios directly
vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn(),
    },
  };
});

describe('Quiz API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchQuizQuestions', () => {
    it('fetches quiz questions successfully', async () => {
      axios.get.mockResolvedValueOnce({
        data: {
          response_code: 0,
          results: [
            {
              question: 'What is H2O?',
              correct_answer: 'Water',
              incorrect_answers: ['Fire', 'Air'],
              category: 'Science',
              difficulty: 'easy',
              type: 'multiple'
            },
          ],
        },
      });

      const result = await fetchQuizQuestions({ numberOfQuestions: 1 });
      expect(result).toHaveLength(1);
      expect(result[0].correctAnswer).toBe('Water');
      expect(result[0].incorrectAnswers).toEqual(['Fire', 'Air']);
    });

    it('handles empty results', async () => {
      axios.get.mockResolvedValueOnce({
        data: {
          response_code: 0,
          results: [],
        },
      });

      const result = await fetchQuizQuestions({ numberOfQuestions: 1 });
      expect(result).toHaveLength(0);
    });
  });

  describe('fetchQuizCategories', () => {
    it('fetches categories successfully', async () => {
      axios.get.mockResolvedValueOnce({
        data: {
          response_code: 0,
          results: [
            { category: 'General Knowledge', correct_answer: 'A', incorrect_answers: [] },
            { category: 'Books', correct_answer: 'B', incorrect_answers: [] },
          ],
        },
      });

      const categories = await fetchQuizCategories();
      expect(categories).toHaveLength(2);
      expect(categories[0].name).toBe('Books');
    });
  });
});
