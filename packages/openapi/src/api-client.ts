function normalizeBaseUrl(baseUrl: string | undefined): string {
  return baseUrl ? baseUrl.replace(/\/$/, '') : '';
}

/** Relative paths are prefixed with the configured base URL. If missing, URLs stay same-origin. */
export function resolveUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${normalizeBaseUrl(apiConfig?.baseUrl)}${path}`;
}

/** Thrown when `fetch` returns a non-OK status; use `status` for branching (e.g. 409 conflict). */
export class ApiHttpError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message?: string, body?: unknown) {
    super(message ?? `Request failed: ${status}`);
    this.name = 'ApiHttpError';
    this.status = status;
    this.body = body;
  }
}

const AUTHLESS_PATHS = new Set([
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/admin/login',
  '/api/auth/session',
  '/api/auth/admin/session',
  '/api/auth/refresh',
  '/api/auth/admin/refresh',
  '/api/auth/logout',
  '/api/auth/admin/logout',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
]);

function getPathname(url: string): string {
  return url.startsWith('http') ? new URL(url).pathname : url;
}

function isAuthlessPath(url: string): boolean {
  return AUTHLESS_PATHS.has(getPathname(url));
}

export type ApiResponse<TData> = {
  data: TData;
  status: number;
  headers: Headers;
};

export type ApiClientConfig = {
  baseUrl?: string;
  getAccessToken?: () => string | null;
  setAccessToken?: (_token: string | null) => void;
  refreshPath?: string;
  onSessionExpired?: () => void;
  onForbidden?: () => void;
};

let apiConfig: ApiClientConfig | null = null;

/** Call once from the app shell (e.g. after creating the auth store). */
export function configureApiClient(config: ApiClientConfig): void {
  apiConfig = config;
}

function isAbortError(e: unknown): boolean {
  return e instanceof DOMException && e.name === 'AbortError';
}

function createHeaders(url: string, init: RequestInit | undefined): Headers {
  const headers = new Headers(init?.headers);
  const method = init?.method?.toUpperCase() ?? 'GET';

  if (
    method !== 'GET' &&
    method !== 'HEAD' &&
    init?.body !== undefined &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  const token = apiConfig?.getAccessToken?.() ?? null;
  if (token && !isAuthlessPath(url)) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
}

async function parseJsonBody(res: Response): Promise<unknown | undefined> {
  return res.status === 204 ? undefined : ((await res.json()) as unknown);
}

function getErrorMessage(status: number, body: unknown): string {
  const message =
    body && typeof body === 'object' ? (body as { message?: unknown }).message : undefined;

  if (typeof message === 'string' && message.trim().length > 0) {
    return message;
  }

  if (Array.isArray(message)) {
    const firstMessage = message.find(
      (item): item is string => typeof item === 'string' && item.trim().length > 0,
    );
    if (firstMessage) {
      return firstMessage;
    }
  }

  return `Request failed: ${status}`;
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const refreshPath = apiConfig?.refreshPath ?? '/api/auth/refresh';
    const res = await fetch(resolveUrl(refreshPath), {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) {
      return false;
    }
    const data = (await res.json()) as { accessToken: string };
    apiConfig?.setAccessToken?.(data.accessToken);
    return true;
  } catch {
    return false;
  }
}

type InternalInit = RequestInit & { _retryAuth?: boolean };

export const customClient = async <T>(url: string, options?: InternalInit): Promise<T> => {
  const { _retryAuth, ...fetchOptions } = options ?? {};
  if (fetchOptions.signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  let res: Response;
  try {
    res = await fetch(resolveUrl(url), {
      ...fetchOptions,
      headers: createHeaders(url, fetchOptions),
      credentials: 'include',
    });
  } catch (e) {
    if (isAbortError(e)) {
      throw e;
    }
    throw e;
  }

  const canAttemptRefresh =
    res.status === 401 &&
    !_retryAuth &&
    apiConfig !== null &&
    !isAuthlessPath(url) &&
    !fetchOptions.signal?.aborted;

  if (canAttemptRefresh) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return customClient<T>(url, { ...options, _retryAuth: true });
    }
  }

  if (!res.ok) {
    const errorBody = await parseJsonBody(res);

    if (res.status === 401 && !isAuthlessPath(url)) {
      apiConfig?.setAccessToken?.(null);
      apiConfig?.onSessionExpired?.();
    }

    if (res.status === 403 && !isAuthlessPath(url)) {
      apiConfig?.onForbidden?.();
    }

    throw new ApiHttpError(res.status, getErrorMessage(res.status, errorBody), errorBody);
  }

  const data = await parseJsonBody(res);
  return { data, status: res.status, headers: res.headers } as T;
};
