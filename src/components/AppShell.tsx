import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  ChevronRight,
  Cpu,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Play,
  ShieldCheck,
  UserCircle2,
  X,
} from 'lucide-react';
import { useExamContext } from '../context/ExamContext';

interface AppShellProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  activeKinds: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const GENERAL_ITEMS: NavItem[] = [
  {
    label: 'Portal Utama',
    path: '/',
    activeKinds: ['portal'],
    icon: LayoutDashboard,
  },
  {
    label: 'Bank Soal SKD & SKB',
    path: '/bank',
    activeKinds: ['bank'],
    icon: BookOpen,
  },
];

const SKD_ITEMS: NavItem[] = [
  {
    label: 'Dashboard SKD',
    path: '/dashboard/skd',
    activeKinds: ['skd-dashboard'],
    icon: ShieldCheck,
  },
  {
    label: 'Mulai Ujian SKD',
    path: '/test/skd/setup',
    activeKinds: ['skd-setup'],
    icon: Play,
  },
  {
    label: 'Riwayat SKD',
    path: '/history/skd',
    activeKinds: ['skd-history'],
    icon: History,
  },
];

const SKB_ITEMS: NavItem[] = [
  {
    label: 'Dashboard SKB (IT)',
    path: '/dashboard/skb',
    activeKinds: ['skb-dashboard'],
    icon: Cpu,
  },
  {
    label: 'Mulai Ujian SKB',
    path: '/test/skb/setup',
    activeKinds: ['skb-setup'],
    icon: Play,
  },
  {
    label: 'Riwayat SKB',
    path: '/history/skb',
    activeKinds: ['skb-history'],
    icon: History,
  },
];

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { route, navigate, activeDetail, bankStats, currentUser, logout } = useExamContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const getBreadcrumbs = (): Array<{ label: string; path?: string }> => {
    switch (route.kind) {
      case 'portal':
        return [{ label: 'Portal Utama' }];
      case 'skd-dashboard':
        return [{ label: 'Portal', path: '/' }, { label: 'Dashboard SKD' }];
      case 'skb-dashboard':
        return [{ label: 'Portal', path: '/' }, { label: 'Dashboard SKB (IT)' }];
      case 'skd-setup':
        return [
          { label: 'SKD', path: '/dashboard/skd' },
          { label: 'Pengaturan Ujian SKD' },
        ];
      case 'skb-setup':
        return [
          { label: 'SKB IT', path: '/dashboard/skb' },
          { label: 'Pengaturan Ujian SKB' },
        ];
      case 'skd-history':
        return [
          { label: 'SKD', path: '/dashboard/skd' },
          { label: 'Riwayat SKD' },
        ];
      case 'skb-history':
        return [
          { label: 'SKB IT', path: '/dashboard/skb' },
          { label: 'Riwayat SKB' },
        ];
      case 'bank':
        return [{ label: 'Portal', path: '/' }, { label: 'Bank Soal SKD & SKB' }];
      case 'result': {
        const isSkb = activeDetail?.session.exam_type === 'SKB';
        return [
          {
            label: isSkb ? 'Riwayat SKB' : 'Riwayat SKD',
            path: isSkb ? '/history/skb' : '/history/skd',
          },
          { label: activeDetail?.session.nama_sesi ?? `Hasil #${route.sessionId}` },
        ];
      }
      default:
        return [{ label: 'Portal Utama' }];
    }
  };

  const isSkbContext =
    route.kind === 'skb-dashboard' ||
    route.kind === 'skb-setup' ||
    route.kind === 'skb-history' ||
    (route.kind === 'result' && activeDetail?.session.exam_type === 'SKB');

  const topCta = isSkbContext
    ? { label: 'Simulasi SKB Baru', path: '/test/skb/setup', accent: 'emerald' as const }
    : { label: 'Simulasi SKD Baru', path: '/test/skd/setup', accent: 'blue' as const };

  const renderNavGroup = (title: string, items: NavItem[], accent: 'slate' | 'blue' | 'emerald') => (
    <div className="space-y-1">
      <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {title}
      </p>
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.activeKinds.includes(route.kind);
        const activeClasses =
          accent === 'emerald'
            ? 'bg-emerald-50 text-emerald-900 font-semibold'
            : 'bg-blue-50 text-blue-900 font-semibold';
        const iconActive =
          accent === 'emerald' ? 'text-emerald-700' : 'text-blue-800';

        return (
          <button
            key={item.path}
            type="button"
            onClick={() => handleNav(item.path)}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${
              active
                ? activeClasses
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
            }`}
          >
            <Icon
              className={`h-4 w-4 shrink-0 ${active ? iconActive : 'text-slate-400'}`}
              aria-hidden="true"
            />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </div>
  );

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white border-r border-slate-200 px-4 py-5">
      <div className="space-y-6">
        {/* Brand */}
        <button
          type="button"
          onClick={() => handleNav('/')}
          className="flex w-full items-center gap-3 px-2 text-left rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-900 text-white">
            <Award className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <span className="block text-sm font-bold tracking-tight text-slate-900 truncate">
              CAT ASN Nusantara
            </span>
            <span className="block text-[11px] font-medium text-slate-500 truncate">
              Simulasi SKD &amp; SKB CPNS
            </span>
          </div>
        </button>

        {/* Nav Groups */}
        <nav aria-label="Menu navigasi utama" className="space-y-6">
          {renderNavGroup('Umum', GENERAL_ITEMS, 'slate')}
          {renderNavGroup('Modul SKD', SKD_ITEMS, 'blue')}
          {renderNavGroup('Modul SKB · IT', SKB_ITEMS, 'emerald')}
        </nav>
      </div>

      {/* Active Account & Bank Summary Footer in Sidebar */}
      <div className="border-t border-slate-200 pt-4 px-2 space-y-4 text-xs text-slate-500">
        {currentUser && (
          <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3 space-y-2">
            <div className="flex items-center gap-2 min-w-0">
              <UserCircle2 className="h-5 w-5 shrink-0 text-blue-900" aria-hidden="true" />
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                void logout();
              }}
              className="flex w-full items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </div>
        )}

        <div className="space-y-1.5">
          <p className="font-semibold text-slate-700">Ketersediaan Bank Soal</p>
          <div className="flex items-center justify-between font-mono tabular-nums">
            <span>SKD (TWK/TIU/TKP)</span>
            <span className="font-semibold text-blue-900">
              {bankStats ? bankStats.skdTotal.toLocaleString('id-ID') : '—'}
            </span>
          </div>
          <div className="flex items-center justify-between font-mono tabular-nums">
            <span>SKB (Prakom IT)</span>
            <span className="font-semibold text-emerald-800">
              {bankStats ? bankStats.skbTotal.toLocaleString('id-ID') : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block lg:w-64 lg:shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/50"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 max-w-[85vw] h-full bg-white shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Tutup menu"
              className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Content Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Single-Row Top Header */}
        <header className="sticky top-0 z-30 h-14 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Buka menu navigasi"
                className="inline-flex lg:hidden items-center justify-center rounded-md border border-slate-200 p-1.5 text-slate-700 hover:bg-slate-100"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>

              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm min-w-0">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={crumb.label}>
                    {idx > 0 && (
                      <ChevronRight
                        className="h-4 w-4 text-slate-400 shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    {crumb.path ? (
                      <button
                        type="button"
                        onClick={() => navigate(crumb.path!)}
                        className="font-medium text-slate-500 hover:text-slate-900 truncate focus-visible:outline-none focus-visible:underline"
                      >
                        {crumb.label}
                      </button>
                    ) : (
                      <span className="font-semibold text-slate-900 truncate">
                        {crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {currentUser && (
                <div className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
                  <UserCircle2 className="h-4 w-4 text-blue-900 shrink-0" aria-hidden="true" />
                  <div className="max-w-[160px] truncate">
                    <span className="font-semibold text-slate-900">{currentUser.name}</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => navigate(topCta.path)}
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-semibold text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${
                  topCta.accent === 'emerald'
                    ? 'bg-emerald-700 hover:bg-emerald-800'
                    : 'bg-blue-900 hover:bg-blue-800'
                }`}
              >
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{topCta.label}</span>
              </button>

              {currentUser && (
                <button
                  type="button"
                  data-testid="header-logout-button"
                  onClick={() => void logout()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                >
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="border-t border-slate-200 bg-white mt-12">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <span>CAT ASN Nusantara · Platform Simulasi SKD &amp; SKB CPNS</span>
            <span>SKD (TWK · TIU · TKP) &amp; SKB IT (RPL · Basis Data · Manajemen Data · Jaringan Dasar)</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
