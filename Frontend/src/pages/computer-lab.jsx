import React, { useRef, useState } from 'react';
import { state, request, formatDateTime, formatTime, renderApp } from '../core.js';
import { EmptyState, Icon, Notice, PageAlert, PageHeading, PersonCell, StatusPill } from '../components.jsx';

export async function loadComputerLab() {
  const [result, usersResult] = await Promise.all([request('/api/computer-lab'), request('/api/users')]);
  state.users = usersResult.data || [];
  state.computerLab = {
    total: result.total,
    occupied: result.occupied,
    free: result.free,
    workstations: result.workstations || [],
    sessions: result.sessions || []
  };
}

export default function ComputerLabPage() {
  const modalRef = useRef(null);
  const formRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const free = state.computerLab.workstations.filter(workstation => workstation.status === 'free');
  const visitors = state.users.filter(user => user.role === 'user' && user.isActive !== false);

  function openModal(workstationNumber) {
    setFormError('');
    if (workstationNumber) formRef.current.elements.workstationNumber.value = workstationNumber;
    modalRef.current?.showModal();
    if (workstationNumber) formRef.current.elements.userCode.focus();
  }

  async function submitSession(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    values.workstationNumber = Number(values.workstationNumber);
    setSaving(true);
    setFormError('');
    try {
      const result = await request('/api/computer-lab/sessions', { method: 'POST', body: JSON.stringify(values) });
      state.notice = result.message;
      modalRef.current?.close();
      await loadComputerLab();
      renderApp();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function finishSession(id) {
    if (!window.confirm('¿Finalizar el uso de esta computadora?')) return;
    try {
      const result = await request(`/api/computer-lab/sessions/${id}/finish`, { method: 'PATCH' });
      state.notice = result.message;
      await loadComputerLab();
      renderApp();
    } catch (error) {
      state.error = error.message;
      renderApp();
    }
  }

  async function refresh() {
    state.loading = true;
    renderApp();
    try {
      await loadComputerLab();
      state.error = '';
    } catch (error) {
      state.error = error.message;
    } finally {
      state.loading = false;
      renderApp();
    }
  }

  return (
    <>
      <PageHeading title="Sala informática" actions={
        <button className="button button-primary" onClick={() => openModal()} type="button" disabled={!free.length}><Icon name="plus" /> Registrar uso</button>
      } />
      <PageAlert message={state.error} onRetry={refresh} />
      <Notice message={state.notice} />
      <div className="stats-grid lab-stats">
        <article className="stat-card"><div className="stat-icon green"><Icon name="computer" /></div><span className="stat-chip">EN USO</span><div className="stat-value">{state.computerLab.occupied}</div><div className="stat-label">Computadoras ocupadas</div></article>
        <article className="stat-card"><div className="stat-icon blue"><Icon name="check" /></div><span className="stat-chip">DISPONIBLES</span><div className="stat-value">{state.computerLab.free}</div><div className="stat-label">Computadoras libres</div></article>
        <article className="stat-card"><div className="stat-icon purple"><Icon name="computer" /></div><span className="stat-chip">TOTAL</span><div className="stat-value">{state.computerLab.total}</div><div className="stat-label">Puestos de la sala</div></article>
      </div>
      <section className="panel workstation-panel">
        <div className="section-title"><div><h2>Estado de las computadoras</h2><p>Selecciona una estación libre para iniciar una sesión.</p></div>
          <button className="button button-quiet button-small" onClick={refresh} type="button"><Icon name="clock" /> Actualizar</button>
        </div>
        <div className="workstation-grid">
          {state.computerLab.workstations.map(workstation => {
            const session = workstation.session;
            return (
              <article className={`workstation-card ${session ? 'workstation-busy' : 'workstation-free'}`} key={workstation.number}>
                <div className="workstation-heading"><span className="workstation-number"><Icon name="computer" /> PC {workstation.number}</span><StatusPill inactive={Boolean(session)}>{session ? 'En uso' : 'Libre'}</StatusPill></div>
                {session ? <>
                  <p className="workstation-user">{session.userName} <small>{session.userCode}</small></p>
                  <p className="workstation-time">Desde {formatTime(session.startedAt)}</p>
                  <button className="button button-quiet button-small" onClick={() => finishSession(session._id)} type="button">Finalizar uso</button>
                </> : <>
                  <p className="workstation-user">Disponible ahora</p>
                  <button className="button button-primary button-small" onClick={() => openModal(workstation.number)} type="button">Iniciar uso</button>
                </>}
              </article>
            );
          })}
        </div>
      </section>
      <section className="panel data-panel section-gap">
        <div className="table-toolbar"><div><h2>Registro de uso</h2><p>{state.computerLab.sessions.length} sesiones recientes</p></div></div>
        {state.computerLab.sessions.length ? (
          <div className="table-scroll"><table>
            <thead><tr><th>VISITANTE</th><th>COMPUTADORA</th><th>INICIO</th><th>FIN</th><th>ESTADO</th></tr></thead>
            <tbody>{state.computerLab.sessions.map(session => (
              <tr key={session._id}>
                <td><PersonCell name={session.userName} detail={session.userCode} /></td>
                <td>PC {session.workstationNumber}</td>
                <td>{formatDateTime(session.startedAt)}</td><td>{session.endedAt ? formatDateTime(session.endedAt) : '—'}</td>
                <td><StatusPill active={session.status === 'active'}>{session.status === 'active' ? 'Activa' : 'Finalizada'}</StatusPill></td>
              </tr>
            ))}</tbody>
          </table></div>
        ) : <EmptyState title="Aún no hay sesiones">Registra el uso de una computadora para empezar.</EmptyState>}
      </section>
      <dialog className="modal" ref={modalRef}>
        <form className="modal-card" onSubmit={submitSession} ref={formRef}>
          <div className="modal-heading"><div><div className="eyebrow">SALA INFORMÁTICA</div><h2>Registrar uso</h2></div>
            <button className="icon-button" onClick={() => modalRef.current?.close()} type="button" aria-label="Cerrar">×</button>
          </div>
          <p className="modal-description">Selecciona una computadora libre e ingresa el código del visitante. Finaliza la sesión al dejar el puesto.</p>
          {formError && <div className="alert alert-error modal-error" role="alert"><Icon name="alert" /><span>{formError}</span></div>}
          <div className="form-grid">
            <div className="form-field"><label htmlFor="computer-number">Computadora *</label>
              <select id="computer-number" name="workstationNumber" required>{free.map(item => <option key={item.number} value={item.number}>PC {item.number}</option>)}</select>
            </div>
            <div className="form-field"><label htmlFor="computer-user-code">Código del visitante *</label>
              <input id="computer-user-code" name="userCode" list="computer-visitors" required inputMode="numeric" pattern="[0-9]{4}" maxLength={4} placeholder="Ej. 1001" autoComplete="off" />
              <datalist id="computer-visitors">{visitors.map(user => <option key={user._id} value={user.userCode || ''}>{`${user.name} ${user.lastName}`}</option>)}</datalist>
            </div>
          </div>
          <div className="modal-actions">
            <button className="button button-quiet" onClick={() => modalRef.current?.close()} type="button">Cancelar</button>
            <button className="button button-primary" type="submit" disabled={saving || !free.length}>{saving ? 'Registrando…' : 'Iniciar sesión'}</button>
          </div>
        </form>
      </dialog>
    </>
  );
}
