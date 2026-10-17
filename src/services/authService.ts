import type { AdminSession } from '../types';
import { requestJson } from './apiConfig';

const SESSION_KEY = 'silvassa_admin_session';
const TOKEN_KEY = 'silvassa_admin_token';

function readSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminSession;
    if (!parsed?.identifier || !parsed?.signedInAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeSession(session: AdminSession | null, token?: string): void {
  if (!session) {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    return;
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
}

export interface LoginInput {
  identifier: string;
  password: string;
}

export interface LoginResult {
  ok: boolean;
  error?: string;
  session?: AdminSession;
}

export const authService = {
  getSession(): AdminSession | null {
    return readSession();
  },

  isAuthenticated(): boolean {
    return readSession() !== null;
  },

  async login(input: LoginInput): Promise<LoginResult> {
    const identifier = input.identifier.trim();
    const password = input.password;

    if (!identifier) {
      return { ok: false, error: 'Enter your email or username.' };
    }
    if (identifier.includes('@')) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
      if (!emailOk) {
        return { ok: false, error: 'Enter a valid email address.' };
      }
    } else if (identifier.length < 3) {
      return { ok: false, error: 'Username must be at least 3 characters.' };
    }
    if (!password) {
      return { ok: false, error: 'Enter your password.' };
    }
    if (password.length < 8) {
      return { ok: false, error: 'Password must be at least 8 characters.' };
    }

    try {
      // Connect to FastAPI backend auth endpoint
      const res = await requestJson<{ access_token: string; token_type: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: identifier, password }),
      });

      const session: AdminSession = {
        identifier,
        token: res.access_token,
        signedInAt: new Date().toISOString(),
      };
      writeSession(session, res.access_token);
      return { ok: true, session };
    } catch (err) {
      // If backend reports invalid credentials, return clear message
      const msg = err instanceof Error ? err.message : 'Invalid credentials';
      return { ok: false, error: msg };
    }
  },

  logout(): void {
    writeSession(null);
  },
};
