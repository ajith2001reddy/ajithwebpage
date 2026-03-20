'use client';
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black p-6">
          <div className="max-w-md w-full glass-card p-12 text-center border-red-500/20">
            <h1 className="text-4xl font-black font-montserrat text-red-600 mb-6 uppercase tracking-tighter">System Halt</h1>
            <p className="text-xs font-mono text-red-400 mb-8 opacity-60">A critical logic error has occurred. The neural synchronization was compromised.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-red-600/10 border border-red-600/50 text-red-600 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-red-600 hover:text-white transition-all"
            >
              Reinitialize
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
