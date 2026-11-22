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
  const editModalRef = useRef(null);
  const [search, setSearch] = useState(state.searchTerm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [editingUser, setEditingUser] = useState(null);

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

  function openEdit(user) {
    setEditingUser({
      _id: user._id,
      name: user.name || '',
      lastName: user.lastName || '',
      cedula: user.cedula || '',
      email: user.email || '',
      phone: user.phone || '',
      age: user.age !== undefined && user.age !== null ? user.age : '',
      address: user.address || '',
      userCode: user.userCode || '',
      isActive: user.isActive !== false
    });
    setFormError('');
    editModalRef.current?.showModal();
  }

  async function submitUpdateUser(event) {
    event.preventDefault();
    if (!editingUser?._id) return;
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        name: editingUser.name.trim(),
        lastName: editingUser.lastName.trim(),
        cedula: editingUser.cedula.trim(),
        email: editingUser.email.trim(),
        phone: editingUser.phone.trim(),
        age: editingUser.age !== '' ? Number(editingUser.age) : undefined,
        address: editingUser.address.trim(),
        isActive: Boolean(editingUser.isActive)
      };

      const result = await request(`/api/users/${editingUser._id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      state.notice = result.message || 'Usuario actualizado correctamente.';
      editModalRef.current?.close();
      setEditingUser(null);
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
        <button className="button button-primary" onClick={() => { setFormError(''); modalRef.current?.showModal(); }} type="button">
          <Icon name="plus" /><span>Nuevo usuario</span>
        </button>
      } />
      <PageAlert message={state.error} onRetry={refresh} />
      <Notice message={state.notice} />
      <section className="panel data-panel">
        <div className="table-toolbar">
          <div>
            <h2>Directorio de usuarios</h2>
            <p>{users.length} visitantes{state.searchTerm ? ' encontrados' : ' registrados'}</p>
          </div>
          <label className="search-box">
            <Icon name="search" />
            <input
              type="search"
              placeholder="Buscar por nombre, cédula o código"
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
          </label>
        </div>
        {state.loading ? (
          <div className="table-message">Cargando usuarios…</div>
        ) : users.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>USUARIO</th>
                  <th>CÉDULA</th>
                  <th>CÓDIGO</th>
                  <th>TELÉFONO</th>
                  <th>ESTADO</th>
                  <th style={{ textAlign: 'center' }}>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td><PersonCell name={`${user.name || ''} ${user.lastName || ''}`.trim()} detail={user.email || ''} /></td>
                    <td>{user.cedula || '—'}</td>
                    <td><span className="code-tag">{user.userCode || '—'}</span></td>
                    <td>{user.phone || '—'}</td>
                    <td><StatusPill inactive={user.isActive === false}>{user.isActive === false ? 'Inactivo' : 'Activo'}</StatusPill></td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="button button-quiet button-small"
                        onClick={() => openEdit(user)}
                        type="button"
                        title={`Editar a ${user.name}`}
                        style={{ gap: '6px', padding: '0 12px' }}
                      >
                        <Icon name="edit" />
                        <span>Editar</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon="users" title={state.searchTerm ? 'No encontramos coincidencias' : 'No hay usuarios registrados'}>
            {state.searchTerm ? 'Prueba con otro nombre, cédula o código.' : 'Los visitantes que registres aparecerán aquí.'}
          </EmptyState>
        )}
      </section>

      {/* Modal: Registrar Usuario (HU-01) */}
      <dialog className="modal" ref={modalRef}>
        <form className="modal-card" onSubmit={submitUser}>
          <div className="modal-heading">
            <div><div className="eyebrow">NUEVO REGISTRO</div><h2>Registrar usuario</h2></div>
            <button className="icon-button" onClick={() => modalRef.current?.close()} type="button" aria-label="Cerrar">×</button>
          </div>
          <p className="modal-description">Completa los datos del visitante. Su código de usuario se generará automáticamente.</p>
          {formError && (
            <div className="alert alert-error" role="alert">
              <Icon name="alert" />
              <span>{formError}</span>
              <button className="alert-dismiss" onClick={() => setFormError('')} type="button" aria-label="Cerrar">×</button>
            </div>
          )}
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

      {/* Modal: Editar Usuario (HU-02) */}
      <dialog className="modal" ref={editModalRef}>
        {editingUser && (
          <form className="modal-card" onSubmit={submitUpdateUser}>
            <div className="modal-heading">
              <div>
                <div className="eyebrow">ACTUALIZACIÓN (HU-02)</div>
                <h2>Editar usuario</h2>
              </div>
              <button className="icon-button" onClick={() => editModalRef.current?.close()} type="button" aria-label="Cerrar">×</button>
            </div>
            <p className="modal-description">
              Modifica los datos del visitante. Código único asignado: <strong className="code-tag">{editingUser.userCode || 'Sin código'}</strong>
            </p>
            {formError && (
            <div className="alert alert-error" role="alert">
              <Icon name="alert" />
              <span>{formError}</span>
              <button className="alert-dismiss" onClick={() => setFormError('')} type="button" aria-label="Cerrar">×</button>
            </div>
          )}
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="edit-name">Nombre *</label>
                <input
                  id="edit-name"
                  required
                  maxLength="80"
                  value={editingUser.name}
                  onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label htmlFor="edit-lastname">Apellidos *</label>
                <input
                  id="edit-lastname"
                  required
                  maxLength="100"
                  value={editingUser.lastName}
                  onChange={e => setEditingUser({ ...editingUser, lastName: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label htmlFor="edit-id">Cédula *</label>
                <input
                  id="edit-id"
                  required
                  maxLength="30"
                  value={editingUser.cedula}
                  onChange={e => setEditingUser({ ...editingUser, cedula: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label htmlFor="edit-email">Correo electrónico *</label>
                <input
                  id="edit-email"
                  type="email"
                  required
                  maxLength="120"
                  value={editingUser.email}
                  onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label htmlFor="edit-phone">Teléfono</label>
                <input
                  id="edit-phone"
                  maxLength="30"
                  value={editingUser.phone}
                  onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label htmlFor="edit-age">Edad</label>
                <input
                  id="edit-age"
                  type="number"
                  min="1"
                  max="120"
                  value={editingUser.age}
                  onChange={e => setEditingUser({ ...editingUser, age: e.target.value })}
                />
              </div>
              <div className="form-field form-field-wide">
                <label htmlFor="edit-address">Dirección</label>
                <input
                  id="edit-address"
                  maxLength="200"
                  value={editingUser.address}
                  onChange={e => setEditingUser({ ...editingUser, address: e.target.value })}
                />
              </div>
              <div className="form-field form-field-wide">
                <label htmlFor="edit-status">Estado del usuario</label>
                <select
                  id="edit-status"
                  value={editingUser.isActive ? 'active' : 'inactive'}
                  onChange={e => setEditingUser({ ...editingUser, isActive: e.target.value === 'active' })}
                >
                  <option value="active">Activo (habilitado para préstamos y check-in)</option>
                  <option value="inactive">Inactivo (bloqueado en el sistema)</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="button button-quiet" onClick={() => editModalRef.current?.close()} type="button">Cancelar</button>
              <button className="button button-primary" type="submit" disabled={saving}>
                {saving ? 'Guardando cambios…' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}
