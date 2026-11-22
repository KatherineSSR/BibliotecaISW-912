const Loan = require('../models/Loan');
const Book = require('../models/Book');
const User = require('../models/User');
const Waitlist = require('../models/Waitlist');

/**
 * Sincronizar préstamos vencidos automáticamente
 */
const syncOverdueLoans = async () => {
    try {
        await Loan.updateMany(
            { status: 'active', dueDate: { $lt: new Date() } },
            { $set: { status: 'overdue' } }
        );
    } catch (err) {
        console.error('Error al sincronizar préstamos vencidos:', err);
    }
};

/**
 * Sincronizar entradas expiradas de la lista de espera (plazo de 24 horas)
 */
const syncExpiredWaitlist = async () => {
    try {
        const now = new Date();
        const expiredEntries = await Waitlist.find({
            status: 'notified',
            expiresAt: { $lt: now }
        });

        for (const entry of expiredEntries) {
            entry.status = 'expired';
            await entry.save();

            // Darle la oportunidad al siguiente en la lista de espera
            const nextInLine = await Waitlist.findOne({
                book: entry.book,
                status: 'waiting'
            }).sort({ priority: 1, createdAt: 1 });

            if (nextInLine) {
                nextInLine.status = 'notified';
                nextInLine.notifiedAt = new Date();
                nextInLine.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
                await nextInLine.save();
            }
        }
    } catch (err) {
        console.error('Error al sincronizar lista de espera:', err);
    }
};

/**
 * Registrar un nuevo préstamo de libro
 */
const createLoan = async (req, res) => {
    try {
        const { bookId, userCode, loanDays = 7, dueDate: customDueDate, notes } = req.body;

        if (!bookId) {
            return res.status(400).json({
                success: false,
                message: 'El identificador del libro es obligatorio.'
            });
        }

        if (!userCode || !String(userCode).trim()) {
            return res.status(400).json({
                success: false,
                message: 'El código de usuario es obligatorio.'
            });
        }

        // 1. Validar que el libro exista y tenga ejemplares disponibles
        const book = await Book.findById(bookId);
        if (!book || !book.isActive) {
            return res.status(404).json({
                success: false,
                message: 'El libro solicitado no existe o fue dado de baja.'
            });
        }

        if (book.availableCopies <= 0) {
            return res.status(400).json({
                success: false,
                message: 'No hay ejemplares disponibles de este libro. Puede agregar al usuario a la lista de espera.',
                outOfStock: true
            });
        }

        // 2. Validar que el usuario exista y esté activo
        const user = await User.findOne({
            userCode: String(userCode).trim(),
            isActive: true
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `No se encontró un usuario activo con el código "${userCode}".`
            });
        }

        // 3. Verificar si el usuario ya tiene este mismo libro en préstamo activo
        const existingActiveLoan = await Loan.findOne({
            user: user._id,
            book: book._id,
            status: { $in: ['active', 'overdue'] }
        });

        if (existingActiveLoan) {
            return res.status(400).json({
                success: false,
                message: `El usuario ya cuenta con un préstamo activo de este título ("${book.title}").`
            });
        }

        // 4. Calcular fechas de inicio y vencimiento automático
        const loanDate = new Date();
        let dueDate;

        if (customDueDate) {
            dueDate = new Date(customDueDate);
            if (Number.isNaN(dueDate.getTime()) || dueDate <= loanDate) {
                return res.status(400).json({
                    success: false,
                    message: 'La fecha de vencimiento debe ser posterior a la fecha de inicio del préstamo.'
                });
            }
        } else {
            const parsedDays = Number(loanDays) || 7;
            dueDate = new Date(loanDate.getTime() + parsedDays * 24 * 60 * 60 * 1000);
        }

        // 5. Crear el préstamo y descontar ejemplar disponible
        const newLoan = new Loan({
            book: book._id,
            user: user._id,
            userCode: user.userCode,
            userName: `${user.name} ${user.lastName}`.trim(),
            bookTitle: book.title,
            loanDate,
            dueDate,
            status: 'active',
            notes: notes ? String(notes).trim() : '',
            createdBy: req.user?._id
        });

        await newLoan.save();

        book.availableCopies = Math.max(0, book.availableCopies - 1);
        await book.save();

        // 6. Si el usuario estaba en la lista de espera de este libro, marcar su registro como cumplido
        await Waitlist.findOneAndUpdate(
            { book: book._id, user: user._id, status: { $in: ['waiting', 'notified'] } },
            { $set: { status: 'fulfilled' } }
        );

        return res.status(201).json({
            success: true,
            message: `Préstamo registrado exitosamente para ${user.name} ${user.lastName}. Vence el ${dueDate.toLocaleDateString('es-CR')}.`,
            data: newLoan,
            remainingCopies: book.availableCopies
        });
    } catch (error) {
        console.error('Error al registrar préstamo:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error interno al registrar el préstamo de libro.'
        });
    }
};

