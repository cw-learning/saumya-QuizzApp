import axios from 'axios';
import { decodeHtmlEntities } from '../Utils/decodeHtmlEntities';
import { shuffle } from '../Utils/shuffle';
import { DEFAULT_QUIZ_OPTIONS } from '../constants/quizConstants';

const QUIZ_URL =
  'https://raw.githubusercontent.com/SaumyaDwivedi179/quizApi/refs/heads/main/quiz-data.json';


export const fetchQuizQuestions = async (options = {}) => {
  const {
    numberOfQuestions,
    category,
    difficulty,
    type,
  } = { ...DEFAULT_QUIZ_OPTIONS, ...options };

  const amount = Number(numberOfQuestions);
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error('numberOfQuestions must be a positive integer');
  }

  try {
    const response = await axios.get(QUIZ_URL);
    const results = response?.data?.results;

    if (!Array.isArray(results)) {
      throw new TypeError('Invalid API response format: results must be an array');
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

    questions = questions.filter((q) => q.type === type);

    const shuffled = shuffle(questions);
    const limited = shuffled.slice(0, amount);

    return limited.map((q) => {
      const question = decodeHtmlEntities(q.question);
      const categoryName = decodeHtmlEntities(q.category);
      const correctAnswer = decodeHtmlEntities(q.correct_answer);
      const incorrectAnswers = (q.incorrect_answers ?? []).map(
        decodeHtmlEntities
      );

      return {
        id: `${categoryName}:${question}`,
        question,
        correctAnswer,
        incorrectAnswers,
        allAnswers: shuffle([correctAnswer, ...incorrectAnswers]),
        category: categoryName,
        difficulty: q.difficulty,
        type: q.type,
      };
    });
  } catch (err) {
    throw new Error(`Failed to fetch quiz questions: ${err.message}`, {
      cause: err,
    });
  }
};

export const fetchQuizCategories = async () => {
  const response = await axios.get(QUIZ_URL);
  const results = response?.data?.results;

  if (!Array.isArray(results)) {
    throw new TypeError('Invalid API response format: results must be an array');
  }

  const categories = [...new Set(results.map((q) => q.category))];
  const sortedCategories = categories.toSorted();

  return sortedCategories.map((name, index) => ({
    id: index + 1,
    name,
  }));
};

