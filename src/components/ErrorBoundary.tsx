import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'An unexpected error occurred.',
    };
  }

  override render() {
    if (this.state.hasError) {
      let friendly = this.state.message;
      try {
        const parsed = JSON.parse(this.state.message);
        if (parsed && parsed.error) {
          friendly = `Database access note (${parsed.operationType}): ${parsed.error}`;
        }
      } catch {
        // Non-JSON error message; keep raw string
      }

      return (
        <div className="min-h-screen bg-[#05070B] text-[#F3F6FB] flex items-center justify-center p-6">
          <div className="max-w-lg w-full border border-[#3B82F6]/35 bg-[#0A0F1A] p-8 rounded-lg space-y-4">
            <p className="text-xs tracking-widest uppercase text-[#60A5FA]">
              CloudCrest Stayz · Recovery Notice
            </p>
            <h1 className="font-display text-3xl font-semibold text-[#F3F6FB]">
              We paused to protect your session
            </h1>
            <p className="text-sm leading-relaxed text-[#F3F6FB]/75">{friendly}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-md hover:bg-[#1D4ED8] transition-colors cursor-pointer"
            >
              Reload CloudCrest Stayz
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
