import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
 import { fetchQuizQuestions, fetchQuizCategories, decodeHtmlEntities } from './quizApi';

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

 

it('decodes HTML entities', () => {
  expect(decodeHtmlEntities('Tom &amp; Jerry')).toBe('Tom & Jerry');
});

it('rejects invalid numberOfQuestions', async () => {
  await expect(fetchQuizQuestions({ numberOfQuestions: 0 })).rejects.toThrow(
    /positive integer/i,
  );
});

it('surfaces axios failures', async () => {
  axios.get.mockRejectedValueOnce(new Error('Network down'));
  await expect(fetchQuizQuestions({ numberOfQuestions: 1 })).rejects.toThrow(
    /Failed to fetch quiz questions/i,
  );
});

it('validates response shape', async () => {
  axios.get.mockResolvedValueOnce({ data: { results: null } });
  await expect(fetchQuizQuestions({ numberOfQuestions: 1 })).rejects.toThrow(
    /Invalid API response format/i,
  );
});

it('calls axios with the expected URL', async () => {
  axios.get.mockResolvedValueOnce({ data: { results: [] } });
  await fetchQuizCategories();
  expect(axios.get).toHaveBeenCalledWith(
    'https://raw.githubusercontent.com/SaumyaDwivedi179/quizApi/refs/heads/main/quiz-data.json',
  );
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
