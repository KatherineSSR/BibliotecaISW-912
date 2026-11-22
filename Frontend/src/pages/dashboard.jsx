import React, { useEffect, useRef, useState } from 'react';
import { state, request, dateLabel, formatDateTime, formatTime, getTurnDurationMinutes, renderApp } from '../core.js';
import { EmptyState, Icon, Notice, PageAlert, PageHeading, PersonCell, StatusPill, TurnDurationFields } from '../components.jsx';

export async function loadDashboard() {
  state.loading = true;
  state.error = '';
  try {
    const [usersResult, cubiclesResult] = await Promise.all([
      request('/api/users'),
      request('/api/cubicles')
    ]);
    state.users = usersResult.data || [];
    state.cubicles = cubiclesResult.data || [];
    state.cubicleSessions = cubiclesResult.sessions || [];
    state.userCount = state.users.filter(user => user.role === 'user' && user.isActive !== false).length;
  } catch (error) {
    state.error = error.message;
    state.users = [];
    state.cubicles = [];
    state.cubicleSessions = [];
  } finally {
    state.loading = false;
  }
}

export default function DashboardPage() {
  const modalRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const visitors = state.users.filter(user => user.role === 'user' && user.isActive !== false);
  const freeCubicles = state.cubicles.filter(cubicle => cubicle.status === 'free');
  const occupied = state.cubicles.filter(cubicle => cubicle.status === 'occupied').length;
  const free = state.cubicles.length - occupied;

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        await loadDashboard();
        renderApp();
      } catch (error) {
        state.error = error.message;
        renderApp();
      }
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  async function refresh() {
    await loadDashboard();
    renderApp();
  }

  async function startCubicleSession(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    values.cubicleNumber = Number(values.cubicleNumber);
    values.durationMinutes = getTurnDurationMinutes(values.durationHours, values.durationRemainderMinutes);
    delete values.durationHours;
    delete values.durationRemainderMinutes;
    if (!values.durationMinutes) {
      setFormError('La duración debe ser mayor que cero y no superar las 4 horas.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const result = await request('/api/cubicles/sessions', {
        method: 'POST',
        body: JSON.stringify(values)
      });
      state.notice = result.message;
      form.reset();
      await loadDashboard();
      renderApp();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function finishCubicleSession(id) {
    if (!window.confirm('¿Finalizar el turno de este cubículo?')) return;
    try {
      const result = await request(`/api/cubicles/sessions/${id}/finish`, { method: 'PATCH' });
      state.notice = result.message;
      await loadDashboard();
      renderApp();
    } catch (error) {
      state.error = error.message;
      renderApp();
    }
  }

  return (
    <>
      <PageHeading title="Resumen de hoy" actions={
        <span className="date-pill"><Icon name="clock" />{dateLabel(new Date(), { day: 'numeric', month: 'short', year: 'numeric' })}</span>
      } />
      <PageAlert message={state.error} onRetry={refresh} />
      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon green"><Icon name="users" /></div><span className="stat-chip">ACTIVOS</span>
          <div className="stat-value">{state.loading ? '—' : state.userCount.toLocaleString('es-CR')}</div>
          <div className="stat-label">Usuarios registrados</div>
        </article>
        <button className="stat-card cubicle-stat" onClick={() => { setFormError(''); modalRef.current?.showModal(); }} type="button" disabled={state.loading || Boolean(state.error)} aria-label="Administrar cubículos">
          <span className="stat-icon blue"><Icon name="cubicle" /></span>
          <span className="stat-chip">{state.loading ? 'CARGANDO' : `${state.cubicles.length} EN TOTAL`}</span>
          <span className="stat-value">{state.loading ? '—' : `${occupied}/${free}`}</span>
          <span className="stat-label">En uso / libres</span>
          <span className="cubicle-manage-hint">Toca para registrar o finalizar turnos</span>
        </button>
      </div>
      <section className="panel cubicle-overview" aria-label="Estado de los cubículos">
        <div className="panel-heading">
          <div><h2>Estado de los cubículos</h2><p>Disponibilidad actual del espacio</p></div>
          <span className="cubicle-overview-count">{occupied} en uso · {free} libres</span>
        </div>
        {state.cubicles.length ? (
          <div className="cubicle-overview-grid">
            {state.cubicles.map(cubicle => {
              const session = cubicle.session;
              const isOccupied = Boolean(session);
              return (
                <div className={`cubicle-overview-item ${isOccupied ? 'is-occupied' : 'is-free'}`} key={cubicle.number}>
                  <Icon name="cubicle" />
                  <strong>Cubículo {cubicle.number}</strong>
                  <span>{isOccupied ? `En uso · ${session.userName}` : 'Libre'}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState title="No hay cubículos">Cuando estén configurados, aparecerán aquí.</EmptyState>
        )}
      </section>
      <dialog className="modal cubicle-modal" ref={modalRef}>
        <div className="modal-card">
          <div className="modal-heading">
            <div><div className="eyebrow">CONTROL DE TURNOS</div><h2>Préstamos de cubículos</h2></div>
            <button className="icon-button" onClick={() => modalRef.current?.close()} type="button" aria-label="Cerrar">×</button>
          </div>
          <p className="modal-description">Asigna el turno a un visitante activo.</p>
          {formError && <div className="alert alert-error cubicle-error" role="alert"><Icon name="alert" /><span>{formError}</span><button className="alert-dismiss" onClick={() => setFormError('')} type="button" aria-label="Cerrar alerta">×</button></div>}
          <form onSubmit={startCubicleSession}>
            <div className="form-grid">
              <div className="form-field"><label htmlFor="cubicle-number">Cubículo *</label>
                <select id="cubicle-number" name="cubicleNumber" required disabled={!freeCubicles.length}>
                  {freeCubicles.map(item => <option key={item.number} value={item.number}>Cubículo {item.number}</option>)}
                </select>
              </div>
              <div className="form-field"><label htmlFor="cubicle-user-code">Código del visitante *</label>
                <input id="cubicle-user-code" name="userCode" list="cubicle-visitors" required inputMode="numeric" pattern="[0-9]{4}" maxLength={4} placeholder="Ej. 1001" autoComplete="off" />
                <datalist id="cubicle-visitors">{visitors.map(user => <option key={user._id} value={user.userCode || ''}>{`${user.name} ${user.lastName}`}</option>)}</datalist>
              </div>
              <TurnDurationFields idPrefix="cubicle-duration" />
            </div>
            <div className="modal-actions">
              <button className="button button-quiet" onClick={() => modalRef.current?.close()} type="button">Cerrar</button>
              <button className="button button-primary" type="submit" disabled={saving || !freeCubicles.length}>{saving ? 'Registrando…' : 'Iniciar turno'}</button>
            </div>
          </form>
          <div className="cubicle-list">
            {state.cubicles.map(cubicle => {
              const session = cubicle.session;
              const isOccupied = Boolean(session);
              return (
                <div className="cubicle-row" key={cubicle.number}>
                  <span className={`cubicle-number ${isOccupied ? 'is-occupied' : ''}`}><Icon name="cubicle" /></span>
                  <span className="cubicle-info">
                    <strong>Cubículo {cubicle.number}</strong>
                    <small>{isOccupied ? `${session.userName} · ${session.userCode}` : 'Disponible'}</small>
                    {session && <small>Desde {formatTime(session.startedAt)} · vence {formatTime(session.endsAt)}</small>}
                  </span>
                  <span className={`cubicle-status ${isOccupied ? 'status-occupied' : 'status-free'}`}><i />{isOccupied ? 'En uso' : 'Libre'}</span>
                  {session && <button className="button button-quiet button-small cubicle-toggle" onClick={() => finishCubicleSession(session._id)} type="button">Finalizar turno</button>}
                </div>
              );
            })}
            {!state.cubicles.length && <EmptyState title="No hay cubículos">Cuando estén configurados, aparecerán aquí.</EmptyState>}
          </div>
          <Notice message={state.notice} />
          {state.cubicleSessions.length > 0 && (
            <section className="cubicle-history">
              <div className="table-toolbar"><div><h3>Historial de turnos</h3><p>{state.cubicleSessions.length} registros recientes</p></div></div>
              <div className="table-scroll"><table>
                <thead><tr><th>VISITANTE</th><th>CUBÍCULO</th><th>INICIO</th><th>FIN</th><th>ESTADO</th></tr></thead>
                <tbody>{state.cubicleSessions.map(session => (
                  <tr key={session._id}>
                    <td><PersonCell name={session.userName} detail={session.userCode} /></td>
                    <td>{session.cubicleNumber}</td>
                    <td>{formatDateTime(session.startedAt)}</td>
                    <td>{session.endedAt ? formatDateTime(session.endedAt) : '—'}</td>
                    <td><StatusPill active={session.status === 'active'}>{session.status === 'active' ? 'Activa' : session.status === 'expired' ? 'Vencida' : 'Finalizada'}</StatusPill></td>
                  </tr>
                ))}</tbody>
              </table></div>
            </section>
          )}
        </div>
      </dialog>
    </>
  );
}
