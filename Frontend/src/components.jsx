import React, { useEffect, useState } from 'react';
import { icons } from './core.js';

export function Icon({ name, className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icons[name] }}
    />
  );
}

export function PageHeading({ eyebrow, title, children, actions }) {
  if (!eyebrow && !title && !children && !actions) return null;
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        {title && <h1>{title}</h1>}
        {children && <p>{children}</p>}
      </div>
      {actions}
    </div>
  );
}

export function TurnDurationFields({ idPrefix }) {
  return (
    <div className="form-field form-field-wide">
      <span className="form-label">Duración del turno *</span>
      <div className="duration-inputs">
        <div className="form-field">
          <label htmlFor={`${idPrefix}-hours`}>Horas</label>
          <input id={`${idPrefix}-hours`} name="durationHours" type="number" min="0" max="4" step="1" defaultValue="4" required />
        </div>
        <div className="form-field">
          <label htmlFor={`${idPrefix}-minutes`}>Minutos</label>
          <input id={`${idPrefix}-minutes`} name="durationRemainderMinutes" type="number" min="0" max="59" step="1" defaultValue="0" required />
        </div>
      </div>
    </div>
  );
}

export function PageAlert({ message, onRetry }) {
  const [visible, setVisible] = useState(Boolean(message));
  useEffect(() => setVisible(Boolean(message)), [message]);
  if (!message || !visible) return null;
  return (
    <div className="alert alert-error page-alert" role="alert">
      <Icon name="alert" />
      <span>{message}</span>
      {onRetry && <button className="text-button" onClick={onRetry} type="button">Reintentar</button>}
      <button className="alert-dismiss" onClick={() => setVisible(false)} type="button" aria-label="Cerrar alerta">×</button>
    </div>
  );
}

export function Notice({ message }) {
  const [visible, setVisible] = useState(Boolean(message));
  useEffect(() => setVisible(Boolean(message)), [message]);
  if (!message || !visible) return null;
  return <div className="alert alert-success page-alert" role="status"><Icon name="check" /><span>{message}</span><button className="alert-dismiss" onClick={() => setVisible(false)} type="button" aria-label="Cerrar notificación">×</button></div>;
}

export function EmptyState({ icon, title, children }) {
  return <div className="empty-state">{icon && <Icon name={icon} />}<strong>{title}</strong><span>{children}</span></div>;
}

export function PersonCell({ name, detail, iconClass = '' }) {
  return (
    <div className="table-person">
      <span className={`table-avatar ${iconClass}`}>{(name || '?')[0].toUpperCase()}</span>
      <span><strong>{name}</strong>{detail && <small>{detail}</small>}</span>
    </div>
  );
}

export function StatusPill({ children, inactive = false, active = false }) {
  return <span className={`status-pill ${inactive ? 'status-inactive' : ''} ${active ? 'status-active' : ''}`}><i />{children}</span>;
}

export function PendingModule({ title, message }) {
  return (
    <>
      <PageHeading title={title}>{message}</PageHeading>
      <section className="panel module-placeholder"><EmptyState icon="book" title="Módulo pendiente">Esta sección se habilitará en una próxima etapa.</EmptyState></section>
    </>
  );
}
