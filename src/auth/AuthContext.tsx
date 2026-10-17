import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { authService, type LoginInput } from '../services/authService';
import type { AdminSession } from '../types';

interface AuthContextValue {
  session: AdminSession | null;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(() => authService.getSession());

  const login = useCallback(async (input: LoginInput) => {
    const result = await authService.login(input);
    if (result.ok && result.session) {
      setSession(result.session);
      return { ok: true };
    }
    return { ok: false, error: result.error ?? 'Unable to sign in.' };
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: session !== null,
      login,
      logout,
    }),
    [session, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
