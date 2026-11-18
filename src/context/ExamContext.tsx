import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {
  CategoryMeta,
  CreateSkbSessionPayload,
  CreateSkdSessionPayload,
  ExamType,
  QuestionBankStats,
  SessionDetailResponse,
  SessionMode,
  SessionSummary,
} from '../shared/types';
import {
  createSkbSession,
  createSkdSession,
  deleteSession,
  fetchHealth,
  fetchSessionDetail,
  fetchSessions,
} from '../utils/api';

export type AppRoute =
  | { kind: 'portal' }
  | { kind: 'skd-dashboard' }
  | { kind: 'skb-dashboard' }
  | { kind: 'skd-setup' }
  | { kind: 'skb-setup' }
  | { kind: 'skd-history' }
  | { kind: 'skb-history' }
  | { kind: 'bank'; examType?: ExamType }
  | { kind: 'exam'; sessionId: number }
  | { kind: 'result'; sessionId: number };

export function parseRoute(pathname: string): AppRoute {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/dashboard/skd') return { kind: 'skd-dashboard' };
  if (clean === '/dashboard/skb') return { kind: 'skb-dashboard' };
  if (clean === '/test/skd/setup') return { kind: 'skd-setup' };
  if (clean === '/test/skb/setup') return { kind: 'skb-setup' };
  if (clean === '/history/skd') return { kind: 'skd-history' };
  if (clean === '/history/skb') return { kind: 'skb-history' };
  if (clean === '/bank') return { kind: 'bank' };

  const examMatch = clean.match(/^\/exam\/(\d+)$/);
  if (examMatch) return { kind: 'exam', sessionId: Number(examMatch[1]) };

  const resultMatch = clean.match(/^\/result\/(\d+)$/);
  if (resultMatch) return { kind: 'result', sessionId: Number(resultMatch[1]) };

  return { kind: 'portal' };
}

export function routeToPath(route: AppRoute): string {
  switch (route.kind) {
    case 'portal':
      return '/';
    case 'skd-dashboard':
      return '/dashboard/skd';
    case 'skb-dashboard':
      return '/dashboard/skb';
    case 'skd-setup':
      return '/test/skd/setup';
    case 'skb-setup':
      return '/test/skb/setup';
    case 'skd-history':
      return '/history/skd';
    case 'skb-history':
      return '/history/skb';
    case 'bank':
      return '/bank';
    case 'exam':
      return `/exam/${route.sessionId}`;
    case 'result':
      return `/result/${route.sessionId}`;
  }
}

interface NavigateOptions {
  bankExamType?: ExamType;
  setupMode?: SessionMode;
}

interface ExamContextValue {
  route: AppRoute;
  navigate: (path: string, options?: NavigateOptions) => void;
  bankStats: QuestionBankStats | null;
  categories: CategoryMeta[];
  skdSessions: SessionSummary[];
  skbSessions: SessionSummary[];
  activeDetail: SessionDetailResponse | null;
  detailLoading: boolean;
  loading: boolean;
  creating: boolean;
  error: string | null;
  clearError: () => void;
  bankDefaultExamType: ExamType;
  setBankDefaultExamType: (type: ExamType) => void;
  preferredSetupMode: SessionMode;
  setPreferredSetupMode: (mode: SessionMode) => void;
  refreshAll: () => Promise<void>;
  refreshSessionsByType: (examType: ExamType) => Promise<void>;
  startSkdSimulation: (payload: CreateSkdSessionPayload) => Promise<void>;
  startSkbSimulation: (payload: CreateSkbSessionPayload) => Promise<void>;
  openSessionById: (session: SessionSummary) => Promise<void>;
  removeSession: (session: SessionSummary) => Promise<void>;
  handleExamSubmitted: (completed: SessionDetailResponse) => Promise<void>;
}

