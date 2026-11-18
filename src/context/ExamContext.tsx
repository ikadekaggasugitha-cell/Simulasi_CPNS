import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {
  AuthUser,
  CategoryMeta,
  CreateSkbSessionPayload,
  CreateSkdSessionPayload,
  ExamType,
  LoginPayload,
  QuestionBankStats,
  RegisterPayload,
  SessionDetailResponse,
  SessionMode,
  SessionSummary,
} from '../shared/types';
import {
  ApiError,
  createSkbSession,
  createSkdSession,
  deleteSession,
  fetchCurrentUser,
  fetchHealth,
  fetchSessionDetail,
  fetchSessions,
  loginAccount,
  logoutAccount,
  registerAccount,
} from '../utils/api';

export type AppRoute =
  | { kind: 'login' }
  | { kind: 'register' }
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
  if (clean === '/login') return { kind: 'login' };
  if (clean === '/register') return { kind: 'register' };
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

export function isPublicAuthRoute(route: AppRoute): boolean {
  return route.kind === 'login' || route.kind === 'register';
}

export function routeToPath(route: AppRoute): string {
  switch (route.kind) {
    case 'login':
      return '/login';
    case 'register':
      return '/register';
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
  preserveError?: boolean;
  replace?: boolean;
}

interface ExamContextValue {
  route: AppRoute;
  navigate: (path: string, options?: NavigateOptions) => void;
  currentUser: AuthUser | null;
  authChecked: boolean;
  authSubmitting: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
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
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);

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

  const clearError = useCallback(() => setError(null), []);

  const navigate = useCallback((path: string, options?: NavigateOptions) => {
    if (options?.bankExamType) {
      setBankDefaultExamType(options.bankExamType);
    }
    if (options?.setupMode) {
      setPreferredSetupMode(options.setupMode);
    }
    const nextRoute = parseRoute(path);
    if (window.location.pathname !== path) {
      if (options?.replace) {
        window.history.replaceState({}, '', path);
      } else {
        window.history.pushState({}, '', path);
      }
    }
    setRoute(nextRoute);
    if (!options?.preserveError) {
      setError(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setRoute(parseRoute(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleUnauthorized = useCallback(() => {
    setCurrentUser(null);
    setSkdSessions([]);
    setSkbSessions([]);
    setActiveDetail(null);
    if (!isPublicAuthRoute(parseRoute(window.location.pathname))) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const loadProtectedData = useCallback(async () => {
    setLoading(true);
    try {
      const [skdRes, skbRes] = await Promise.all([
        fetchSessions('SKD'),
        fetchSessions('SKB'),
      ]);
      setSkdSessions(skdRes.sessions);
      setSkbSessions(skbRes.sessions);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleUnauthorized();
        return;
      }
      setError(
        err instanceof Error ? err.message : 'Gagal memuat riwayat sesi pengguna.'
      );
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized]);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      const healthRes = await fetchHealth();
      setBankStats(healthRes.bankStats);
      setCategories(healthRes.categories);
    } catch {
      // ignore health probe error when offline
    }

    try {
      const meRes = await fetchCurrentUser();
      setCurrentUser(meRes.user);
      setAuthChecked(true);
      await loadProtectedData();
    } catch (err) {
      setCurrentUser(null);
      setSkdSessions([]);
      setSkbSessions([]);
      setActiveDetail(null);
      setAuthChecked(true);
      setLoading(false);
      if (!(err instanceof ApiError && err.status === 401)) {
        // Non-401 startup error stays recoverable
      }
    }
  }, [loadProtectedData]);

  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);

  // Route Guard: Protect all app routes except /login and /register
  useEffect(() => {
    if (!authChecked) return;
    if (!currentUser && !isPublicAuthRoute(route)) {
      navigate('/login', { replace: true, preserveError: true });
    } else if (currentUser && isPublicAuthRoute(route)) {
      navigate('/', { replace: true });
    }
  }, [authChecked, currentUser, route, navigate]);

  const refreshSessionsByType = useCallback(
    async (examType: ExamType) => {
      if (!currentUser) return;
      try {
        const res = await fetchSessions(examType);
        if (examType === 'SKD') setSkdSessions(res.sessions);
        else setSkbSessions(res.sessions);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          handleUnauthorized();
        }
      }
    },
    [currentUser, handleUnauthorized]
  );

  const login = useCallback(
    async (payload: LoginPayload) => {
      if (authSubmitting) return;
      setAuthSubmitting(true);
      setError(null);
      try {
        const res = await loginAccount(payload);
        setCurrentUser(res.user);
        setActiveDetail(null);
        await loadProtectedData();
        navigate('/', { replace: true });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal masuk ke akun.');
      } finally {
        setAuthSubmitting(false);
      }
    },
    [authSubmitting, loadProtectedData, navigate]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      if (authSubmitting) return;
      setAuthSubmitting(true);
      setError(null);
      try {
        const res = await registerAccount(payload);
        setCurrentUser(res.user);
        setActiveDetail(null);
        await loadProtectedData();
        navigate('/', { replace: true });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal mendaftarkan akun.');
      } finally {
        setAuthSubmitting(false);
      }
    },
    [authSubmitting, loadProtectedData, navigate]
  );

  const logout = useCallback(async () => {
    try {
      await logoutAccount();
    } catch {
      // Clear client state even if network logout fails
    }
    setCurrentUser(null);
    setSkdSessions([]);
    setSkbSessions([]);
    setActiveDetail(null);
    setError(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  // Synchronize activeDetail if URL points directly to /exam/:id or /result/:id
  useEffect(() => {
    if (!authChecked || !currentUser) return;
    if (route.kind !== 'exam' && route.kind !== 'result') return;
    if (activeDetail && activeDetail.session.id === route.sessionId) {
      if (route.kind === 'exam' && activeDetail.session.status === 'COMPLETED') {
        navigate(`/result/${route.sessionId}`, { replace: true });
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
          navigate(`/result/${route.sessionId}`, { replace: true });
        }
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          handleUnauthorized();
          return;
        }
        setError(err instanceof Error ? err.message : 'Sesi ujian tidak ditemukan.');
        navigate('/', { replace: true, preserveError: true });
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authChecked, currentUser, route, activeDetail, navigate, handleUnauthorized]);

  const startSkdSimulation = useCallback(
    async (payload: CreateSkdSessionPayload) => {
      if (creating || !currentUser) return;
      setCreating(true);
      setError(null);
      try {
        const detail = await createSkdSession(payload);
        setActiveDetail(detail);
        await refreshSessionsByType('SKD');
        navigate(`/exam/${detail.session.id}`);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          handleUnauthorized();
          return;
        }
        setError(err instanceof Error ? err.message : 'Gagal membuat sesi ujian SKD.');
      } finally {
        setCreating(false);
      }
    },
    [creating, currentUser, navigate, refreshSessionsByType, handleUnauthorized]
  );

  const startSkbSimulation = useCallback(
    async (payload: CreateSkbSessionPayload) => {
      if (creating || !currentUser) return;
      setCreating(true);
      setError(null);
      try {
        const detail = await createSkbSession(payload);
        setActiveDetail(detail);
        await refreshSessionsByType('SKB');
        navigate(`/exam/${detail.session.id}`);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          handleUnauthorized();
          return;
        }
        setError(err instanceof Error ? err.message : 'Gagal membuat sesi ujian SKB.');
      } finally {
        setCreating(false);
      }
    },
    [creating, currentUser, navigate, refreshSessionsByType, handleUnauthorized]
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
        if (err instanceof ApiError && err.status === 401) {
          handleUnauthorized();
          return;
        }
        setError(err instanceof Error ? err.message : 'Gagal membuka detail sesi.');
      }
    },
    [navigate, handleUnauthorized]
  );

  const removeSession = useCallback(
    async (session: SessionSummary) => {
      try {
        await deleteSession(session.id);
        if (session.exam_type === 'SKD') {
          setSkdSessions((prev) => prev.filter((s) => s.id !== session.id));
        } else {
          setSkbSessions((prev) => prev.filter((s) => s.id !== session.id));
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          handleUnauthorized();
          return;
        }
        setError(err instanceof Error ? err.message : 'Gagal menghapus sesi ujian.');
      }
    },
    [handleUnauthorized]
  );

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
      currentUser,
      authChecked,
      authSubmitting,
      login,
      register,
      logout,
      bankStats,
      categories,
      skdSessions,
      skbSessions,
      activeDetail,
      detailLoading,
      loading,
      creating,
      error,
      clearError,
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
      currentUser,
      authChecked,
      authSubmitting,
      login,
      register,
      logout,
      bankStats,
      categories,
      skdSessions,
      skbSessions,
      activeDetail,
      detailLoading,
      loading,
      creating,
      error,
      clearError,
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
