export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  if (configuredBaseUrl) return `${configuredBaseUrl}${cleanPath}`;
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname || 'localhost';
    const protocol = window.location.protocol || 'http:';
    return `${protocol}//${hostname}:3001${cleanPath}`;
  }
  return `http://localhost:3001${cleanPath}`;
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
