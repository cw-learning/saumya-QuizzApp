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

  // ----------------------
  // decodeHtmlEntities tests
  // ----------------------
  it('decodes HTML entities', () => {
    expect(decodeHtmlEntities('Tom &amp; Jerry')).toBe('Tom & Jerry');
  });

  it('decodes numeric entities without a DOM', () => {
    vi.stubGlobal('document', undefined);
    try {
      expect(decodeHtmlEntities('&#039;')).toBe("'");
      expect(decodeHtmlEntities('&#x27;')).toBe("'");
    } finally {
      vi.unstubAllGlobals();
    }
  });

  // ----------------------
  // fetchQuizQuestions validation tests
  // ----------------------
  it('rejects invalid numberOfQuestions', async () => {
    await expect(fetchQuizQuestions({ numberOfQuestions: 0 })).rejects.toThrow(
      /positive integer/i
    );
  });

  it('surfaces axios failures', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network down'));
    await expect(fetchQuizQuestions({ numberOfQuestions: 1 })).rejects.toThrow(
      /Failed to fetch quiz questions/i
    );
  });

  it('validates response shape', async () => {
    axios.get.mockResolvedValueOnce({ data: { results: null } });
    await expect(fetchQuizQuestions({ numberOfQuestions: 1 })).rejects.toThrow(
      /Invalid API response format/i
    );
  });

  // ----------------------
  // fetchQuizQuestions success-path tests
  // ----------------------
  describe('fetchQuizQuestions', () => {
    it('fetches quiz questions successfully and normalizes fields', async () => {
      axios.get.mockResolvedValueOnce({
        data: {
          results: [
            {
              question: 'What is H2O?',
              correct_answer: 'Water',
              incorrect_answers: ['Fire', 'Air'],
              category: 'Science',
              difficulty: 'easy',
              type: 'multiple',
            },
          ],
        },
      });

      const result = await fetchQuizQuestions({ numberOfQuestions: 1 });

      expect(result).toHaveLength(1);
      expect(result[0].correctAnswer).toBe('Water');
      expect(result[0].incorrectAnswers).toEqual(['Fire', 'Air']);
      expect(result[0].allAnswers).toEqual(
        expect.arrayContaining(['Water', 'Fire', 'Air'])
      );
      expect(result[0].question).toBe('What is H2O?');
      expect(result[0].category).toBe('Science');
      expect(result[0].difficulty).toBe('easy');
      expect(result[0].type).toBe('multiple');
    });

    it('returns an empty array when the API returns no results', async () => {
      axios.get.mockResolvedValueOnce({ data: { results: [] } });
      await expect(fetchQuizQuestions({ numberOfQuestions: 1 })).resolves.toEqual([]);
    });
  });

  
  it('calls axios with a quiz-data URL', async () => {
    axios.get.mockResolvedValueOnce({ data: { results: [] } });
    await fetchQuizCategories();
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('quiz-data.json'));
  });

  describe('fetchQuizCategories', () => {
    it('fetches categories successfully', async () => {
      axios.get.mockResolvedValueOnce({
        data: {
          results: [
            { category: 'General Knowledge', correct_answer: 'A', incorrect_answers: [] },
            { category: 'Books', correct_answer: 'B', incorrect_answers: [] },
          ],
        },
      });

      const categories = await fetchQuizCategories();
      expect(categories).toHaveLength(2);
      expect(categories[0].name).toBe('Books');
      expect(categories[1].name).toBe('General Knowledge');
    });
  });
});