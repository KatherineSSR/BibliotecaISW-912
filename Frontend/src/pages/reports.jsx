import React, { useState } from 'react';
import { state, request } from '../core.js';
import { Icon } from '../components.jsx';

// ─── Loader ──────────────────────────────────────────────────────────────────

export async function loadReports() {
  const period = state.reportPeriod || 'weekly';
  const [accessData, loansData] = await Promise.all([
    request(`/api/reports/access?period=${period}`),
    request(`/api/reports/loans?period=${period}`)
  ]);
  state.reportAccess = accessData;
  state.reportLoans  = loansData;
  state.reportPeriod = period;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('es-CR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
}

function formatDateShort(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function formatDateTime(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleString('es-CR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

const PERIODS = [
  { value: 'weekly',   label: 'Semanal',   sub: '7 días' },
  { value: 'biweekly', label: 'Quincenal', sub: '15 días' },
  { value: 'monthly',  label: 'Mensual',   sub: '30 días' }
];

// ─── Bar chart simple con CSS ─────────────────────────────────────────────────

function MiniBarChart({ data, colorClass }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="report-chart">
      {data.map(({ date, count }) => (
        <div key={date} className="report-bar-col" title={`${formatDateShort(date)}: ${count}`}>
          <div
            className={`report-bar ${colorClass}`}
            style={{ height: `${Math.round((count / max) * 100)}%` }}
          />
          <span className="report-bar-label">{count}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Reporte de Accesos ───────────────────────────────────────────────────────

function ReporteAccesos({ data }) {
  if (!data) return null;
  return (
    <section className="report-section" id="report-access">
      <div className="report-section-header">
        <div className="report-section-icon access-icon">
          <Icon name="access" />
        </div>
        <div>
          <h3 className="report-section-title">Reporte de Accesos</h3>
          <p className="report-section-sub">Visitantes ingresados por check-in · {data.periodLabel}</p>
        </div>
      </div>

      <div className="report-kpi-row">
        <div className="report-kpi primary">
          <span className="report-kpi-value">{data.totalVisitors}</span>
          <span className="report-kpi-label">Total de visitantes</span>
        </div>
        <div className="report-kpi neutral">
          <span className="report-kpi-value">{formatDate(data.startDate)}</span>
          <span className="report-kpi-label">Desde</span>
        </div>
        <div className="report-kpi neutral">
          <span className="report-kpi-value">{formatDate(data.endDate)}</span>
          <span className="report-kpi-label">Hasta</span>
        </div>
      </div>

      <h4 className="report-chart-title">Visitantes por día</h4>
      <MiniBarChart data={data.dailyBreakdown} colorClass="bar-access" />

      <div className="report-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th className="text-right">Visitantes</th>
            </tr>
          </thead>
          <tbody>
            {data.dailyBreakdown.map(({ date, count }) => (
              <tr key={date}>
                <td>{formatDateShort(date)}</td>
                <td className="text-right">{count}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td><strong>Total</strong></td>
              <td className="text-right"><strong>{data.totalVisitors}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

// ─── Reporte de Préstamos ─────────────────────────────────────────────────────

function ReportePrestamos({ data }) {
  if (!data) return null;
  return (
    <section className="report-section" id="report-loans">
      <div className="report-section-header">
        <div className="report-section-icon loan-icon">
          <Icon name="loan" />
        </div>
        <div>
          <h3 className="report-section-title">Reporte de Préstamos de Libros</h3>
          <p className="report-section-sub">Préstamos registrados · {data.periodLabel}</p>
        </div>
      </div>

      <div className="report-kpi-row">
        <div className="report-kpi primary">
          <span className="report-kpi-value">{data.totalLoans}</span>
          <span className="report-kpi-label">Total préstamos</span>
        </div>
        <div className="report-kpi success">
          <span className="report-kpi-value">{data.returned}</span>
          <span className="report-kpi-label">Devueltos</span>
        </div>
        <div className="report-kpi warning">
          <span className="report-kpi-value">{data.active}</span>
          <span className="report-kpi-label">Activos</span>
        </div>
        <div className="report-kpi danger">
          <span className="report-kpi-value">{data.overdue}</span>
          <span className="report-kpi-label">En mora / vencidos</span>
        </div>
      </div>

      <h4 className="report-chart-title">Préstamos por día</h4>
      <MiniBarChart data={data.dailyBreakdown} colorClass="bar-loans" />

      <div className="report-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th className="text-right">Préstamos</th>
            </tr>
          </thead>
          <tbody>
            {data.dailyBreakdown.map(({ date, count }) => (
              <tr key={date}>
                <td>{formatDateShort(date)}</td>
                <td className="text-right">{count}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td><strong>Total</strong></td>
              <td className="text-right"><strong>{data.totalLoans}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {data.topBooks && data.topBooks.length > 0 && (
        <>
          <h4 className="report-chart-title" style={{ marginTop: '1.5rem' }}>
            Libros más prestados en el período
          </h4>
          <div className="report-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Título</th>
                  <th className="text-right">Préstamos</th>
                </tr>
              </thead>
              <tbody>
                {data.topBooks.map((book, idx) => (
                  <tr key={book.title}>
                    <td>{idx + 1}</td>
                    <td>{book.title}</td>
                    <td className="text-right">{book.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

// ─── Pie de página del reporte (para impresión) ───────────────────────────────

function ReportFooter({ accessData, loansData, period }) {
  const label = PERIODS.find(p => p.value === period)?.label || '';
  const generatedAt = accessData?.generatedAt || loansData?.generatedAt;
  return (
    <div className="report-print-footer print-only">
      <hr />
      <div className="report-print-footer-row">
        <span>
          <strong>Biblioteca Pública de Ciudad Quesada</strong><br />
          Sistema de Gestión Bibliotecaria — Reporte {label}
        </span>
        <span>
          Período: {formatDate(accessData?.startDate)} al {formatDate(accessData?.endDate)}<br />
          Generado el: {formatDateTime(generatedAt)}
        </span>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [period, setPeriod]   = useState(state.reportPeriod || 'weekly');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [notice, setNotice]   = useState('');
  // rev fuerza re-render al llegar datos nuevos
  const [rev, setRev]         = useState(0);

  async function fetchReports(newPeriod) {
    setLoading(true);
    setError('');
    setNotice('');
    try {
      const [accessRes, loansRes] = await Promise.all([
        request(`/api/reports/access?period=${newPeriod}`),
        request(`/api/reports/loans?period=${newPeriod}`)
      ]);
      state.reportAccess = accessRes;
      state.reportLoans  = loansRes;
      state.reportPeriod = newPeriod;
      setPeriod(newPeriod);
      setRev(r => r + 1);
      setNotice('Reporte actualizado correctamente.');
    } catch (err) {
      setError(err.message || 'Error al cargar el reporte.');
    } finally {
      setLoading(false);
    }
  }

  // Si el loader de main.jsx ya llenó state, solo refrescamos rev.
  // Si no hay datos, disparamos la carga inicial.
  React.useEffect(() => {
    if (state.reportAccess || state.reportLoans) {
      setRev(r => r + 1); // datos ya listos
    } else {
      fetchReports(state.reportPeriod || 'weekly');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accessData = state.reportAccess;
  const loansData  = state.reportLoans;

  function handlePrint() {
    window.print();
  }

  return (
    <div className="page-container" id="reports-page">

      {/* Encabezado de impresión — solo visible al imprimir */}
      {(accessData || loansData) && (
        <div className="report-print-header print-only">
          <h1>Biblioteca Pública de Ciudad Quesada</h1>
          <p>Reporte de Accesos y Préstamos de Libros</p>
          <p><strong>Período:</strong> {formatDate(accessData?.startDate)} al {formatDate(accessData?.endDate)}</p>
          <p><strong>Generado el:</strong> {formatDateTime(accessData?.generatedAt || loansData?.generatedAt)}</p>
          <hr />
        </div>
      )}

      {/* Encabezado de pantalla */}
      <div className="page-header no-print">
        <div>
          <h2 className="page-title">
            <Icon name="report" /> Reportes del sistema
          </h2>
          <p className="page-subtitle">Estadísticas de accesos y préstamos por período</p>
        </div>
        <button className="button button-primary" onClick={handlePrint} type="button">
          <Icon name="download" /> Imprimir / Guardar PDF
        </button>
      </div>

      {/* Alertas */}
      {error && (
        <div className="alert alert-error no-print" role="alert">
          <Icon name="alert" />
          <span>{error}</span>
          <button
            className="alert-dismiss"
            onClick={() => setError('')}
            type="button"
            aria-label="Cerrar"
          >×</button>
        </div>
      )}
      {notice && (
        <div className="alert alert-success no-print" role="alert">
          <Icon name="check" />
          <span>{notice}</span>
          <button
            className="alert-dismiss"
            onClick={() => setNotice('')}
            type="button"
            aria-label="Cerrar"
          >×</button>
        </div>
      )}

      {/* Selector de período */}
      <div className="report-period-bar no-print">
        <span className="report-period-label">Período:</span>
        {PERIODS.map(p => (
          <button
            key={p.value}
            type="button"
            className={`button report-period-btn ${period === p.value ? 'button-primary' : 'button-secondary'}`}
            onClick={() => fetchReports(p.value)}
            disabled={loading}
          >
            {p.label} <small>({p.sub})</small>
          </button>
        ))}
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="page-loading no-print">
          <span>Cargando reporte…</span>
        </div>
      )}

      {/* Sin datos */}
      {!loading && !accessData && !loansData && !error && (
        <div className="empty-state no-print">
          <p>No hay datos disponibles para el período seleccionado.</p>
        </div>
      )}

      {/* Reportes */}
      {!loading && (
        <div className="reports-grid">
          <ReporteAccesos data={accessData} />
          <ReportePrestamos data={loansData} />
        </div>
      )}

      {/* Pie de página para impresión */}
      {!loading && (accessData || loansData) && (
        <ReportFooter accessData={accessData} loansData={loansData} period={period} />
      )}
    </div>
  );
}