/**
 * Registrar la devolución de un libro prestado
 */
const returnLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const loan = await Loan.findById(id);

        if (!loan) {
            return res.status(404).json({
                success: false,
                message: 'El registro de préstamo no fue encontrado.'
            });
        }

        if (loan.status === 'returned') {
            return res.status(400).json({
                success: false,
                message: 'Este préstamo ya fue registrado como devuelto con anterioridad.'
            });
        }

        // 1. Marcar préstamo como devuelto
        loan.status = 'returned';
        loan.returnDate = new Date();
        await loan.save();

        // 2. Incrementar ejemplar disponible en el catálogo
        const book = await Book.findById(loan.book);
        let waitlistNotice = '';

        if (book) {
            book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
            await book.save();

            // 3. Revisar lista de espera: si hay usuarios esperando, notificar al primero (plazo de 24 horas)
            const nextInLine = await Waitlist.findOne({
                book: book._id,
                status: 'waiting'
            }).sort({ priority: 1, createdAt: 1 });

            if (nextInLine) {
                nextInLine.status = 'notified';
                nextInLine.notifiedAt = new Date();
                nextInLine.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
                await nextInLine.save();

                waitlistNotice = ` El usuario en lista de espera (${nextInLine.userName}) ha sido notificado y cuenta con 24 horas para apartarlo.`;
            }
        }

        return res.status(200).json({
            success: true,
            message: `Devolución de "${loan.bookTitle}" procesada correctamente.${waitlistNotice}`,
            data: loan
        });
    } catch (error) {
        console.error('Error al registrar devolución:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al registrar la devolución del libro.',
            error: error.message
        });
    }
};

/**
 * Listar préstamos con filtros y búsqueda
 */
const getLoans = async (req, res) => {
    try {
        await syncOverdueLoans();

        const { status, search, userCode, bookId, sort } = req.query;
        const query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (userCode) {
            query.userCode = userCode.trim();
        }

        if (bookId) {
            query.book = bookId;
        }

        if (search && search.trim()) {
            const regex = new RegExp(search.trim(), 'i');
            query.$or = [
                { bookTitle: regex },
                { userName: regex },
                { userCode: regex }
            ];
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'dueDate') sortOption = { dueDate: 1 };
        else if (sort === 'loanDate') sortOption = { loanDate: -1 };

        const loans = await Loan.find(query)
            .populate('book', 'title author isbn location category availableCopies totalCopies')
            .populate('user', 'name lastName email phone cedula userCode')
            .sort(sortOption)
            .lean();

        return res.status(200).json({
            success: true,
            count: loans.length,
            data: loans
        });
    } catch (error) {
        console.error('Error al consultar préstamos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al consultar la lista de préstamos.',
            error: error.message
        });
    }
};

/**
 * Obtener detalle de un préstamo por ID
 */
const getLoanById = async (req, res) => {
    try {
        const { id } = req.params;
        const loan = await Loan.findById(id)
            .populate('book')
            .populate('user')
            .lean();

        if (!loan) {
            return res.status(404).json({
                success: false,
                message: 'Préstamo no encontrado.'
            });
        }

        return res.status(200).json({
            success: true,
            data: loan
        });
    } catch (error) {
        console.error('Error al consultar préstamo por ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al consultar el préstamo.',
            error: error.message
        });
    }
};

/**
 * Métricas generales de préstamos (dashboard / resúmenes)
 */