const ExamContext = createContext<ExamContextValue | null>(null);

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<AppRoute>(() =>
    parseRoute(window.location.pathname)
  );
  const [bankStats, setBankStats] = useState<QuestionBankStats | null>(null);
  const [categories, setCategories] = useState<CategoryMeta[]>([]);
  const [skdSessions, setSkdSessions] = useState<SessionSummary[]>([]);
  const [skbSessions, setSkbSessions] = useState<SessionSummary[]>([]);
  const [activeDetail, setActiveDetail] = useState<SessionDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bankDefaultExamType, setBankDefaultExamType] = useState<ExamType>('SKD');
  const [preferredSetupMode, setPreferredSetupMode] = useState<SessionMode>('REAL');

  const navigate = useCallback((path: string, options?: NavigateOptions) => {
    if (options?.bankExamType) {
      setBankDefaultExamType(options.bankExamType);
    }
    if (options?.setupMode) {
      setPreferredSetupMode(options.setupMode);
    }
    const nextRoute = parseRoute(path);
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setRoute(nextRoute);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setRoute(parseRoute(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const refreshSessionsByType = useCallback(async (examType: ExamType) => {
    try {
      const res = await fetchSessions(examType);
      if (examType === 'SKD') setSkdSessions(res.sessions);
      else setSkbSessions(res.sessions);
    } catch {
      // Preserve existing session lists on transient failure
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      const [healthRes, skdRes, skbRes] = await Promise.all([
        fetchHealth(),
        fetchSessions('SKD'),
        fetchSessions('SKB'),
      ]);
      setBankStats(healthRes.bankStats);
      setCategories(healthRes.categories);
      setSkdSessions(skdRes.sessions);
      setSkbSessions(skbRes.sessions);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Gagal memuat data aplikasi dari server.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);

  // Synchronize activeDetail if URL points directly to /exam/:id or /result/:id
  useEffect(() => {
    if (route.kind !== 'exam' && route.kind !== 'result') return;
    if (activeDetail && activeDetail.session.id === route.sessionId) {
      if (route.kind === 'exam' && activeDetail.session.status === 'COMPLETED') {
        navigate(`/result/${route.sessionId}`);
      }
      return;
    }

    let cancelled = false;
    setDetailLoading(true);
    fetchSessionDetail(route.sessionId)
      .then((detail) => {
        if (cancelled) return;
        setActiveDetail(detail);
        if (route.kind === 'exam' && detail.session.status === 'COMPLETED') {
          navigate(`/result/${route.sessionId}`);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Sesi ujian tidak ditemukan.');
        navigate('/');
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [route, activeDetail, navigate]);

  const startSkdSimulation = useCallback(
    async (payload: CreateSkdSessionPayload) => {
      if (creating) return;
      setCreating(true);
      setError(null);
      try {
        const detail = await createSkdSession(payload);
        setActiveDetail(detail);
        await refreshSessionsByType('SKD');
        navigate(`/exam/${detail.session.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal membuat sesi ujian SKD.');
      } finally {
        setCreating(false);
      }
    },
    [creating, navigate, refreshSessionsByType]
  );

  const startSkbSimulation = useCallback(
    async (payload: CreateSkbSessionPayload) => {
      if (creating) return;
      setCreating(true);
      setError(null);
      try {
        const detail = await createSkbSession(payload);
        setActiveDetail(detail);
        await refreshSessionsByType('SKB');
        navigate(`/exam/${detail.session.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal membuat sesi ujian SKB.');
      } finally {
        setCreating(false);
      }
    },
    [creating, navigate, refreshSessionsByType]
  );

  const openSessionById = useCallback(
    async (session: SessionSummary) => {
      setError(null);
      try {
        const detail = await fetchSessionDetail(session.id);
        setActiveDetail(detail);
        if (detail.session.status === 'IN_PROGRESS') {
          navigate(`/exam/${detail.session.id}`);
        } else {
          navigate(`/result/${detail.session.id}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal membuka detail sesi.');
      }
    },
    [navigate]
  );

  const removeSession = useCallback(async (session: SessionSummary) => {
    try {
      await deleteSession(session.id);
      if (session.exam_type === 'SKD') {
        setSkdSessions((prev) => prev.filter((s) => s.id !== session.id));
      } else {
        setSkbSessions((prev) => prev.filter((s) => s.id !== session.id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus sesi ujian.');
    }
  }, []);

  const handleExamSubmitted = useCallback(
    async (completed: SessionDetailResponse) => {
      setActiveDetail(completed);
      await refreshSessionsByType(completed.session.exam_type);
      navigate(`/result/${completed.session.id}`);
    },
    [navigate, refreshSessionsByType]
  );

  const value = useMemo<ExamContextValue>(
    () => ({
      route,
      navigate,
      bankStats,
      categories,
      skdSessions,
      skbSessions,
      activeDetail,
      detailLoading,
      loading,
      creating,
      error,
      clearError: () => setError(null),
      bankDefaultExamType,
      setBankDefaultExamType,
      preferredSetupMode,
      setPreferredSetupMode,
      refreshAll,
      refreshSessionsByType,
      startSkdSimulation,
      startSkbSimulation,
      openSessionById,
      removeSession,
      handleExamSubmitted,
    }),
    [
      route,
      navigate,
      bankStats,
      categories,
      skdSessions,
      skbSessions,
      activeDetail,
      detailLoading,
      loading,
      creating,
      error,
      bankDefaultExamType,
      preferredSetupMode,
      refreshAll,
      refreshSessionsByType,
      startSkdSimulation,
      startSkbSimulation,
      openSessionById,
      removeSession,
      handleExamSubmitted,
    ]
  );

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
};

export function useExamContext(): ExamContextValue {
  const ctx = useContext(ExamContext);
  if (!ctx) {
    throw new Error('useExamContext must be used inside ExamProvider');
  }
  return ctx;
}
