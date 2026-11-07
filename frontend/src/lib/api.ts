export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // 1. Client-side in browser (public path):
  // When running in the browser:
  // If NEXT_PUBLIC_API_URL is explicitly configured (e.g. Render backend URL),
  // route directly to the backend. Otherwise route through /api/* proxy (Netlify rewrites).
  if (typeof window !== 'undefined') {
    const publicUrl = process.env.NEXT_PUBLIC_API_URL;
    if (publicUrl && !publicUrl.includes('localhost') && !publicUrl.includes('127.0.0.1')) {
      const base = publicUrl.replace(/\/$/, '');
      return `${base}${cleanPath.startsWith('/api') ? cleanPath : `/api${cleanPath}`}`;
    }
    return cleanPath.startsWith('/api') ? cleanPath : `/api${cleanPath}`;
  }

  // 2. Server-side (during SSR or Server runtime functions):
  // Uses the bound BACKEND_URL or NEXT_PUBLIC_API_URL.
  const backendBase = (
    process.env.BACKEND_URL ||
    process.env.BACKEND_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://127.0.0.1:3001'
  ).replace(/\/$/, '');

  const serverPath = cleanPath.startsWith('/api') ? cleanPath.substring(4) : cleanPath;
  return `${backendBase}${serverPath}`;
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
