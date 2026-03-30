/** Relative paths are prefixed with `NEXT_PUBLIC_API_URL` when the bundler inlines it from the consuming app’s env (not from `packages/openapi`). If missing, URLs stay same-origin. */
function resolveUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const base =
    typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')
      : '';
  return `${base}${path}`;
}

export const customClient = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(resolveUrl(url), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
};
