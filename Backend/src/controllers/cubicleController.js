const mongoose = require('mongoose');
const Cubicle = require('../models/Cubicle');
const CubicleSession = require('../models/CubicleSession');
const ComputerSession = require('../models/ComputerSession');
const User = require('../models/User');
const { MAX_TURN_MINUTES, isValidTurnDuration, getTurnEndAt, expireActiveTurns } = require('../services/turns');

const TOTAL_CUBICLES = 6;
let initialization;

const ensureCubiclesExist = () => {
    if (!initialization) {
        initialization = Cubicle.bulkWrite(
            Array.from({ length: TOTAL_CUBICLES }, (_, index) => ({
                updateOne: {
                    filter: { number: index + 1 },
                    update: { $setOnInsert: { number: index + 1, status: 'free' } },
                    upsert: true
                }
            }))
        ).catch(error => {
            initialization = undefined;
            throw error;
        });
    }
    return initialization;
};

const getCubicles = async (req, res) => {
    try {
        await ensureCubiclesExist();
        await expireActiveTurns();
        const [cubicles, activeSessions, recentSessions] = await Promise.all([
            Cubicle.find({ number: { $lte: TOTAL_CUBICLES } }).sort({ number: 1 }).lean(),
            CubicleSession.find({ status: 'active' }).sort({ cubicleNumber: 1 }).lean(),
            CubicleSession.find().sort({ startedAt: -1 }).limit(50).lean()
        ]);
        const activeByNumber = new Map(activeSessions.map(session => [session.cubicleNumber, session]));
        const data = cubicles.map(cubicle => {
            const session = activeByNumber.get(cubicle.number) || null;
            return { ...cubicle, status: session ? 'occupied' : 'free', session };
        });
        const occupied = activeSessions.length;

        return res.status(200).json({
            success: true,
            total: data.length,
            occupied,
            free: data.length - occupied,
            data,
            sessions: recentSessions
        });
    } catch (error) {
        console.error('Error al consultar cubículos:', error);
        return res.status(500).json({
            success: false,
            message: 'No se pudo consultar el estado de los cubículos.'
        });
    }
};

const startCubicleSession = async (req, res) => {
    try {
        const cubicleNumber = Number(req.body.cubicleNumber);
        const userCode = typeof req.body.userCode === 'string' ? req.body.userCode.trim() : '';
        const durationMinutes = req.body.durationMinutes === undefined
            ? MAX_TURN_MINUTES
            : Number(req.body.durationMinutes);
        if (!Number.isInteger(cubicleNumber) || cubicleNumber < 1 || cubicleNumber > TOTAL_CUBICLES ||
            !/^\d{4}$/.test(userCode) || !isValidTurnDuration(durationMinutes)) {
            return res.status(400).json({
                success: false,
                message: `Selecciona un cubículo entre 1 y ${TOTAL_CUBICLES}, un código de cuatro dígitos y un turno de 1 a ${MAX_TURN_MINUTES} minutos.`
            });
        }

        await ensureCubiclesExist();
        await expireActiveTurns();
        const user = await User.findOne({ userCode, role: 'user' });
        if (!user) {
            return res.status(404).json({ success: false, message: 'No se encontró un visitante con ese código.' });
        }
        if (user.isActive === false) {
            return res.status(403).json({ success: false, message: 'El usuario está inactivo.' });
        }
        if (
            await CubicleSession.exists({ user: user._id, status: 'active' }) ||
            await ComputerSession.exists({ user: user._id, status: 'active' })
        ) {
            return res.status(409).json({ success: false, message: 'El visitante ya tiene un turno activo en un cubículo o computadora.' });
        }

        const startedAt = new Date();
        const session = await CubicleSession.create({
            cubicleNumber,
            user: user._id,
            userName: `${user.name} ${user.lastName}`,
            userCode,
            durationMinutes,
            startedAt,
            endsAt: getTurnEndAt(startedAt, durationMinutes)
        });
        return res.status(201).json({
            success: true,
            message: `Turno del cubículo ${cubicleNumber} asignado por ${durationMinutes} minutos.`,
            data: session
        });
    } catch (error) {
        if (error.code === 11000) {
            const cubicleNumber = Number(req.body.cubicleNumber);
            const occupied = await CubicleSession.exists({ cubicleNumber, status: 'active' });
            return res.status(409).json({
                success: false,
                message: occupied
                    ? `El cubículo ${cubicleNumber} ya está ocupado.`
                    : 'El visitante ya tiene un turno activo en un cubículo o computadora.'
            });
        }
        console.error('Error al iniciar turno de cubículo:', error);
        return res.status(500).json({ success: false, message: 'No se pudo registrar el turno del cubículo.' });
    }
};

const finishCubicleSession = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'El identificador del turno no es válido.' });
        }
        await expireActiveTurns();
        const session = await CubicleSession.findOneAndUpdate(
            { _id: req.params.id, status: 'active' },
            { $set: { status: 'finished', endedAt: new Date() } },
            { returnDocument: 'after', runValidators: true }
        );
        if (!session) {
            const exists = await CubicleSession.exists({ _id: req.params.id });
            const expired = exists && await CubicleSession.exists({ _id: req.params.id, status: 'expired' });
            return res.status(exists ? 409 : 404).json({
                success: false,
                message: expired ? 'El turno ya venció.' : exists ? 'El turno ya fue finalizado.' : 'No se encontró el turno.'
            });
        }
        return res.status(200).json({ success: true, message: 'Turno del cubículo finalizado.', data: session });
    } catch (error) {
        console.error('Error al finalizar turno de cubículo:', error);
        return res.status(500).json({ success: false, message: 'No se pudo finalizar el turno del cubículo.' });
    }
};

module.exports = { getCubicles, startCubicleSession, finishCubicleSession };
