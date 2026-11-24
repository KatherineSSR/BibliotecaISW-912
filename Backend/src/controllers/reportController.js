const Access = require('../models/Access');
const Loan = require('../models/Loan');

/**
 * Calcula la fecha de inicio según el período solicitado
 */
function getStartDate(period) {
    const now = new Date();
    switch (period) {
        case 'biweekly':
            now.setDate(now.getDate() - 15);
            break;
        case 'monthly':
            now.setDate(now.getDate() - 30);
            break;
        case 'weekly':
        default:
            now.setDate(now.getDate() - 7);
    }
    now.setHours(0, 0, 0, 0);
    return now;
}

/**
 * Etiqueta legible del período
 */
function getPeriodLabel(period) {
    switch (period) {
        case 'biweekly': return 'Quincenal (últimos 15 días)';
        case 'monthly':  return 'Mensual (últimos 30 días)';
        default:         return 'Semanal (últimos 7 días)';
    }
}

/**
 * Convierte una fecha a string YYYY-MM-DD en zona local
 */
function toDateKey(date) {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

/**
 * Genera un array de fechas entre start y now
 */
function buildDateRange(startDate) {
    const days = [];
    const cursor = new Date(startDate);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    while (cursor <= end) {
        days.push(toDateKey(cursor));
        cursor.setDate(cursor.getDate() + 1);
    }
    return days;
}

/**
 * GET /api/reports/access?period=weekly|biweekly|monthly
 * Reporte 1: Total de visitantes ingresados por check-in en el período
 */
const getAccessReport = async (req, res) => {
    try {
        const period = req.query.period || 'weekly';
        const startDate = getStartDate(period);
        const endDate = new Date();

        const accesses = await Access.find({
            entryTime: { $gte: startDate, $lte: endDate }
        }).sort({ entryTime: 1 });

        // Agrupar por día
        const countByDay = {};
        for (const a of accesses) {
            const key = toDateKey(a.entryTime);
            countByDay[key] = (countByDay[key] || 0) + 1;
        }

        const allDays = buildDateRange(startDate);
        const dailyBreakdown = allDays.map(date => ({
            date,
            count: countByDay[date] || 0
        }));

        return res.status(200).json({
            success: true,
            period,
            periodLabel: getPeriodLabel(period),
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            generatedAt: new Date().toISOString(),
            totalVisitors: accesses.length,
            dailyBreakdown
        });
    } catch (error) {
        console.error('Error al generar reporte de accesos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al generar el reporte de accesos.',
            error: error.message
        });
    }
};

/**
 * GET /api/reports/loans?period=weekly|biweekly|monthly
 * Reporte 2: Préstamos realizados, devueltos y en mora/vencidos
 */
const getLoansReport = async (req, res) => {
    try {
        const period = req.query.period || 'weekly';
        const startDate = getStartDate(period);
        const endDate = new Date();

        // Sincronizar préstamos vencidos antes de reportar
        await Loan.updateMany(
            { status: 'active', dueDate: { $lt: new Date() } },
            { $set: { status: 'overdue' } }
        );

        const loans = await Loan.find({
            loanDate: { $gte: startDate, $lte: endDate }
        }).sort({ loanDate: 1 });

        // Contadores por estado
        let totalLoans = loans.length;
        let returned = 0;
        let overdue = 0;
        let active = 0;

        // Agrupar préstamos por día
        const countByDay = {};
        // Top libros
        const bookCount = {};

        for (const loan of loans) {
            if (loan.status === 'returned') returned++;
            else if (loan.status === 'overdue') overdue++;
            else active++;

            const key = toDateKey(loan.loanDate);
            countByDay[key] = (countByDay[key] || 0) + 1;

            if (loan.bookTitle) {
                bookCount[loan.bookTitle] = (bookCount[loan.bookTitle] || 0) + 1;
            }
        }

        const allDays = buildDateRange(startDate);
        const dailyBreakdown = allDays.map(date => ({
            date,
            count: countByDay[date] || 0
        }));

        // Top 5 libros más prestados
        const topBooks = Object.entries(bookCount)
            .map(([title, count]) => ({ title, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return res.status(200).json({
            success: true,
            period,
            periodLabel: getPeriodLabel(period),
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            generatedAt: new Date().toISOString(),
            totalLoans,
            returned,
            overdue,
            active,
            dailyBreakdown,
            topBooks
        });
    } catch (error) {
        console.error('Error al generar reporte de préstamos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al generar el reporte de préstamos.',
            error: error.message
        });
    }
};

module.exports = { getAccessReport, getLoansReport };
