const mongoose = require('mongoose');
const ComputerSession = require('../models/ComputerSession');
const CubicleSession = require('../models/CubicleSession');
const User = require('../models/User');
const { MAX_TURN_MINUTES, isValidTurnDuration, getTurnEndAt, expireActiveTurns } = require('../services/turns');

const TOTAL_WORKSTATIONS = 14;

const getComputerLab = async (req, res) => {
    try {
        await expireActiveTurns();
        const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
        const [activeSessions, recentSessions] = await Promise.all([
            ComputerSession.find({ status: 'active' }).sort({ workstationNumber: 1 }).lean(),
            ComputerSession.find().sort({ startedAt: -1 }).limit(limit).lean()
        ]);
        const activeByWorkstation = new Map(activeSessions.map(session => [session.workstationNumber, session]));
        const workstations = Array.from({ length: TOTAL_WORKSTATIONS }, (_, index) => {
            const number = index + 1;
            const session = activeByWorkstation.get(number);
            return { number, status: session ? 'occupied' : 'free', session: session || null };
        });

        return res.status(200).json({
            success: true,
            total: TOTAL_WORKSTATIONS,
            occupied: activeSessions.length,
            free: TOTAL_WORKSTATIONS - activeSessions.length,
            workstations,
            sessions: recentSessions
        });
    } catch (error) {
        console.error('Error al consultar sala informática:', error);
        return res.status(500).json({ success: false, message: 'No se pudo consultar la sala informática.' });
    }
};

const startComputerSession = async (req, res) => {
    try {
        const workstationNumber = Number(req.body.workstationNumber);
        const userCode = typeof req.body.userCode === 'string' ? req.body.userCode.trim() : '';
        const durationMinutes = req.body.durationMinutes === undefined
            ? MAX_TURN_MINUTES
            : Number(req.body.durationMinutes);
        if (!Number.isInteger(workstationNumber) || workstationNumber < 1 || workstationNumber > TOTAL_WORKSTATIONS ||
            !/^\d{4}$/.test(userCode) || !isValidTurnDuration(durationMinutes)) {
            return res.status(400).json({
                success: false,
                message: `Selecciona una computadora entre 1 y ${TOTAL_WORKSTATIONS}, un código de cuatro dígitos y un turno de 1 a ${MAX_TURN_MINUTES} minutos.`
            });
        }

        await expireActiveTurns();
        const user = await User.findOne({ userCode });
        if (!user || user.role !== 'user') {
            return res.status(404).json({ success: false, message: 'No se encontró un visitante con ese código.' });
        }
        if (user.isActive === false) {
            return res.status(403).json({ success: false, message: 'El usuario está inactivo.' });
        }

        if (await CubicleSession.exists({ user: user._id, status: 'active' })) {
            return res.status(409).json({ success: false, message: 'El visitante ya tiene un turno activo en un cubículo.' });
        }

        const startedAt = new Date();
        const session = await ComputerSession.create({
            workstationNumber,
            user: user._id,
            userName: `${user.name} ${user.lastName}`,
            userCode,
            durationMinutes,
            startedAt,
            endsAt: getTurnEndAt(startedAt, durationMinutes)
        });
        return res.status(201).json({ success: true, message: `Uso de computadora ${workstationNumber} registrado.`, data: session });
    } catch (error) {
        if (error.code === 11000) {
            const workstationNumber = Number(req.body.workstationNumber);
            const occupied = await ComputerSession.exists({ workstationNumber, status: 'active' });
            return res.status(409).json({
                success: false,
                message: occupied
                    ? `La computadora ${workstationNumber} ya está en uso.`
                    : 'El visitante ya tiene una sesión activa en la sala informática.'
            });
        }
        console.error('Error al iniciar sesión de computadora:', error);
        return res.status(500).json({ success: false, message: 'No se pudo registrar el uso de la computadora.' });
    }
};

const finishComputerSession = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'El identificador de la sesión no es válido.' });
        }
        await expireActiveTurns();
        const session = await ComputerSession.findOneAndUpdate(
            { _id: req.params.id, status: 'active' },
            { $set: { status: 'finished', endedAt: new Date() } },
            { returnDocument: 'after', runValidators: true }
        );
        if (!session) {
            const exists = await ComputerSession.exists({ _id: req.params.id });
            const expired = exists && await ComputerSession.exists({ _id: req.params.id, status: 'expired' });
            return res.status(exists ? 409 : 404).json({
                success: false,
                message: expired ? 'El turno ya venció.' : exists ? 'La sesión ya fue finalizada.' : 'No se encontró la sesión solicitada.'
            });
        }
        return res.status(200).json({ success: true, message: 'Uso de computadora finalizado.', data: session });
    } catch (error) {
        console.error('Error al finalizar sesión de computadora:', error);
        return res.status(500).json({ success: false, message: 'No se pudo finalizar el uso de la computadora.' });
    }
};

module.exports = { getComputerLab, startComputerSession, finishComputerSession };
