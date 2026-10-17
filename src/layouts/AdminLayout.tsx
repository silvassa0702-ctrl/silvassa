import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Icon from '../components/Icon';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'house-fill' as const },
  { to: '/admin/products', label: 'Products', icon: 'grid-fill' as const },
  { to: '/admin/enquiries', label: 'Orders & Enquiries', icon: 'envelope-fill' as const },
];

export default function AdminLayout() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-kicker">Silvassa</span>
          <strong>Admin</strong>
        </div>
        <nav className="admin-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
            >
              <Icon name={link.icon} />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="admin-nav-link admin-logout" onClick={handleLogout}>
          <Icon name="arrow-left" />
          Logout
        </button>
      </aside>
      <div className="admin-main">
        <header className="admin-header">
          <div>
            <p className="admin-header-label">Signed in as</p>
            <p className="admin-header-user">{session?.identifier}</p>
          </div>
          <p className="admin-header-note">Frontend session only — JWT auth is not implemented yet.</p>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
