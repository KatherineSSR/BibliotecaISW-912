import React, { useEffect, useState } from 'react';
import { request, formatDateTime, formatTime } from '../core.js';
import { EmptyState, Icon, Notice, PageAlert, PageHeading, PersonCell } from '../components.jsx';

export default function AccessPage() {
  const [userCode, setUserCode] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [accessHistory, setAccessHistory] = useState([]);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await request('/api/access?limit=30');
      setAccessHistory(res.data || []);
    } catch (err) {
      console.error('Error al cargar historial de accesos:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    const cleanCode = userCode.trim();
    if (!cleanCode) {
      setError('Por favor ingresa un código de usuario.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await request('/api/access/check-in', {
        method: 'POST',
        body: JSON.stringify({
          userCode: cleanCode,
          notes: notes.trim()
        })
      });

      setSuccessMessage(res.message || 'Ingreso registrado correctamente.');
      setLastCheckIn(res.data);
      setUserCode('');
      setNotes('');
      await fetchHistory();
    } catch (err) {
      setError(err.message || 'No se pudo registrar el ingreso.');
      setLastCheckIn(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeading
        eyebrow="CONTROL DE ENTRADA"
        title="Control de acceso (Check-in)"
        actions={
          <button
            className="button button-outline"
            onClick={fetchHistory}
            disabled={loadingHistory}
            type="button"
            title="Actualizar bitácora"
          >
            <Icon name="clock" />
            <span>{loadingHistory ? 'Cargando…' : 'Refrescar'}</span>
          </button>
        }
      >
        Registra el ingreso de visitantes a las instalaciones mediante su código único de 4 dígitos.
      </PageHeading>

      <PageAlert message={error} onClose={() => setError('')} />
      <Notice message={successMessage} onClose={() => setSuccessMessage('')} />

      {lastCheckIn && (
        <section className="panel" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #38a169', background: '#f0fff4' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: '#38a169', color: 'white', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="check" />
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#22543d' }}>
                  {lastCheckIn.user?.name} {lastCheckIn.user?.lastName}
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#276749' }}>
                  Cédula: <strong>{lastCheckIn.user?.cedula || '—'}</strong> · Código: <strong className="code-tag">{lastCheckIn.user?.userCode}</strong>
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.85rem', color: '#4a5568' }}>Hora de ingreso registrada</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#2d3748' }}>
                {formatTime(lastCheckIn.entryTime)}
              </div>
            </div>
          </div>
        </section>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Tarjeta de Check-In */}
        <section className="panel">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Icon name="id" />
            <span>Registrar entrada</span>
          </h2>
          <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Ingresa los 4 dígitos asignados al usuario en su registro o correo de bienvenida.
          </p>

          <form onSubmit={handleCheckIn}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="userCode" style={{ display: 'block', fontWeight: '600', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                Código de usuario (4 dígitos) *
              </label>
              <div className="input-wrap" style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  id="userCode"
                  type="text"
                  maxLength="4"
                  placeholder="Ej: 1042"
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value.replace(/\D/g, ''))}
                  style={{ fontSize: '1.4rem', letterSpacing: '4px', textAlign: 'center', fontWeight: 'bold' }}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="accessNotes" style={{ display: 'block', fontWeight: '600', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                Observaciones (opcional)
              </label>
              <div className="input-wrap">
                <input
                  id="accessNotes"
                  type="text"
                  placeholder="Ej: Consulta sala general, evento, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength="120"
                />
              </div>
            </div>

            <button
              className="button button-primary"
              type="submit"
              disabled={submitting || !userCode.trim()}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Icon name="check" />
              <span>{submitting ? 'Verificando código…' : 'Registrar ingreso'}</span>
            </button>
          </form>
        </section>

        {/* Resumen rápido de la bitácora */}
        <section className="panel">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Icon name="clock" />
            <span>Últimos ingresos</span>
          </h2>
          <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '1rem' }}>
            {accessHistory.length} registros recientes en bitácora.
          </p>

          {loadingHistory && !accessHistory.length ? (
            <div className="table-message">Cargando bitácora…</div>
          ) : accessHistory.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
              {accessHistory.slice(0, 5).map((acc) => (
                <div
                  key={acc._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: '#f7fafc',
                    border: '1px solid #edf2f7'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.92rem' }}>
                      {acc.userName || acc.user?.name || 'Visitante'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#718096' }}>
                      Código: <strong className="code-tag">{acc.userCode}</strong>
                      {acc.notes ? ` · ${acc.notes}` : ''}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#4a5568' }}>
                    {formatTime(acc.entryTime)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="access" title="Sin accesos registrados">
              Los ingresos registrados mediante código aparecerán aquí.
            </EmptyState>
          )}
        </section>
      </div>

      {/* Bitácora completa */}
      <section className="panel data-panel">
        <div className="table-toolbar">
          <div>
            <h2>Bitácora general de accesos</h2>
            <p>Registro histórico detallado de ingresos a la biblioteca</p>
          </div>
        </div>

        {loadingHistory ? (
          <div className="table-message">Cargando registros…</div>
        ) : accessHistory.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>USUARIO</th>
                  <th>CÉDULA</th>
                  <th>CÓDIGO</th>
                  <th>FECHA Y HORA</th>
                  <th>OBSERVACIONES</th>
                </tr>
              </thead>
              <tbody>
                {accessHistory.map((acc) => {
                  const u = acc.user || {};
                  return (
                    <tr key={acc._id}>
                      <td>
                        <PersonCell
                          name={acc.userName || `${u.name || ''} ${u.lastName || ''}`.trim() || 'Visitante'}
                          detail={u.email || ''}
                        />
                      </td>
                      <td>{u.cedula || '—'}</td>
                      <td>
                        <span className="code-tag">{acc.userCode || '—'}</span>
                      </td>
                      <td>{formatDateTime(acc.entryTime)}</td>
                      <td>{acc.notes || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon="access" title="No hay accesos registrados">
            Cuando un usuario realice check-in con su código, el registro se mostrará en esta tabla.
          </EmptyState>
        )}
      </section>
    </>
  );
}
