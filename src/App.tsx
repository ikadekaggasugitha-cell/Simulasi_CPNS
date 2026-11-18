import React from 'react';
import {
  ExamProvider,
  isPublicAuthRoute,
  useExamContext,
} from './context/ExamContext';
import { AppShell } from './components/AppShell';
import { AuthView } from './components/AuthView';
import { PortalLandingView } from './components/PortalLandingView';
import { SkdDashboardView } from './components/SkdDashboardView';
import { SkbDashboardView } from './components/SkbDashboardView';
import { PreTestSetupView } from './components/PreTestSetupView';
import { HistoryView } from './components/HistoryView';
import { QuestionBankView } from './components/QuestionBankView';
import { ExamView } from './components/ExamView';
import { ResultView } from './components/ResultView';

const AppRouter: React.FC = () => {
  const {
    route,
    navigate,
    currentUser,
    authChecked,
    activeDetail,
    detailLoading,
    handleExamSubmitted,
    refreshSessionsByType,
  } = useExamContext();

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center space-y-2 max-w-sm w-full">
          <div className="h-5 w-2/3 mx-auto animate-pulse rounded bg-slate-200" />
          <p className="text-xs text-slate-500">Memverifikasi sesi akun peserta...</p>
        </div>
      </div>
    );
  }

  // Public Auth Routes (/login & /register) + strict redirect guard if unauthenticated
  if (!currentUser) {
    return <AuthView mode={route.kind === 'register' ? 'register' : 'login'} />;
  }

  if (isPublicAuthRoute(route)) {
    return (
      <AppShell>
        <PortalLandingView />
      </AppShell>
    );
  }

  if (route.kind === 'exam') {
    if (detailLoading || !activeDetail || activeDetail.session.id !== route.sessionId) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center space-y-2 max-w-sm w-full">
            <div className="h-5 w-2/3 mx-auto animate-pulse rounded bg-slate-200" />
            <p className="text-xs text-slate-500">Memuat lembar soal CAT...</p>
          </div>
        </div>
      );
    }

    return (
      <ExamView
        detail={activeDetail}
        onSubmitted={handleExamSubmitted}
        onExitToDashboard={() => {
          const examType = activeDetail.session.exam_type;
          void refreshSessionsByType(examType);
          navigate(examType === 'SKB' ? '/dashboard/skb' : '/dashboard/skd');
        }}
      />
    );
  }

  return (
    <AppShell>
      {route.kind === 'portal' && <PortalLandingView />}
      {route.kind === 'skd-dashboard' && <SkdDashboardView />}
      {route.kind === 'skb-dashboard' && <SkbDashboardView />}
      {route.kind === 'skd-setup' && <PreTestSetupView examType="SKD" />}
      {route.kind === 'skb-setup' && <PreTestSetupView examType="SKB" />}
      {route.kind === 'skd-history' && <HistoryView examType="SKD" />}
      {route.kind === 'skb-history' && <HistoryView examType="SKB" />}
      {route.kind === 'bank' && <QuestionBankView />}
      {route.kind === 'result' && (
        detailLoading || !activeDetail || activeDetail.session.id !== route.sessionId ? (
          <main className="mx-auto max-w-4xl px-4 py-12">
            <div className="rounded-xl border border-slate-200 bg-white p-8 space-y-3">
              <div className="h-6 w-1/3 animate-pulse rounded bg-slate-200" />
              <div className="h-24 w-full animate-pulse rounded bg-slate-100" />
            </div>
          </main>
        ) : (
          <ResultView
            detail={activeDetail}
            onBackToDashboard={() => {
              const examType = activeDetail.session.exam_type;
              void refreshSessionsByType(examType);
              navigate(examType === 'SKB' ? '/dashboard/skb' : '/dashboard/skd');
            }}
            onStartNewSimulation={() => {
              const examType = activeDetail.session.exam_type;
              navigate(examType === 'SKB' ? '/test/skb/setup' : '/test/skd/setup');
            }}
          />
        )
      )}
    </AppShell>
  );
};

export default function App() {
  return (
    <ExamProvider>
      <AppRouter />
    </ExamProvider>
  );
}
