import type {
  CategoryMeta,
  CreateSkbSessionPayload,
  CreateSkdSessionPayload,
  ExamType,
  HintResponse,
  OptionKey,
  QuestionBankStats,
  QuestionRecord,
  SessionDetailResponse,
  SessionSummary,
} from '../shared/types';
import {
  localCreateSkbSession,
  localCreateSkdSession,
  localDeleteSession,
  localFetchAnswerHint,
  localFetchHealth,
  localFetchQuestionsBank,
  localFetchSessionDetail,
  localFetchSessions,
  localSaveSessionAnswer,
  localSubmitSession,
} from './localEngine';

let backendModePromise: Promise<'remote' | 'local'> | null = null;

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
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(
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
