import React from 'react';

export type ActiveTab = 'dashboard' | 'bank' | 'history';

interface TopNavProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  onQuickStart: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onNavigate,
  onQuickStart,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="text-left text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 rounded"
        >
          CAT SKD Nusantara
        </button>

        <nav aria-label="Navigasi utama" className="hidden md:flex items-center gap-6">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className={`text-sm font-medium transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${
              activeTab === 'dashboard'
                ? 'border-blue-800 text-blue-900'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Simulasi
          </button>
          <button
            type="button"
            onClick={() => onNavigate('history')}
            className={`text-sm font-medium transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${
              activeTab === 'history'
                ? 'border-blue-800 text-blue-900'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Riwayat Sesi
          </button>
          <button
            type="button"
            onClick={() => onNavigate('bank')}
            className={`text-sm font-medium transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${
              activeTab === 'bank'
                ? 'border-blue-800 text-blue-900'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Bank Soal
          </button>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onQuickStart}
            className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
          >
            Mulai Simulasi
          </button>
        </div>
      </div>

      {/* Compact mobile sub-nav */}
      <div className="flex md:hidden border-t border-slate-100 px-4 py-2 gap-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className={`text-xs font-medium whitespace-nowrap shrink-0 ${
            activeTab === 'dashboard' ? 'text-blue-900 underline underline-offset-4' : 'text-slate-600'
          }`}
        >
          Simulasi
        </button>
        <button
          type="button"
          onClick={() => onNavigate('history')}
          className={`text-xs font-medium whitespace-nowrap shrink-0 ${
            activeTab === 'history' ? 'text-blue-900 underline underline-offset-4' : 'text-slate-600'
          }`}
        >
          Riwayat Sesi
        </button>
        <button
          type="button"
          onClick={() => onNavigate('bank')}
          className={`text-xs font-medium whitespace-nowrap shrink-0 ${
            activeTab === 'bank' ? 'text-blue-900 underline underline-offset-4' : 'text-slate-600'
          }`}
        >
          Bank Soal
        </button>
      </div>
    </header>
  );
};
