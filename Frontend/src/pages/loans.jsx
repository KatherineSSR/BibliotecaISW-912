import React, { useEffect, useRef, useState } from 'react';
import { state, request, formatDate, renderApp } from '../core.js';
import { EmptyState, Icon, Notice, PageAlert, PageHeading, PersonCell } from '../components.jsx';

/**
 * Cargar datos de préstamos, estadísticas, lista de espera, catálogo y usuarios
 */
export async function loadLoans() {
  state.loading = true;
  state.error = '';
  try {
    const [loansRes, statsRes, waitlistRes, booksRes, usersRes] = await Promise.all([
      request('/api/loans'),
      request('/api/loans/stats'),
      request('/api/loans/waitlist'),
      request('/api/books'),
      request('/api/users')
    ]);

    state.loans = loansRes.data || [];
    state.loanStats = statsRes.data || {
      activeCount: 0,
      overdueCount: 0,
      returnedCount: 0,
      waitingCount: 0,
      totalLoans: 0
    };
    state.waitlist = waitlistRes.data || [];
    state.books = booksRes.data || [];
    state.users = usersRes.data || [];
  } catch (error) {
    state.error = error.message;
  } finally {
    state.loading = false;
  }
}

export default function LoansPage() {
  const [activeTab, setActiveTab] = useState('loans'); // 'loans', 'waitlist', 'catalog'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'overdue', 'returned'
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Modales
  const loanModalRef = useRef(null);
  const waitlistModalRef = useRef(null);
  const loanFormRef = useRef(null);
  const waitlistFormRef = useRef(null);

  // Estados de formulario
  const [selectedBookId, setSelectedBookId] = useState('');
  const [userCodeInput, setUserCodeInput] = useState('');
  const [loanDays, setLoanDays] = useState('7');

  const visitors = state.users.filter(u => u.role === 'user' && u.isActive !== false);
  const activeBooks = state.books.filter(b => b.isActive !== false);

  // Usuario sugerido o encontrado según userCode
  const matchedUser = visitors.find(u => u.userCode === userCodeInput.trim());

  // Libro seleccionado en el formulario
  const selectedBook = activeBooks.find(b => b._id === selectedBookId);

  async function refresh() {
    await loadLoans();
    renderApp();
  }

  // Filtrado de préstamos
  const filteredLoans = state.loans.filter(loan => {
    if (statusFilter !== 'all' && loan.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const titleMatch = (loan.bookTitle || loan.book?.title || '').toLowerCase().includes(term);
    const userMatch = (loan.userName || '').toLowerCase().includes(term);
    const codeMatch = (loan.userCode || '').toLowerCase().includes(term);
    return titleMatch || userMatch || codeMatch;
  });

  // Filtrado de lista de espera
  const filteredWaitlist = state.waitlist.filter(item => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      (item.bookTitle || '').toLowerCase().includes(term) ||
      (item.userName || '').toLowerCase().includes(term) ||
      (item.userCode || '').toLowerCase().includes(term)
    );
  });

  // Filtrado de catálogo
  const filteredCatalog = activeBooks.filter(book => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      (book.isbn || '').toLowerCase().includes(term) ||
      book.category.toLowerCase().includes(term)
    );
  });

  // Abrir modal de nuevo préstamo
  function openLoanModal(presetBookId = '') {
    setFormError('');
    setSelectedBookId(presetBookId || (activeBooks[0]?._id || ''));
    setUserCodeInput('');
    setLoanDays('7');
    loanModalRef.current?.showModal();
  }

  // Abrir modal de lista de espera
  function openWaitlistModal(presetBookId = '') {
    setFormError('');
    setSelectedBookId(presetBookId || (activeBooks.find(b => b.availableCopies === 0)?._id || activeBooks[0]?._id || ''));
    setUserCodeInput('');
    waitlistModalRef.current?.showModal();
  }

  // Enviar nuevo préstamo
  async function submitLoan(event) {
    event.preventDefault();
    if (!selectedBookId) {
      setFormError('Debe seleccionar un libro del catálogo.');
      return;
    }
    if (!userCodeInput.trim()) {
      setFormError('Debe ingresar el código de usuario del lector.');
      return;
    }

    setSaving(true);
    setFormError('');
    try {
      const payload = {
        bookId: selectedBookId,
        userCode: userCodeInput.trim(),
        loanDays: Number(loanDays) || 7
      };

      const result = await request('/api/loans', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      state.notice = result.message;
      loanModalRef.current?.close();
      await loadLoans();
      renderApp();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Enviar a lista de espera
  async function submitWaitlist(event) {
    event.preventDefault();
    if (!selectedBookId) {
      setFormError('Debe seleccionar un libro para la lista de espera.');
      return;
    }
    if (!userCodeInput.trim()) {
      setFormError('Debe ingresar el código de usuario del visitante.');
      return;
    }

    setSaving(true);
    setFormError('');
    try {
      const formData = new FormData(event.currentTarget);
      const payload = {
        bookId: selectedBookId,
        userCode: userCodeInput.trim(),
        notes: String(formData.get('notes') || '').trim()
      };

      const result = await request('/api/loans/waitlist', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      state.notice = result.message;
      waitlistModalRef.current?.close();
      await loadLoans();
      renderApp();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Marcar devolución
  async function handleReturn(loan) {
    const isOverdue = loan.status === 'overdue';
    const confirmMsg = isOverdue
      ? `¿Confirmar devolución del libro con retraso "${loan.bookTitle}" (Lector: ${loan.userName})?`
      : `¿Registrar la devolución del libro "${loan.bookTitle}" prestado a ${loan.userName}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const result = await request(`/api/loans/${loan._id}/return`, {
        method: 'PATCH'
      });
      state.notice = result.message;
      await loadLoans();
      renderApp();
    } catch (err) {
      state.error = err.message;
      renderApp();
    }
  }

  // Cancelar turno de lista de espera
  async function handleCancelWaitlist(waitItem) {
    if (!window.confirm(`¿Cancelar el turno de ${waitItem.userName} para "${waitItem.bookTitle}"?`)) return;
    try {
      const result = await request(`/api/loans/waitlist/${waitItem._id}`, {
        method: 'DELETE'
      });
      state.notice = result.message;
      await loadLoans();
      renderApp();
    } catch (err) {
      state.error = err.message;
      renderApp();
    }
  }

  return (
    <>
      <PageHeading
        eyebrow="BIBLIOTECA PÚBLICA DE CIUDAD QUESADA"
        title="Control de Préstamos y Catálogo"
        actions={
          <div className="heading-actions">
            <button
              className="button button-secondary"
              onClick={() => openWaitlistModal()}
              type="button"
            >
              <Icon name="clock" />
              <span>Lista de espera</span>
            </button>
            <button
              className="button button-primary"
              onClick={() => openLoanModal()}
              type="button"
            >
              <Icon name="plus" />
              <span>Nuevo préstamo</span>
            </button>
          </div>
        }
      >
        Gestione préstamos activos, fechas de vencimiento con cálculo automático, libros en retraso, devoluciones y listas de espera con ventana de reserva de 24 horas.
      </PageHeading>

      <PageAlert message={state.error} onRetry={refresh} />
      <Notice message={state.notice} />

      {/* KPI Cards de Préstamos */}
      <div className="stats-grid lab-stats">
        <article
          className={`stat-card ${statusFilter === 'active' && activeTab === 'loans' ? 'selected-stat' : ''}`}
          onClick={() => { setActiveTab('loans'); setStatusFilter('active'); }}
          style={{ cursor: 'pointer' }}
          title="Ver préstamos activos"
        >
          <div className="stat-icon blue"><Icon name="loan" /></div>
          <span className="stat-chip">EN LECTURA</span>
          <div className="stat-value">{state.loading ? '—' : state.loanStats.activeCount}</div>
          <div className="stat-label">Préstamos activos</div>
        </article>

        <article
          className={`stat-card stat-alert-card ${statusFilter === 'overdue' && activeTab === 'loans' ? 'selected-stat' : ''}`}
          onClick={() => { setActiveTab('loans'); setStatusFilter('overdue'); }}
          style={{ cursor: 'pointer' }}
          title="Ver libros con retraso"
        >
          <div className="stat-icon red"><Icon name="alert" /></div>
          <span className="stat-chip danger-chip">
            {state.loanStats.overdueCount > 0 ? 'ATENCIÓN' : 'AL DÍA'}
          </span>
          <div className="stat-value" style={{ color: state.loanStats.overdueCount > 0 ? '#b91c1c' : 'inherit' }}>
            {state.loading ? '—' : state.loanStats.overdueCount}
          </div>
          <div className="stat-label">Libros con retraso / vencidos</div>
        </article>

        <article
          className={`stat-card ${activeTab === 'waitlist' ? 'selected-stat' : ''}`}
          onClick={() => { setActiveTab('waitlist'); }}
          style={{ cursor: 'pointer' }}
          title="Ver lista de espera"
        >
          <div className="stat-icon yellow"><Icon name="clock" /></div>
          <span className="stat-chip">RESERVA 24H</span>
          <div className="stat-value">{state.loading ? '—' : state.loanStats.waitingCount}</div>
          <div className="stat-label">En lista de espera</div>
        </article>

        <article
          className={`stat-card ${statusFilter === 'returned' && activeTab === 'loans' ? 'selected-stat' : ''}`}
          onClick={() => { setActiveTab('loans'); setStatusFilter('returned'); }}
          style={{ cursor: 'pointer' }}
          title="Ver histórico de devueltos"
        >
          <div className="stat-icon green"><Icon name="check" /></div>
          <span className="stat-chip">HISTÓRICO</span>
          <div className="stat-value">{state.loading ? '—' : state.loanStats.returnedCount}</div>
          <div className="stat-label">Libros devueltos</div>
        </article>
      </div>

      {/* Panel Principal */}
      <section className="panel data-panel" style={{ marginTop: '20px' }}>
        {/* Barra de pestañas */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--line, #e5ddd1)',
          padding: '0 20px',
          gap: '24px',
          background: 'rgba(255,255,255,0.5)'
        }}>
          <button
            type="button"
            onClick={() => { setActiveTab('loans'); }}
            style={{
              padding: '16px 4px',
              border: 0,
              background: 'transparent',
              fontWeight: activeTab === 'loans' ? 700 : 500,
              color: activeTab === 'loans' ? 'var(--accent, #4c8491)' : 'var(--muted, #817d76)',
              borderBottom: activeTab === 'loans' ? '3px solid var(--accent, #4c8491)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Icon name="loan" />
            <span>Registro de Préstamos ({state.loans.length})</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('waitlist'); }}
            style={{
              padding: '16px 4px',
              border: 0,
              background: 'transparent',
              fontWeight: activeTab === 'waitlist' ? 700 : 500,
              color: activeTab === 'waitlist' ? 'var(--accent, #4c8491)' : 'var(--muted, #817d76)',
              borderBottom: activeTab === 'waitlist' ? '3px solid var(--accent, #4c8491)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Icon name="clock" />
            <span>Lista de Espera ({state.waitlist.length})</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('catalog'); }}
            style={{
              padding: '16px 4px',
              border: 0,
              background: 'transparent',
              fontWeight: activeTab === 'catalog' ? 700 : 500,
              color: activeTab === 'catalog' ? 'var(--accent, #4c8491)' : 'var(--muted, #817d76)',
              borderBottom: activeTab === 'catalog' ? '3px solid var(--accent, #4c8491)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Icon name="book" />
            <span>Disponibilidad de Catálogo ({activeBooks.length})</span>
          </button>
        </div>

        {/* Barra de herramientas / Búsqueda y Filtros */}
        <div className="table-toolbar" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2>
              {activeTab === 'loans' && 'Préstamos Registrados'}
              {activeTab === 'waitlist' && 'Usuarios en Lista de Espera'}
              {activeTab === 'catalog' && 'Catálogo y Disponibilidad'}
            </h2>
            <p>
              {activeTab === 'loans' && (
                statusFilter === 'all' ? 'Mostrando todos los préstamos' :
                statusFilter === 'active' ? 'Filtrando préstamos activos' :
                statusFilter === 'overdue' ? 'Filtrando libros con fecha de vencimiento superada' :
                'Filtrando devoluciones procesadas'
              )}
              {activeTab === 'waitlist' && 'Reservas para libros agotados con notificación de 24 horas.'}
              {activeTab === 'catalog' && 'Consulte ejemplares disponibles para préstamo inmediato o lista de espera.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {activeTab === 'loans' && (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className={`button ${statusFilter === 'all' ? 'button-primary' : 'button-secondary'}`}
                  style={{ minHeight: '34px', padding: '0 10px', fontSize: '12px' }}
                  onClick={() => setStatusFilter('all')}
                >
                  Todos
                </button>
                <button
                  type="button"
                  className={`button ${statusFilter === 'active' ? 'button-primary' : 'button-secondary'}`}
                  style={{ minHeight: '34px', padding: '0 10px', fontSize: '12px' }}
                  onClick={() => setStatusFilter('active')}
                >
                  Activos ({state.loanStats.activeCount})
                </button>
                <button
                  type="button"
                  className={`button ${statusFilter === 'overdue' ? 'button-primary' : 'button-secondary'}`}
                  style={{ minHeight: '34px', padding: '0 10px', fontSize: '12px', color: statusFilter !== 'overdue' && state.loanStats.overdueCount > 0 ? '#b91c1c' : '' }}
                  onClick={() => setStatusFilter('overdue')}
                >
                  Vencidos ({state.loanStats.overdueCount})
                </button>
                <button
                  type="button"
                  className={`button ${statusFilter === 'returned' ? 'button-primary' : 'button-secondary'}`}
                  style={{ minHeight: '34px', padding: '0 10px', fontSize: '12px' }}
                  onClick={() => setStatusFilter('returned')}
                >
                  Devueltos ({state.loanStats.returnedCount})
                </button>
              </div>
            )}

            <label className="search-box">
              <Icon name="search" />
              <input
                type="search"
                placeholder={
                  activeTab === 'loans' ? 'Buscar por libro, lector o código' :
                  activeTab === 'waitlist' ? 'Buscar por título o usuario' :
                  'Buscar por título, autor o ISBN'
                }
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* TAB 1: REGISTRO DE PRÉSTAMOS */}
        {activeTab === 'loans' && (
          state.loading ? (
            <div className="table-message">Cargando préstamos…</div>
          ) : filteredLoans.length ? (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>LIBRO</th>
                    <th>LECTOR / VISITANTE</th>
                    <th>FECHA PRÉSTAMO</th>
                    <th>FECHA VENCIMIENTO</th>
                    <th>ESTADO</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoans.map(loan => {
                    const isOverdue = loan.status === 'overdue';
                    const isReturned = loan.status === 'returned';
                    const dueDateObj = new Date(loan.dueDate);
                    const isPast = dueDateObj < new Date();

                    return (
                      <tr key={loan._id} style={{ background: isOverdue ? 'rgba(254, 242, 242, 0.6)' : '' }}>
                        <td>
                          <strong>{loan.bookTitle || loan.book?.title}</strong>
                          {loan.book?.author && <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{loan.book.author}</div>}
                          {loan.book?.isbn && <div style={{ fontSize: '11px', color: '#9aa7a6' }}>ISBN: {loan.book.isbn}</div>}
                        </td>
                        <td>
                          <PersonCell
                            name={loan.userName}
                            detail={`Código: ${loan.userCode || '—'}`}
                          />
                        </td>
                        <td>{formatDate(loan.loanDate)}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <strong style={{ color: isOverdue ? '#b91c1c' : 'inherit' }}>
                              {formatDate(loan.dueDate)}
                            </strong>
                            {!isReturned && (
                              <small style={{ color: isOverdue ? '#dc2626' : '#64748b', fontWeight: isOverdue ? 600 : 400 }}>
                                {isOverdue ? '¡Plazo vencido!' : 'En plazo regular'}
                              </small>
                            )}
                            {isReturned && (
                              <small style={{ color: '#16a34a' }}>Devuelto el {formatDate(loan.returnDate)}</small>
                            )}
                          </div>
                        </td>
                        <td>
                          {isOverdue && (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '4px 9px',
                              borderRadius: '20px',
                              background: '#fee2e2',
                              color: '#991b1b',
                              fontSize: '11px',
                              fontWeight: 700
                            }}>
                              <Icon name="alert" /> CON RETRASO
                            </span>
                          )}
                          {loan.status === 'active' && (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '4px 9px',
                              borderRadius: '20px',
                              background: '#e0f2fe',
                              color: '#0369a1',
                              fontSize: '11px',
                              fontWeight: 700
                            }}>
                              <Icon name="clock" /> ACTIVO
                            </span>
                          )}
                          {isReturned && (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '4px 9px',
                              borderRadius: '20px',
                              background: '#dcfce7',
                              color: '#15803d',
                              fontSize: '11px',
                              fontWeight: 700
                            }}>
                              <Icon name="check" /> DEVUELTO
                            </span>
                          )}
                        </td>
                        <td>
                          {!isReturned ? (
                            <button
                              type="button"
                              className="button button-secondary"
                              style={{
                                minHeight: '32px',
                                padding: '0 10px',
                                fontSize: '12px',
                                background: isOverdue ? '#fef2f2' : '',
                                borderColor: isOverdue ? '#fca5a5' : ''
                              }}
                              onClick={() => handleReturn(loan)}
                              title="Registrar devolución de ejemplar"
                            >
                              <Icon name="check" />
                              <span>Devolver</span>
                            </button>
                          ) : (
                            <span style={{ color: 'var(--muted)', fontSize: '12px' }}>Completado</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon="loan"
              title={search ? 'No encontramos préstamos con ese criterio' : 'No hay préstamos para mostrar'}
            >
              {search
                ? 'Intenta con otro título, código de usuario o nombre.'
                : 'Utiliza el botón "+ Nuevo préstamo" para registrar una salida del catálogo.'}
            </EmptyState>
          )
        )}

        {/* TAB 2: LISTA DE ESPERA (RESERVA DE 24 HORAS) */}
        {activeTab === 'waitlist' && (
          state.loading ? (
            <div className="table-message">Cargando lista de espera…</div>
          ) : filteredWaitlist.length ? (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>TURNO / PRIORIDAD</th>
                    <th>LIBRO SOLICITADO</th>
                    <th>USUARIO EN ESPERA</th>
                    <th>FECHA DE SOLICITUD</th>
                    <th>ESTADO Y VENTANA</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWaitlist.map(waitItem => {
                    const isNotified = waitItem.status === 'notified';
                    return (
                      <tr key={waitItem._id}>
                        <td>
                          <span style={{
                            display: 'inline-grid',
                            placeItems: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: isNotified ? '#fef08a' : '#f1f5f9',
                            color: isNotified ? '#854d0e' : '#334155',
                            fontWeight: 700,
                            fontSize: '13px'
                          }}>
                            #{waitItem.priority || 1}
                          </span>
                        </td>
                        <td>
                          <strong>{waitItem.bookTitle}</strong>
                          {waitItem.book?.author && <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{waitItem.book.author}</div>}
                        </td>
                        <td>
                          <PersonCell
                            name={waitItem.userName}
                            detail={`Código: ${waitItem.userCode || '—'} · ${waitItem.userEmail || ''}`}
                          />
                        </td>
                        <td>{formatDate(waitItem.requestDate)}</td>
                        <td>
                          {isNotified ? (
                            <div>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '4px 9px',
                                borderRadius: '20px',
                                background: '#fef3c7',
                                color: '#92400e',
                                fontSize: '11px',
                                fontWeight: 700
                              }}>
                                <Icon name="clock" /> DISPONIBLE (VENTANA 24H)
                              </span>
                              {waitItem.expiresAt && (
                                <div style={{ fontSize: '11px', color: '#b45309', marginTop: '3px' }}>
                                  Vence reserva: {formatDate(waitItem.expiresAt)}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '4px 9px',
                              borderRadius: '20px',
                              background: '#f1f5f9',
                              color: '#475569',
                              fontSize: '11px',
                              fontWeight: 700
                            }}>
                              EN ESPERA DE EJEMPLAR
                            </span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              className="button button-primary"
                              style={{ minHeight: '30px', padding: '0 8px', fontSize: '11px' }}
                              onClick={() => {
                                setSelectedBookId(waitItem.book?._id || waitItem.book);
                                setUserCodeInput(waitItem.userCode);
                                setLoanDays('7');
                                loanModalRef.current?.showModal();
                              }}
                              title="Apartar o formalizar préstamo de libro"
                            >
                              Apartar libro
                            </button>
                            <button
                              type="button"
                              className="button button-quiet"
                              style={{ minHeight: '30px', padding: '0 8px', fontSize: '11px', color: '#b91c1c' }}
                              onClick={() => handleCancelWaitlist(waitItem)}
                              title="Cancelar turno en lista de espera"
                            >
                              Cancelar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon="clock"
              title="No hay solicitudes en lista de espera"
            >
              Cuando un libro tenga 0 ejemplares disponibles, podrá incorporar visitantes a la lista de espera con notificación automática de 24 horas.
            </EmptyState>
          )
        )}

        {/* TAB 3: DISPONIBILIDAD DEL CATÁLOGO */}
        {activeTab === 'catalog' && (
          state.loading ? (
            <div className="table-message">Cargando catálogo…</div>
          ) : filteredCatalog.length ? (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>TÍTULO Y AUTOR</th>
                    <th>GÉNERO / CATEGORÍA</th>
                    <th>UBICACIÓN</th>
                    <th>TOTAL EJEMPLARES</th>
                    <th>DISPONIBLES</th>
                    <th>ESTADO</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCatalog.map(book => {
                    const isAvailable = book.availableCopies > 0;
                    return (
                      <tr key={book._id}>
                        <td>
                          <strong>{book.title}</strong>
                          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{book.author}</div>
                          {book.isbn && <div style={{ fontSize: '11px', color: '#9aa7a6' }}>ISBN: {book.isbn}</div>}
                        </td>
                        <td>
                          <span style={{
                            padding: '3px 8px',
                            background: '#f5f0e7',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 600
                          }}>
                            {book.category}
                          </span>
                        </td>
                        <td>{book.location || 'Estantería General'}</td>
                        <td><strong>{book.totalCopies}</strong></td>
                        <td>
                          <strong style={{ color: isAvailable ? '#15803d' : '#b91c1c', fontSize: '15px' }}>
                            {book.availableCopies}
                          </strong>
                        </td>
                        <td>
                          {isAvailable ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '4px 9px',
                              borderRadius: '20px',
                              background: '#dcfce7',
                              color: '#15803d',
                              fontSize: '11px',
                              fontWeight: 700
                            }}>
                              <Icon name="check" /> DISPONIBLE ({book.availableCopies})
                            </span>
                          ) : (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '4px 9px',
                              borderRadius: '20px',
                              background: '#fee2e2',
                              color: '#991b1b',
                              fontSize: '11px',
                              fontWeight: 700
                            }}>
                              <Icon name="clock" /> AGOTADO
                            </span>
                          )}
                        </td>
                        <td>
                          {isAvailable ? (
                            <button
                              type="button"
                              className="button button-primary"
                              style={{ minHeight: '32px', padding: '0 10px', fontSize: '12px' }}
                              onClick={() => openLoanModal(book._id)}
                            >
                              <Icon name="loan" />
                              <span>Prestar</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="button button-secondary"
                              style={{ minHeight: '32px', padding: '0 10px', fontSize: '12px' }}
                              onClick={() => openWaitlistModal(book._id)}
                            >
                              <Icon name="clock" />
                              <span>Lista de espera</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState icon="book" title="No se encontraron libros en el catálogo">
              Prueba con otro término de búsqueda.
            </EmptyState>
          )
        )}
      </section>

      {/* MODAL: NUEVO PRÉSTAMO */}
      <dialog className="modal" ref={loanModalRef}>
        <form className="modal-card" onSubmit={submitLoan} ref={loanFormRef}>
          <div className="modal-heading">
            <div>
              <div className="eyebrow">ADMINISTRACIÓN DE PRÉSTAMOS</div>
              <h2>Registrar nuevo préstamo</h2>
            </div>
            <button
              className="icon-button"
              onClick={() => loanModalRef.current?.close()}
              type="button"
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>

          <p className="modal-description">
            Seleccione el libro y vincule el código único del usuario. Se descontará automáticamente del inventario y se calculará la fecha de vencimiento.
          </p>

          {formError && (
            <div className="alert alert-error" role="alert">
              <Icon name="alert" />
              <span>{formError}</span>
              <button className="alert-dismiss" onClick={() => setFormError('')} type="button" aria-label="Cerrar">×</button>
            </div>
          )}

          <div className="form-grid">
            {/* Selector de libro */}
            <div className="form-field form-field-wide">
              <label htmlFor="loan-book">Libro a prestar *</label>
              <select
                id="loan-book"
                value={selectedBookId}
                onChange={e => setSelectedBookId(e.target.value)}
                required
                style={{
                  height: '46px',
                  padding: '0 12px',
                  border: '1px solid #e3e8e7',
                  borderRadius: '8px',
                  background: 'white'
                }}
              >
                <option value="">-- Seleccione un libro del catálogo --</option>
                {activeBooks.map(book => (
                  <option
                    key={book._id}
                    value={book._id}
                    disabled={book.availableCopies === 0}
                  >
                    {book.title} ({book.author}) — {book.availableCopies > 0 ? `${book.availableCopies} disponibles` : 'AGOTADO'}
                  </option>
                ))}
              </select>
            </div>

            {selectedBook && selectedBook.availableCopies === 0 && (
              <div className="form-field form-field-wide">
                <div className="alert alert-error">
                  <Icon name="alert" />
                  <span>Este título está agotado. Debe utilizar la opción de Lista de Espera.</span>
                </div>
              </div>
            )}

            {/* Código de usuario */}
            <div className="form-field">
              <label htmlFor="loan-user-code">Código del usuario (4 dígitos) *</label>
              <input
                id="loan-user-code"
                placeholder="Ej. 1001"
                maxLength="4"
                value={userCodeInput}
                onChange={e => setUserCodeInput(e.target.value)}
                required
              />
            </div>

            {/* Vista previa de usuario */}
            <div className="form-field">
              <label>Lector verificado</label>
              <div style={{
                height: '46px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                background: matchedUser ? '#f0fdf4' : '#f8fafc',
                border: matchedUser ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '13px'
              }}>
                {matchedUser ? (
                  <span style={{ color: '#166534', fontWeight: 600 }}>
                    ✓ {matchedUser.name} {matchedUser.lastName} ({matchedUser.cedula})
                  </span>
                ) : userCodeInput.length === 4 ? (
                  <span style={{ color: '#dc2626' }}>Usuario no encontrado</span>
                ) : (
                  <span style={{ color: '#94a3b8' }}>Ingrese el código de 4 dígitos</span>
                )}
              </div>
            </div>

            {/* Duración del préstamo */}
            <div className="form-field">
              <label htmlFor="loan-days">Duración del préstamo *</label>
              <select
                id="loan-days"
                value={loanDays}
                onChange={e => setLoanDays(e.target.value)}
                style={{
                  height: '46px',
                  padding: '0 12px',
                  border: '1px solid #e3e8e7',
                  borderRadius: '8px',
                  background: 'white'
                }}
              >
                <option value="7">7 días (1 semana)</option>
                <option value="14">14 días (2 semanas - Estándar)</option>
                <option value="21">21 días (3 semanas)</option>
                <option value="30">30 días (1 mes)</option>
              </select>
            </div>

            {/* Fecha estimada de vencimiento */}
            <div className="form-field">
              <label>Vencimiento calculado</label>
              <div style={{
                height: '46px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--accent)'
              }}>
                {formatDate(new Date(Date.now() + (Number(loanDays) || 7) * 24 * 60 * 60 * 1000))}
              </div>
            </div>

            {/* Notas opcionales */}
            <div className="form-field form-field-wide">
              <label htmlFor="loan-notes">Observaciones / Notas adicionales</label>
              <input
                id="loan-notes"
                name="notes"
                placeholder="Ej. Ejemplar en buen estado, incluye estuche."
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              className="button button-quiet"
              onClick={() => loanModalRef.current?.close()}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="button button-primary"
              type="submit"
              disabled={saving || (selectedBook && selectedBook.availableCopies === 0)}
            >
              {saving ? 'Registrando…' : 'Confirmar y prestar libro'}
            </button>
          </div>
        </form>
      </dialog>

      {/* MODAL: AGREGAR A LISTA DE ESPERA */}
      <dialog className="modal" ref={waitlistModalRef}>
        <form className="modal-card" onSubmit={submitWaitlist} ref={waitlistFormRef}>
          <div className="modal-heading">
            <div>
              <div className="eyebrow">RESERVA Y LISTA DE ESPERA</div>
              <h2>Incorporar a lista de espera</h2>
            </div>
            <button
              className="icon-button"
              onClick={() => waitlistModalRef.current?.close()}
              type="button"
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>

          <p className="modal-description">
            Si el libro está agotado o reservado, se notificará al usuario en cuanto se reciba una devolución. Contará con <strong>24 horas para apartarlo</strong> antes de ceder el turno al siguiente.
          </p>

          {formError && (
            <div className="alert alert-error" role="alert">
              <Icon name="alert" />
              <span>{formError}</span>
              <button className="alert-dismiss" onClick={() => setFormError('')} type="button" aria-label="Cerrar">×</button>
            </div>
          )}

          <div className="form-grid">
            <div className="form-field form-field-wide">
              <label htmlFor="wait-book">Libro solicitado *</label>
              <select
                id="wait-book"
                value={selectedBookId}
                onChange={e => setSelectedBookId(e.target.value)}
                required
                style={{
                  height: '46px',
                  padding: '0 12px',
                  border: '1px solid #e3e8e7',
                  borderRadius: '8px',
                  background: 'white'
                }}
              >
                <option value="">-- Seleccione un libro --</option>
                {activeBooks.map(book => (
                  <option key={book._id} value={book._id}>
                    {book.title} ({book.author}) — {book.availableCopies === 0 ? 'AGOTADO (Prioridad en espera)' : `${book.availableCopies} disponibles`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="wait-user-code">Código del usuario (4 dígitos) *</label>
              <input
                id="wait-user-code"
                placeholder="Ej. 1003"
                maxLength="4"
                value={userCodeInput}
                onChange={e => setUserCodeInput(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label>Lector verificado</label>
              <div style={{
                height: '46px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                background: matchedUser ? '#f0fdf4' : '#f8fafc',
                border: matchedUser ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '13px'
              }}>
                {matchedUser ? (
                  <span style={{ color: '#166534', fontWeight: 600 }}>
                    ✓ {matchedUser.name} {matchedUser.lastName} ({matchedUser.email})
                  </span>
                ) : userCodeInput.length === 4 ? (
                  <span style={{ color: '#dc2626' }}>Usuario no encontrado</span>
                ) : (
                  <span style={{ color: '#94a3b8' }}>Ingrese el código de 4 dígitos</span>
                )}
              </div>
            </div>

            <div className="form-field form-field-wide">
              <label htmlFor="wait-notes">Motivo o notas de la reserva</label>
              <input
                id="wait-notes"
                name="notes"
                placeholder="Ej. Urgente para entrega de tesis."
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              className="button button-quiet"
              onClick={() => waitlistModalRef.current?.close()}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="button button-primary"
              type="submit"
              disabled={saving}
            >
              {saving ? 'Guardando turno…' : 'Añadir a lista de espera'}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