const getLoanStats = async (req, res) => {
    try {
        await syncOverdueLoans();

        const activeCount = await Loan.countDocuments({ status: 'active' });
        const overdueCount = await Loan.countDocuments({ status: 'overdue' });
        const returnedCount = await Loan.countDocuments({ status: 'returned' });

        // Devoluciones realizadas hoy
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const returnedTodayCount = await Loan.countDocuments({
            status: 'returned',
            returnDate: { $gte: startOfToday }
        });

        // Préstamos realizados hoy
        const loanedTodayCount = await Loan.countDocuments({
            loanDate: { $gte: startOfToday }
        });

        // Usuarios en lista de espera activa
        const waitingCount = await Waitlist.countDocuments({
            status: { $in: ['waiting', 'notified'] }
        });

        return res.status(200).json({
            success: true,
            data: {
                activeCount,
                overdueCount,
                returnedCount,
                returnedTodayCount,
                loanedTodayCount,
                waitingCount,
                totalLoans: activeCount + overdueCount + returnedCount
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas de préstamos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas de préstamos.',
            error: error.message
        });
    }
};

/**
 * Agregar un usuario a la lista de espera de un libro agotado
 */
const addToWaitlist = async (req, res) => {
    try {
        const { bookId, userCode, notes } = req.body;

        if (!bookId || !userCode) {
            return res.status(400).json({
                success: false,
                message: 'El identificador del libro y el código del usuario son obligatorios.'
            });
        }

        const book = await Book.findById(bookId);
        if (!book || !book.isActive) {
            return res.status(404).json({
                success: false,
                message: 'El libro solicitado no existe o no está activo.'
            });
        }

        const user = await User.findOne({ userCode: String(userCode).trim(), isActive: true });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `No se encontró un usuario activo con el código "${userCode}".`
            });
        }

        // Validar si ya está en lista de espera
        const existingWait = await Waitlist.findOne({
            book: book._id,
            user: user._id,
            status: { $in: ['waiting', 'notified'] }
        });

        if (existingWait) {
            return res.status(400).json({
                success: false,
                message: `El usuario ya se encuentra registrado en la lista de espera para "${book.title}".`
            });
        }

        // Calcular prioridad en la fila
        const countAhead = await Waitlist.countDocuments({
            book: book._id,
            status: { $in: ['waiting', 'notified'] }
        });

        const newWaitEntry = new Waitlist({
            book: book._id,
            user: user._id,
            userCode: user.userCode,
            userName: `${user.name} ${user.lastName}`.trim(),
            userEmail: user.email,
            bookTitle: book.title,
            priority: countAhead + 1,
            status: 'waiting',
            notes: notes ? String(notes).trim() : ''
        });

        await newWaitEntry.save();

        return res.status(201).json({
            success: true,
            message: `${user.name} fue agregado(a) a la lista de espera de "${book.title}" (Posición #${countAhead + 1}).`,
            data: newWaitEntry
        });
    } catch (error) {
        console.error('Error al agregar a lista de espera:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al registrar en la lista de espera.',
            error: error.message
        });
    }
};

/**
 * Listar elementos de la lista de espera
 */
const getWaitlist = async (req, res) => {
    try {
        await syncExpiredWaitlist();

        const { bookId, status } = req.query;
        const query = {};

        if (bookId) query.book = bookId;
        if (status) query.status = status;
        else query.status = { $in: ['waiting', 'notified'] };

        const waitlist = await Waitlist.find(query)
            .populate('book', 'title author isbn availableCopies totalCopies')
            .populate('user', 'name lastName email phone userCode')
            .sort({ book: 1, priority: 1, createdAt: 1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: waitlist.length,
            data: waitlist
        });
    } catch (error) {
        console.error('Error al consultar lista de espera:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al consultar la lista de espera.',
            error: error.message
        });
    }
};

/**
 * Cancelar un turno en la lista de espera
 */
const cancelWaitlist = async (req, res) => {
    try {
        const { id } = req.params;
        const entry = await Waitlist.findById(id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Registro de lista de espera no encontrado.'
            });
        }

        entry.status = 'cancelled';
        await entry.save();

        return res.status(200).json({
            success: true,
            message: 'Turno en lista de espera cancelado exitosamente.',
            data: entry
        });
    } catch (error) {
        console.error('Error al cancelar lista de espera:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al cancelar registro de lista de espera.',
            error: error.message
        });
    }
};

module.exports = {
    createLoan,
    returnLoan,
    getLoans,
    getLoanById,
    getLoanStats,
    addToWaitlist,
    getWaitlist,
    cancelWaitlist
};
