/**
 * Resolves product image paths against local Vite base URL, S3 backend media routes,
 * or direct URLs.
 */
export const assetUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  if (path.startsWith('/api') || path.startsWith('/uploads')) {
    const backendRoot = (import.meta.env.VITE_API_BASE_URL as string | undefined || 'http://localhost:8000/api')
      .replace(/\/api\/?$/, '');
    return `${backendRoot}${path}`;
  }
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
};
