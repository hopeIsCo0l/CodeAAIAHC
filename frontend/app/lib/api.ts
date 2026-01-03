const API_BASE = typeof window !== 'undefined'
  ? (import.meta.env.VITE_API_URL ?? 'http://localhost:3000')
  : (process.env.VITE_API_URL ?? 'http://localhost:3000');

type Options = RequestInit & { json?: unknown };

export async function apiFetch<T>(path: string, options: Options = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.json !== undefined) {
    headers.set('Content-Type', 'application/json');
  }
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers,
    body: options.json !== undefined ? JSON.stringify(options.json) : options.body,
  });

  if (!res.ok) {
    const message = await safeError(res);
    throw new Error(message || res.statusText);
  }

  return (await res.json()) as T;
}

async function safeError(res: Response) {
  try {
    const data = await res.json();
    return data?.message ?? data?.error ?? res.statusText;
  } catch (_) {
    return res.statusText;
  }
}

export function getApiBase() {
  return API_BASE;
}
