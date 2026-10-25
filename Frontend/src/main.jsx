import './styles.css';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { state, SESSION_KEY, request, dateLabel, getSession, setRenderHandler } from './core.js';
import { Icon } from './components.jsx';
import DashboardPage, { loadDashboard } from './pages/dashboard.jsx';
import UsersPage, { loadUsers } from './pages/users.jsx';
import LoansPage from './pages/loans.jsx';
import ComputerLabPage, { loadComputerLab } from './pages/computer-lab.jsx';
import AccessPage from './pages/access.jsx';
import ReportsPage from './pages/reports.jsx';

const navigation = [
  ['dashboard', 'Resumen', 'dashboard'],
  ['users', 'Usuarios', 'users'],
  ['loans', 'Préstamos', 'loan'],
  ['computer-lab', 'Sala informática', 'computer'],
  ['access', 'Accesos', 'access'],
  ['reports', 'Reportes', 'report']
];

const pageComponents = {
  dashboard: DashboardPage,
  users: UsersPage,
  loans: LoansPage,
  'computer-lab': ComputerLabPage,
  access: AccessPage,
  reports: ReportsPage
};

const pageLoaders = {
  dashboard: loadDashboard,
  users: loadUsers,
  'computer-lab': loadComputerLab
};

function Login({ onLogin, error }) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmitting(true);
    try {
      await onLogin({
        email: String(formData.get('email')).trim(),
        password: String(formData.get('password'))
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-layout">
      <section className="login-visual" aria-label="Biblioteca Ciudad Quesada">
        <div className="visual-content">
          <h1>Un espacio para<br />conocer nuevas<br /><em>historias.</em></h1>
          <div className="visual-note"><Icon name="book" /><span>Biblioteca Pública de Ciudad Quesada</span></div>
        </div>
        <div className="visual-decoration decoration-one" />
        <div className="visual-decoration decoration-two" />
      </section>
      <section className="login-panel">
        <div className="login-card">
          <h2>Bienvenido de nuevo</h2>
          {error && <div className="alert alert-error" role="alert"><Icon name="alert" /><span>{error}</span></div>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Correo electrónico</label>
            <div className="input-wrap"><input id="email" name="email" type="email" autoComplete="username" required /></div>
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrap"><input id="password" name="password" type="password" autoComplete="current-password" required /></div>
            <button className="button button-primary login-submit" type="submit" disabled={submitting}>
              <span>{submitting ? 'Validando acceso…' : 'Iniciar sesión'}</span><Icon name="arrow" />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function Brand() {
  return (
    <div className="brand-lockup">
      <span className="brand-mark"><Icon name="book" /></span>
      <span><strong>Biblioteca</strong><small>Ciudad Quesada</small></span>
    </div>
  );
}

function AdminShell({ onLogout, revision }) {
  const name = state.user?.name || 'Administrador';
  const initials = `${state.user?.name?.[0] || 'A'}${state.user?.lastName?.[0] || ''}`.toUpperCase();
  const Page = pageComponents[state.page] || DashboardPage;

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <a className="sidebar-brand" href="#/dashboard" aria-label="Ir al resumen">
          <span className="brand-mark"><Icon name="book" /></span>
          <span><strong>Biblioteca</strong><small>Ciudad Quesada</small></span>
        </a>
        <div className="sidebar-divider" />
        <div className="nav-caption">MENÚ PRINCIPAL</div>
        <nav className="side-nav" aria-label="Navegación principal">
          {navigation.map(([page, label, glyph]) => (
            <a className={`nav-item ${state.page === page ? 'is-active' : ''}`} href={`#/${page}`} key={page}>
              <Icon name={glyph} /><span>{label}</span>
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-item logout-button" onClick={onLogout} type="button"><Icon name="logout" /><span>Cerrar sesión</span></button>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div className="topbar-greeting"><span>{dateLabel()}</span><strong>Buenos días, {name}</strong></div>
          <div className="topbar-user"><span className="user-role">Administrador</span><span className="avatar" aria-label={name}>{initials}</span></div>
        </header>
        <section className="page-content"><Page key={state.page} revision={revision} /></section>
      </main>
    </div>
  );
}

function App() {
  const [revision, setRevision] = useState(0);
  const [loginError, setLoginError] = useState('');

  function rerender() {
    setRevision(value => value + 1);
  }

  async function navigateTo(requestedPage) {
    const page = pageComponents[requestedPage] ? requestedPage : 'dashboard';
    state.page = page;
    state.error = '';
    state.notice = '';
    state.loading = true;
    rerender();
    try {
      await pageLoaders[page]?.();
    } catch (error) {
      state.error = error.message;
    } finally {
      state.loading = false;
      rerender();
    }
  }

  async function login(credentials) {
    setLoginError('');
    try {
      const result = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      if (!result.token || !result.user || result.user.role !== 'admin') {
        throw new Error('La respuesta del servidor no contiene una sesión administrativa válida.');
      }
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token: result.token, user: result.user }));
      state.user = result.user;
      window.history.replaceState(null, '', '#/dashboard');
      await navigateTo('dashboard');
    } catch (error) {
      setLoginError(error.message);
    }
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    state.user = null;
    state.page = 'dashboard';
    state.error = '';
    state.notice = '';
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    rerender();
  }

  useEffect(() => {
    setRenderHandler(rerender);

    const session = getSession();
    if (!session?.token || !session?.user || session.user.role !== 'admin') {
      sessionStorage.removeItem(SESSION_KEY);
      state.user = null;
      return;
    }
    state.user = session.user;

    const handleHashChange = () => {
      if (state.user) navigateTo(window.location.hash.replace(/^#\/?/, '') || 'dashboard');
    };
    window.addEventListener('hashchange', handleHashChange);
    navigateTo(window.location.hash.replace(/^#\/?/, '') || 'dashboard');
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return state.user
    ? <AdminShell onLogout={logout} revision={revision} />
    : <Login onLogin={login} error={loginError || state.error} />;
}

createRoot(document.querySelector('#app')).render(<App />);
