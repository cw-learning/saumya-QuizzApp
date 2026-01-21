import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      resetKey: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (import.meta.env.DEV) {
  console.error('Error caught by boundary:', error, errorInfo);
}

  }

  handleReset = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      resetKey: prevState.resetKey + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-6">
              <span className="text-6xl">⚠️</span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-6 text-center">
              We're sorry for the inconvenience. An unexpected error has occurred.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-sm font-semibold text-red-800 mb-2">
                  Error Details:
                </p>
                <p className="text-xs text-red-700 font-mono">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return <div key={this.state.resetKey}>{this.props.children}</div>;
  }
}

export default ErrorBoundary;
