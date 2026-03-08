import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends (React.Component as any) {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: any) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      return fallback || (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Đã có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            Chúng tôi xin lỗi vì sự cố này. Vui lòng thử tải lại trang hoặc quay lại sau.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Tải lại trang
          </button>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-red-50 text-red-700 text-xs text-left overflow-auto max-w-full rounded border border-red-100">
              <pre>{error?.toString()}</pre>
            </div>
          )}
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
