export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // 1. Client-side in browser (public path):
  // When running in the browser on localhost, route to local backend (http://localhost:3001)
  // Otherwise default to the production backend URL unless overridden.
  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';
    const defaultUrl = isLocalhost
      ? 'http://localhost:3001'
      : 'https://manthusa-tvs.onrender.com';
    const publicUrl = process.env.NEXT_PUBLIC_API_URL || defaultUrl;
    const base = publicUrl.replace(/\/$/, '');
    return `${base}${cleanPath.startsWith('/api') ? cleanPath : `/api${cleanPath}`}`;
  }

  // 2. Server-side (during SSR or Server runtime functions):
  const backendBase = (
    process.env.BACKEND_URL ||
    process.env.BACKEND_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'https://manthusa-tvs.onrender.com'
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
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = '/login?expired=1';
      }
    }
    return res;
  });
}
