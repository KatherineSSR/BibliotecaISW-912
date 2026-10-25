import React, { useRef, useState } from 'react';
import { state, request, dateLabel, renderApp } from '../core.js';
import { EmptyState, Icon, Notice, PageAlert, PageHeading } from '../components.jsx';

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
    state.userCount = state.users.filter(user => user.role === 'user' && user.isActive !== false).length;
  } catch (error) {
    state.error = error.message;
    state.users = [];
    state.cubicles = [];
  } finally {
    state.loading = false;
  }
}

export default function DashboardPage() {
  const modalRef = useRef(null);
  const [updatingNumber, setUpdatingNumber] = useState(null);
  const [cubicleError, setCubicleError] = useState('');
  const occupied = state.cubicles.filter(cubicle => cubicle.status === 'occupied').length;
  const free = state.cubicles.length - occupied;

  async function refresh() {
    await loadDashboard();
    renderApp();
  }

  async function updateCubicle(cubicle) {
    setUpdatingNumber(cubicle.number);
    setCubicleError('');
    try {
      const result = await request(`/api/cubicles/${cubicle.number}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: cubicle.status === 'occupied' ? 'free' : 'occupied' })
      });
      state.cubicles = state.cubicles.map(item => item.number === cubicle.number ? result.data : item);
      renderApp();
    } catch (error) {
      setCubicleError(error.message);
    } finally {
      setUpdatingNumber(null);
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
        <button className="stat-card cubicle-stat" onClick={() => modalRef.current?.showModal()} type="button" disabled={state.loading || Boolean(state.error)} aria-label="Administrar cubículos">
          <span className="stat-icon blue"><Icon name="cubicle" /></span>
          <span className="stat-chip">{state.loading ? 'CARGANDO' : `${state.cubicles.length} EN TOTAL`}</span>
          <span className="stat-value">{state.loading ? '—' : `${occupied}/${free}`}</span>
          <span className="stat-label">En uso / libres</span>
          <span className="cubicle-manage-hint">Toca para actualizar el estado</span>
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
              const isOccupied = cubicle.status === 'occupied';
              return (
                <div className={`cubicle-overview-item ${isOccupied ? 'is-occupied' : 'is-free'}`} key={cubicle.number}>
                  <Icon name="cubicle" />
                  <strong>Cubículo {cubicle.number}</strong>
                  <span>{isOccupied ? 'En uso' : 'Libre'}</span>
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
            <div><div className="eyebrow">ESTADO DEL ESPACIO</div><h2>Administrar cubículos</h2></div>
            <button className="icon-button" onClick={() => modalRef.current?.close()} type="button" aria-label="Cerrar">×</button>
          </div>
          <p className="modal-description">Actualiza cada cubículo cuando se ocupe o quede libre. El estado se comparte con el resto del personal.</p>
          {cubicleError && <div className="alert alert-error cubicle-error" role="alert"><Icon name="alert" /><span>{cubicleError}</span></div>}
          <div className="cubicle-list">
            {state.cubicles.map(cubicle => {
              const isOccupied = cubicle.status === 'occupied';
              return (
                <div className="cubicle-row" key={cubicle.number}>
                  <span className={`cubicle-number ${isOccupied ? 'is-occupied' : ''}`}><Icon name="cubicle" /></span>
                  <span className="cubicle-info"><strong>Cubículo {cubicle.number}</strong><small>{isOccupied ? 'Actualmente en uso' : 'Disponible'}</small></span>
                  <span className={`cubicle-status ${isOccupied ? 'status-occupied' : 'status-free'}`}><i />{isOccupied ? 'En uso' : 'Libre'}</span>
                  <button className={`button ${isOccupied ? 'button-quiet' : 'button-primary'} cubicle-toggle`} onClick={() => updateCubicle(cubicle)} type="button" disabled={updatingNumber === cubicle.number}>
                    {updatingNumber === cubicle.number ? 'Guardando…' : isOccupied ? 'Marcar libre' : 'Marcar en uso'}
                  </button>
                </div>
              );
            })}
            {!state.cubicles.length && <EmptyState title="No hay cubículos">Cuando estén configurados, aparecerán aquí.</EmptyState>}
          </div>
          <Notice message={state.notice} />
          <div className="modal-actions"><button className="button button-quiet" onClick={() => modalRef.current?.close()} type="button">Cerrar</button></div>
        </div>
      </dialog>
    </>
  );
}
