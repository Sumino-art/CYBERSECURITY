import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#05070d] text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl border border-red-900/60 bg-[#090f1f] p-6 text-center space-y-4 shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-950/80 border border-red-500/40 text-red-400">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-bold text-white">
              ระบบแจ้งเตือนความปลอดภัยไซเบอร์ (CYBER SHIELD)
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              เกิดข้อผิดพลาดในการโหลดองค์ประกอบบางส่วน โปรดกดปุ่มด้านล่างเพื่อรีโหลดหน้าเว็บ
            </p>
            {this.state.error && (
              <pre className="p-3 rounded-lg bg-black/60 border border-slate-800 text-[10px] text-red-300 font-mono text-left overflow-x-auto">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>รีโหลดหน้าเว็บใหม่</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
