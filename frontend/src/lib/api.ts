export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const configuredBaseUrl = (
    process.env.BACKEND_INTERNAL_URL ||
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    ''
  ).replace(/\/$/, '');

  // 1. Client-side in browser (same domain / link):
  if (typeof window !== 'undefined') {
    // If an explicit absolute URL is configured to bypass proxy:
    if (configuredBaseUrl && /^https?:\/\//i.test(configuredBaseUrl)) {
      return `${configuredBaseUrl}${cleanPath}`;
    }
    // Route via Next.js same-origin rewrite proxy (/api/* -> backend)
    return `/api${cleanPath}`;
  }

  // 2. Server-side (during SSR or Next.js build):
  if (configuredBaseUrl) {
    return `${configuredBaseUrl}${cleanPath}`;
  }

  return `http://127.0.0.1:3001${cleanPath}`;
}

export function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('token');
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }
  if (init.body && !headers.has('Content-Type') && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  return fetch(getApiUrl(path), { ...init, headers }).then((res) => {
    if (res.status === 401 && typeof window !== 'undefined') {
      const isAuthRoute = path.includes('/auth/login') || path.includes('/auth/register');
      if (!isAuthRoute && window.location.pathname.startsWith('/dashboard')) {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user');
        window.location.href = '/login?expired=1';
      }
    }
    return res;
  });
}
