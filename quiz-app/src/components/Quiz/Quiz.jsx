import { useQuizContext } from '../../context/quizContext';
import Question from '../question/question';
import Result from '../Result/Result';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { useForm } from '../../Hooks/Useform';
import { validateRequired } from '../../Utils/Validation';

const Quiz = () => {
  const { 
    isLoading, 
    error, 
    isQuizComplete, 
    loadQuestions 
  } = useQuizContext();

  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: {
      amount: '10',
      category: '',
      difficulty: ''
    },
    validationSchema: {
      amount: (value) => validateRequired(value, 'Number of questions')
    },
    onSubmit: (formValues) => {
      loadQuestions(
        parseInt(formValues.amount, 10),
        formValues.category,
        formValues.difficulty
      );
    }
  });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl w-full">
          <ErrorMessage 
            message={error} 
            onRetry={() => window.location.reload()} 
          />
        </div>
      </div>
    );
  }

  if (isQuizComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
        <Result />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Show quiz configuration form if quiz hasn't started
  if (!isLoading && !error && !isQuizComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Quiz App</h1>
            <p className="text-gray-600">Test your knowledge!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Questions
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={values.amount}
                onChange={handleChange}
                min="1"
                max="50"
                className={`w-full px-4 py-3 border ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                Category (Optional)
              </label>
              <select
                id="category"
                name="category"
                value={values.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="">Any Category</option>
                <option value="9">General Knowledge</option>
                <option value="10">Entertainment: Books</option>
                <option value="11">Entertainment: Film</option>
                <option value="12">Entertainment: Music</option>
                <option value="17">Science & Nature</option>
                <option value="18">Science: Computers</option>
                <option value="21">Sports</option>
                <option value="22">Geography</option>
                <option value="23">History</option>
              </select>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-semibold text-gray-700 mb-2">
                Difficulty (Optional)
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={values.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="">Any Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Start Quiz
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Show current question
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <Question />
    </div>
  );
};

export default Quiz;
