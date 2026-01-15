export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="shrink-0">
            <span className="text-4xl">❌</span>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error
            </h3>
            <p className="text-red-700 mb-4">
              {message || 'An unexpected error occurred. Please try again.'}
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
