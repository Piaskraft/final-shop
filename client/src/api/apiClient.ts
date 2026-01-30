// client/src/api/apiClient.ts
import { API_URL } from '../config/constants';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

// buduje bazę API tak, żeby NIE było /api/api
function buildApiBase(): string {
  const raw = (API_URL ?? '').trim();

  // jeśli API_URL pusty -> użyj względnego "/api"
  if (!raw) return '/api';

  // usuń końcowe slashe
  const base = raw.replace(/\/+$/, '');

  // jeśli już kończy się na /api, nie doklejaj drugi raz
  if (base.endsWith('/api')) return base;

  return `${base}/api`;
}

const API_BASE = buildApiBase();

async function request<T>(
  path: string,
  method: HttpMethod,
  body?: unknown,
  headers?: Record<string, string>,
): Promise<T> {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${API_BASE}${cleanPath}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(headers || {}),
      },
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    throw new ApiError('Network error (fetch failed)', 0, e);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  const data = isJson
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const msg =
      (isJson && (data as any)?.message) ||
      (isJson && (data as any)?.error) ||
      `Request failed (${res.status})`;

    throw new ApiError(String(msg), res.status, data);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, 'GET'),
  post: <T>(path: string, body: unknown) => request<T>(path, 'POST', body),
  patch: <T>(path: string, body: unknown) => request<T>(path, 'PATCH', body),
  put: <T>(path: string, body: unknown) => request<T>(path, 'PUT', body),
  del: <T>(path: string) => request<T>(path, 'DELETE'),
};

export { ApiError };
