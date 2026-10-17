/**
 * Central API configuration for connecting frontend to FastAPI backend.
 */
export const apiConfig = {
  baseUrl:
    (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ||
    'http://localhost:8000/api',
} as const;

export function isBackendConfigured(): boolean {
  return Boolean(apiConfig.baseUrl && apiConfig.baseUrl.length > 0);
}

export function getAdminToken(): string | null {
  try {
    return sessionStorage.getItem('silvassa_admin_token');
  } catch {
    return null;
  }
}

/**
 * Wrapper for JSON requests with automatic JWT bearer auth.
 */
export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init?.headers as Record<string, string> | undefined),
  };

  const response = await fetch(`${apiConfig.baseUrl}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let errorDetail = `Request failed (${response.status})`;
    try {
      const errJson = await response.json();
      if (errJson && errJson.detail) {
        errorDetail = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
      } else if (errJson && errJson.message) {
        errorDetail = errJson.message;
      }
    } catch {
      // ignore
    }
    throw new Error(errorDetail);
  }

  return response.json() as Promise<T>;
}

/**
 * Upload multipart form data (such as product photos to S3).
 */
export async function uploadFormData<T>(path: string, formData: FormData): Promise<T> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${apiConfig.baseUrl}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    let errorDetail = `Upload failed (${response.status})`;
    try {
      const errJson = await response.json();
      if (errJson?.detail) {
        errorDetail = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
      }
    } catch {
      // ignore
    }
    throw new Error(errorDetail);
  }

  return response.json() as Promise<T>;
}
