import axios from 'axios';

const TRIVIA_API_BASE_URL = 'https://raw.githubusercontent.com/SaumyaDwivedi179/quizApi/refs/heads/main/quiz-data.json';


export const decodeHtmlEntities = (text = '') => {
  const input = text == null ? '' : String(text);

  if (typeof document === 'undefined') {
    return input; 
    
  }

  const textArea = document.createElement('textarea');
  textArea.innerHTML = input;
  return textArea.value;
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

  try {
    const response = await axios.get(TRIVIA_API_BASE_URL);
    
    if (!response.data || !response.data.results) {
      throw new Error('Invalid API response format');
    }

    let questions = response.data.results;

    
    
    if (category) {
      questions = questions.filter(q => q.category === category);
    }

    
    
    if (difficulty) {
      questions = questions.filter(q => q.difficulty === difficulty);
    }

    
    questions = questions.filter(q => q.type === type);

    const shuffled = shuffleArray(questions);
    const limited = shuffled.slice(0, amount);

    
    
    return limited.map((q, index) => {
      const correct = decodeHtmlEntities(q.correct_answer);
      const incorrect = q.incorrect_answers.map(decodeHtmlEntities);

      return {
        id: index + 1,
        question: decodeHtmlEntities(q.question),
        correctAnswer: correct,
        incorrectAnswers: incorrect,
        allAnswers: shuffleArray([correct, ...incorrect]),
        category: decodeHtmlEntities(q.category),
        difficulty: q.difficulty,
        type: q.type,
      };
    });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    throw new Error(`Failed to fetch quiz questions: ${error.message}`);
  }
};

export const fetchQuizCategories = async () => {
  try {
    const response = await axios.get(TRIVIA_API_BASE_URL);
    
    if (!response.data || !response.data.results) {
      throw new Error('Invalid API response format');
    }

    
    const categories = [...new Set(response.data.results.map(q => q.category))];
    
   
    
    return categories.sort().map((name, index) => ({
      id: index + 1,
      name
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }
};
