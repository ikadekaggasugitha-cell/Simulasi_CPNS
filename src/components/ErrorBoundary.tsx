import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

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
    let readable = error.message || 'Terjadi kesalahan pada aplikasi.';
    try {
      const parsed = JSON.parse(readable) as { error?: string; operationType?: string };
      if (parsed && typeof parsed.error === 'string') {
        if (parsed.error.toLowerCase().includes('permission')) {
          readable =
            'Akses ke data ditolak oleh aturan keamanan Firestore. Pastikan Anda sudah masuk dengan akun yang terverifikasi.';
        } else {
          readable = parsed.error;
        }
      }
    } catch {
      // keep raw message
    }
    return { hasError: true, message: readable };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('App ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-7 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 text-red-700">
            <AlertTriangle className="h-6 w-6 shrink-0" aria-hidden="true" />
            <h1 className="text-lg font-bold text-slate-900">
              Terjadi Gangguan Koneksi Data
            </h1>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            {this.state.message}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>Muat Ulang Halaman</span>
          </button>
        </div>
      </div>
    );
  }
}
