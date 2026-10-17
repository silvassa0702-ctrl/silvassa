import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { assetUrl } from '../utils/assets';

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/admin/dashboard';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const validate = () => {
    const next: Record<string, string> = {};
    const id = identifier.trim();
    if (!id) next.identifier = 'Email or username is required.';
    else if (id.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id)) {
      next.identifier = 'Enter a valid email address.';
    }
    if (!password) next.password = 'Password is required.';
    else if (password.length < 8) next.password = 'Password must be at least 8 characters.';
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    const result = await login({ identifier, password });
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? 'Unable to sign in.');
      return;
    }
    navigate(from.startsWith('/admin') ? from : '/admin/dashboard', { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/" className="login-back">
          ← Back to website
        </Link>
        <img src={assetUrl('img/logo-text.png')} alt="Silvassa" className="login-logo" />
        <h1>Admin sign in</h1>
        <p className="login-sub">Manage products and confirmed customer enquiries.</p>

        <form className="login-form" onSubmit={onSubmit} noValidate>
          {error && (
            <div className="form-banner error" role="alert">
              {error}
            </div>
          )}

          <label className="form-label" htmlFor="admin-identifier">
            Email or username
          </label>
          <input
            id="admin-identifier"
            className={`form-input${fieldErrors.identifier ? ' invalid' : ''}`}
            type="text"
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={loading}
          />
          {fieldErrors.identifier && <p className="field-error">{fieldErrors.identifier}</p>}

          <label className="form-label" htmlFor="admin-password">
            Password
          </label>
          <div className="password-field">
            <input
              id="admin-password"
              className={`form-input${fieldErrors.password ? ' invalid' : ''}`}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="login-disclaimer">
          This creates a local admin session for UI demonstration only. It does not issue a JWT or
          verify credentials against a server. Real authentication will be added with the backend.
        </p>
      </div>
    </div>
  );
}
