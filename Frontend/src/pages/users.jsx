import React, { useEffect, useRef, useState } from 'react';
import { state, request, renderApp } from '../core.js';
import { EmptyState, Icon, Notice, PageAlert, PageHeading, PersonCell, StatusPill } from '../components.jsx';

export async function loadUsers() {
  state.loading = true;
  state.error = '';
  try {
    const query = state.searchTerm ? `?search=${encodeURIComponent(state.searchTerm)}` : '';
    const result = await request(`/api/users${query}`);
    state.users = result.data || [];
  } catch (error) {
    state.error = error.message;
  } finally {
    state.loading = false;
  }
}

export default function UsersPage() {
  const modalRef = useRef(null);
  const [search, setSearch] = useState(state.searchTerm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const users = state.users.filter(user => user.role === 'user');

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (search.trim() === state.searchTerm) return;
      state.searchTerm = search.trim();
      await loadUsers();
      renderApp();
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  async function submitUser(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    if (values.age === '') delete values.age;
    setSaving(true);
    setFormError('');
    try {
      const result = await request('/api/users', { method: 'POST', body: JSON.stringify(values) });
      state.notice = `${result.message || 'Usuario registrado.'} Código asignado: ${result.data?.userCode || 'no disponible'}.`;
      state.searchTerm = '';
      setSearch('');
      modalRef.current?.close();
      await loadUsers();
      renderApp();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function refresh() {
    await loadUsers();
    renderApp();
  }

  return (
    <>
      <PageHeading actions={
        <button className="button button-primary" onClick={() => { setFormError(''); modalRef.current?.showModal(); }} type="button"><Icon name="plus" /><span>Nuevo usuario</span></button>
      }></PageHeading>
      <PageAlert message={state.error} onRetry={refresh} />
      <Notice message={state.notice} />
      <section className="panel data-panel">
        <div className="table-toolbar">
          <div><h2>Directorio de usuarios</h2><p>{users.length} visitantes{state.searchTerm ? ' encontrados' : ' registrados'}</p></div>
          <label className="search-box"><Icon name="search" /><input type="search" placeholder="Buscar por nombre, cédula o código" value={search} onChange={event => setSearch(event.target.value)} /></label>
        </div>
        {state.loading ? <div className="table-message">Cargando usuarios…</div> : users.length ? (
          <div className="table-scroll"><table>
            <thead><tr><th>USUARIO</th><th>CÉDULA</th><th>CÓDIGO</th><th>ESTADO</th></tr></thead>
            <tbody>{users.map(user => (
              <tr key={user._id}>
                <td><PersonCell name={`${user.name || ''} ${user.lastName || ''}`.trim()} detail={user.email || ''} /></td>
                <td>{user.cedula || '—'}</td><td><span className="code-tag">{user.userCode || '—'}</span></td>
                <td><StatusPill inactive={user.isActive === false}>{user.isActive === false ? 'Inactivo' : 'Activo'}</StatusPill></td>
              </tr>
            ))}</tbody>
          </table></div>
        ) : <EmptyState icon="users" title={state.searchTerm ? 'No encontramos coincidencias' : 'No hay usuarios registrados'}>
          {state.searchTerm ? 'Prueba con otro nombre, cédula o código.' : 'Los visitantes que registres aparecerán aquí.'}
        </EmptyState>}
      </section>
      <dialog className="modal" ref={modalRef}>
        <form className="modal-card" onSubmit={submitUser}>
          <div className="modal-heading"><div><div className="eyebrow">NUEVO REGISTRO</div><h2>Registrar usuario</h2></div>
            <button className="icon-button" onClick={() => modalRef.current?.close()} type="button" aria-label="Cerrar">×</button>
          </div>
          <p className="modal-description">Completa los datos del visitante. Su código de usuario se generará automáticamente.</p>
          {formError && <div className="alert alert-error" role="alert"><Icon name="alert" /><span>{formError}</span></div>}
          <div className="form-grid">
            <div className="form-field"><label htmlFor="new-name">Nombre *</label><input id="new-name" name="name" required maxLength="80" /></div>
            <div className="form-field"><label htmlFor="new-lastname">Apellidos *</label><input id="new-lastname" name="lastName" required maxLength="100" /></div>
            <div className="form-field"><label htmlFor="new-id">Cédula *</label><input id="new-id" name="cedula" required maxLength="30" /></div>
            <div className="form-field"><label htmlFor="new-email">Correo electrónico *</label><input id="new-email" name="email" type="email" required maxLength="120" /></div>
            <div className="form-field"><label htmlFor="new-phone">Teléfono</label><input id="new-phone" name="phone" maxLength="30" /></div>
            <div className="form-field"><label htmlFor="new-age">Edad</label><input id="new-age" name="age" type="number" min="1" max="120" /></div>
            <div className="form-field form-field-wide"><label htmlFor="new-address">Dirección</label><input id="new-address" name="address" maxLength="200" /></div>
          </div>
          <div className="modal-actions">
            <button className="button button-quiet" onClick={() => modalRef.current?.close()} type="button">Cancelar</button>
            <button className="button button-primary" type="submit" disabled={saving}>{saving ? 'Registrando…' : 'Registrar usuario'}</button>
          </div>
        </form>
      </dialog>
    </>
  );
}
