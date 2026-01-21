import { useQuizContext } from '../../context/QuizContext';
import Question from '../Question/Question';
import Result from '../Result/Result';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { useForm } from '../../Hooks/Useform';
import { validateRequired } from '../../Utils/Validation';

const Quiz = () => {
  const { 
    questions,
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
        <div className="max-w-2xl w-full animate-fade-in">
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 p-4">
        <div className="animate-fade-in">
          <Result />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600"></div>
            <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-600 absolute top-0 left-0" style={{animationDirection: 'reverse'}}></div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-800 animate-pulse">Loading quiz...</p>
            <p className="text-gray-600">Preparing your questions</p>
          </div>
        </div>
      </div>
    );
  }

  // Show quiz setup page if quiz hasn't started
  if (!isLoading && !error && !isQuizComplete && questions.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-4xl w-full relative z-10 animate-fade-in max-h-screen overflow-y-auto py-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg">Quiz App</h1>
            <p className="text-lg text-blue-100 mb-4">Test your knowledge!</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-white/90 text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Multiple Categories</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Track Your Score</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Difficulty Levels</span>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-1">
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
                  className={`w-full px-3 py-2 border ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                )}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">
                  Category (Optional)
                </label>
                <select
                  id="category"
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="">Any Category</option>
                  <option value="General Knowledge">General Knowledge</option>
                  <option value="Science: Computers">Science: Computers</option>
                  <option value="Science & Nature">Science & Nature</option>
                  <option value="Entertainment: Music">Entertainment: Music</option>
                  <option value="Entertainment: Film">Entertainment: Film</option>
                  <option value="Sports">Sports</option>
                  <option value="Geography">Geography</option>
                  <option value="History">History</option>
                </select>
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-semibold text-gray-700 mb-1">
                  Difficulty (Optional)
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={values.difficulty}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="">Any Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <button
                type="submit"
                className="group relative w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>Start Quiz</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Show current question
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Question />
    </div>
  );
};

export default Quiz;
