import axios from 'axios';

const QUIZ_URL = 'https://raw.githubusercontent.com/SaumyaDwivedi179/quizApi/refs/heads/main/quiz-data.json';

export const decodeHtmlEntities = (text = '') => {
  const input = text == null ? '' : String(text);

  if (typeof document !== 'undefined') {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = input;
    return textArea.value;
  }

  // Correct numeric entity decoding in Node/SSR
  return input
  .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
  .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(parseInt(num, 10)))
  .replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'")
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>');

};
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};


export const fetchQuizQuestions = async (options = {}) => {
  const {
    numberOfQuestions = 10,
    category = '',
    difficulty = '',
    type = 'multiple',
  } = options;

  const amount = Number(numberOfQuestions);
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error('numberOfQuestions must be a positive integer');
  }

  const allowedDifficulties = new Set(['easy', 'medium', 'hard']);
  if (difficulty && !allowedDifficulties.has(difficulty)) {
    throw new Error('difficulty must be one of: easy, medium, hard');
  }

  const allowedTypes = new Set(['multiple', 'boolean']);
  if (type && !allowedTypes.has(type)) {
    throw new Error('type must be one of: multiple, boolean');
  }

  try {
    const response = await axios.get(QUIZ_URL);
    const results = response?.data?.results;
    if (!Array.isArray(results)) {
      throw new Error('Invalid API response format');
    }

    let questions = results;

    if (category) {
      questions = questions.filter(
        (q) => decodeHtmlEntities(q.category) === category
      );
    }
    if (difficulty) {
      questions = questions.filter((q) => q.difficulty === difficulty);
    }

    // Filter by type exactly once
    questions = questions.filter((q) => q.type === type);

    // Limit number of questions
    const limited = shuffleArray(questions).slice(0, amount);

    return limited.map((q) => {
      const question = decodeHtmlEntities(q.question);
      const categoryName = decodeHtmlEntities(q.category);
      const correctAnswer = decodeHtmlEntities(q.correct_answer);
      const incorrectAnswers = (q.incorrect_answers ?? []).map(decodeHtmlEntities);

      return {
        id: `${categoryName}:${question}`,
        question,
        correctAnswer,
        incorrectAnswers,
        allAnswers: shuffleArray([correctAnswer, ...incorrectAnswers]),
        category: categoryName,
        difficulty: q.difficulty,
        type: q.type,
      };
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to fetch quiz questions: ${message}`, { cause: err });
  }
};



export const fetchQuizCategories = async () => {
  try {
    const response = await axios.get(QUIZ_URL);
    
    if (!response.data || !response.data.results) {
      throw new Error('Invalid API response format');
    }

    const categories = [...new Set(results.map((q) => decodeHtmlEntities(q.category)))];

    return categories.sort().map((name, index) => ({
      id: index + 1,
      name,
    }));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to fetch categories: ${message}`);
  }
};
