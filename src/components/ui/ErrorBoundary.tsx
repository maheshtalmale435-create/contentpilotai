import React, { Component, type ReactNode } from 'react';
import { clearState } from '@/data/storage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ContentPilot AI Error Boundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    clearState();
    window.location.href = window.location.pathname;
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center p-6 text-[#171717] font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#171717]/10 shadow-2xl text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#3457F1]/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#3457F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold mb-2">ContentPilot AI</h1>
            <p className="text-sm text-[#171717]/70 mb-6">
              A temporary issue occurred while loading this page. Clearing your local session cache will restore full functionality.
            </p>
            {this.state.error && (
              <pre className="text-left text-xs bg-gray-50 p-3 rounded-xl mb-6 text-red-600 overflow-x-auto max-h-32 font-mono">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={this.handleReset}
                className="w-full py-3 px-4 rounded-xl bg-[#3457F1] hover:bg-[#2844c8] text-white font-semibold text-sm transition-all shadow-md active:scale-[0.98]"
              >
                Reset Session & Reload
              </button>
              <button
                onClick={this.handleReload}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-xs transition-all"
              >
                Just Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
