export interface ApiErrorPayload {
  detail?: string;
  message?: string;
  title?: string;
  code?: string;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly payload?: unknown;

  constructor(
    message: string,
    status: number,
    code?: string,
    payload?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.payload = payload;
  }
}

function getApiBaseUrl(): string {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  return (configuredUrl || 'http://localhost:8080').replace(/\/+$/, '');
}

function getErrorMessage(payload: unknown, status: number): string {
  if (payload && typeof payload === 'object') {
    const problem = payload as ApiErrorPayload;
    return problem.detail || problem.message || problem.title || `Error HTTP ${status}`;
  }

  return `Error HTTP ${status}`;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');

  if (options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const response = await fetch(`${getApiBaseUrl()}${normalizedPath}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    if (!response.ok) {
      throw new ApiError(`Error HTTP ${response.status}`, response.status);
    }
    return undefined as T;
  }

  const responseText = await response.text();
  let payload: unknown;
  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch {
      payload = responseText;
    }
  }

  if (!response.ok) {
    const errorPayload = typeof payload === 'string' ? undefined : payload;
    const code = errorPayload && typeof errorPayload === 'object'
      ? (errorPayload as ApiErrorPayload).code
      : undefined;
    throw new ApiError(
      getErrorMessage(errorPayload, response.status),
      response.status,
      code,
      payload,
    );
  }

  return payload as T;
}
