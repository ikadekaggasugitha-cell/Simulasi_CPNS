import type {
  AuthResponse,
  AuthUser,
  CategoryMeta,
  CreateSkbSessionPayload,
  CreateSkdSessionPayload,
  ExamType,
  HintResponse,
  LoginPayload,
  OptionKey,
  QuestionBankStats,
  QuestionRecord,
  RegisterPayload,
  SessionDetailResponse,
  SessionSummary,
} from '../shared/types';
import { ApiError } from './errors';
import {
  localCreateSkbSession,
  localCreateSkdSession,
  localDeleteSession,
  localFetchAnswerHint,
  localFetchCurrentUser,
  localFetchHealth,
  localFetchQuestionsBank,
  localFetchSessionDetail,
  localFetchSessions,
  localLoginUser,
  localLogoutUser,
  localRegisterUser,
  localSaveSessionAnswer,
  localSubmitSession,
} from './localEngine';

export { ApiError };

const AUTH_TOKEN_KEY = 'cat_asn_jwt_token_v1';

let backendModePromise: Promise<'remote' | 'local'> | null = null;

export function getStoredToken(): string | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    if (token) {
      window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

async function detectBackendMode(): Promise<'remote' | 'local'> {
  if (import.meta.env.VITE_STORAGE_MODE === 'local') {
    return 'local';
  }
  if (!backendModePromise) {
    backendModePromise = (async () => {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 1800);
      try {
        const res = await fetch('/api/health', {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });
        const contentType = res.headers.get('content-type') || '';
        if (!res.ok || !contentType.includes('application/json')) {
          return 'local';
        }
        const json = (await res.json()) as { ok?: boolean };
        return json?.ok === true ? 'remote' : 'local';
      } catch {
        return 'local';
      } finally {
        window.clearTimeout(timeout);
      }
    })();
  }
  return backendModePromise;
}

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (options?.headers && typeof options.headers === 'object' && !Array.isArray(options.headers)) {
    Object.assign(headers, options.headers);
  }

  const res = await fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    if (res.status === 401) {
      setStoredToken(null);
    }
    throw new ApiError(
      res.status,
      typeof errBody?.error === 'string'
        ? errBody.error
        : `Permintaan gagal (${res.status})`
    );
  }

  return res.json() as Promise<T>;
}

export async function fetchHealth(): Promise<{
  ok: boolean;
  bankStats: QuestionBankStats;
  categories: CategoryMeta[];
}> {
  if ((await detectBackendMode()) === 'local') {
    return localFetchHealth();
  }
  return requestJson('/api/health');
}

export async function registerAccount(payload: RegisterPayload): Promise<AuthResponse> {
  if ((await detectBackendMode()) === 'local') {
    const res = await localRegisterUser(payload);
    setStoredToken(res.token);
    return res;
  }
  const res = await requestJson<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  setStoredToken(res.token);
  return res;
}

export async function loginAccount(payload: LoginPayload): Promise<AuthResponse> {
  if ((await detectBackendMode()) === 'local') {
    const res = await localLoginUser(payload);
    setStoredToken(res.token);
    return res;
  }
  const res = await requestJson<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  setStoredToken(res.token);
  return res;
}

export async function logoutAccount(): Promise<{ ok: boolean }> {
  setStoredToken(null);
  if ((await detectBackendMode()) === 'local') {
    return localLogoutUser();
  }
  return requestJson('/api/auth/logout', { method: 'POST' });
}

export async function fetchCurrentUser(): Promise<{ user: AuthUser }> {
  if ((await detectBackendMode()) === 'local') {
    return localFetchCurrentUser();
  }
  return requestJson('/api/auth/me');
}

export async function fetchSessions(
  examType?: ExamType
): Promise<{ sessions: SessionSummary[] }> {
  if ((await detectBackendMode()) === 'local') {
    return localFetchSessions(examType);
  }
  const qs = examType ? `?examType=${examType}` : '';
  return requestJson(`/api/sessions${qs}`);
}

export async function createSkdSession(
  payload: CreateSkdSessionPayload
): Promise<SessionDetailResponse> {
  if ((await detectBackendMode()) === 'local') {
    return localCreateSkdSession(payload);
  }
  return requestJson('/api/skd/sessions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createSkbSession(
  payload: CreateSkbSessionPayload
): Promise<SessionDetailResponse> {
  if ((await detectBackendMode()) === 'local') {
    return localCreateSkbSession(payload);
  }
  return requestJson('/api/skb/sessions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchSessionDetail(
  sessionId: number
): Promise<SessionDetailResponse> {
  if ((await detectBackendMode()) === 'local') {
    return localFetchSessionDetail(sessionId);
  }
  return requestJson(`/api/sessions/${sessionId}`);
}

export async function fetchAnswerHint(
  sessionId: number,
  answerId: number
): Promise<HintResponse> {
  if ((await detectBackendMode()) === 'local') {
    return localFetchAnswerHint(sessionId, answerId);
  }
  return requestJson(`/api/sessions/${sessionId}/answers/${answerId}/hint`);
}

export async function saveSessionAnswer(
  sessionId: number,
  payload: {
    answerId?: number;
    selectedLabel?: OptionKey | null;
    ditandai?: boolean;
    elapsedSeconds?: number;
  }
): Promise<{ ok: boolean }> {
  if ((await detectBackendMode()) === 'local') {
    return localSaveSessionAnswer(sessionId, payload);
  }
  return requestJson(`/api/sessions/${sessionId}/answer`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function submitSession(
  sessionId: number,
  elapsedSeconds?: number
): Promise<SessionDetailResponse> {
  if ((await detectBackendMode()) === 'local') {
    return localSubmitSession(sessionId, elapsedSeconds);
  }
  return requestJson(`/api/sessions/${sessionId}/submit`, {
    method: 'POST',
    body: JSON.stringify({ elapsedSeconds }),
  });
}

export async function deleteSession(sessionId: number): Promise<{ ok: boolean }> {
  if ((await detectBackendMode()) === 'local') {
    return localDeleteSession(sessionId);
  }
  return requestJson(`/api/sessions/${sessionId}`, {
    method: 'DELETE',
  });
}

export async function fetchQuestionsBank(params?: {
  examType?: ExamType;
  kategori?: string;
  q?: string;
}): Promise<{ total: number; questions: QuestionRecord[] }> {
  if ((await detectBackendMode()) === 'local') {
    return localFetchQuestionsBank(params);
  }
  const search = new URLSearchParams();
  if (params?.examType) {
    search.set('examType', params.examType);
  }
  if (params?.kategori && params.kategori !== 'ALL') {
    search.set('kategori', params.kategori);
  }
  if (params?.q) {
    search.set('q', params.q);
  }
  const qs = search.toString();
  return requestJson(`/api/questions${qs ? `?${qs}` : ''}`);
}
