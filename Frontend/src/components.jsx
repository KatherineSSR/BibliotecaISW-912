import React from 'react';
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

export function PageAlert({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="alert alert-error page-alert" role="alert">
      <Icon name="alert" />
      <span>{message}</span>
      {onRetry && <button className="text-button" onClick={onRetry} type="button">Reintentar</button>}
    </div>
  );
}

export function Notice({ message }) {
  if (!message) return null;
  return <div className="alert alert-success page-alert" role="status"><Icon name="check" /><span>{message}</span></div>;
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
