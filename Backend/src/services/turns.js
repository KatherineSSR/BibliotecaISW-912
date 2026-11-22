const ComputerSession = require('../models/ComputerSession');
const CubicleSession = require('../models/CubicleSession');

const MAX_TURN_MINUTES = 240;

const isValidTurnDuration = value =>
    Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= MAX_TURN_MINUTES;

const getTurnEndAt = (startedAt, durationMinutes) =>
    new Date(new Date(startedAt).getTime() + Number(durationMinutes) * 60 * 1000);

const expireActiveTurns = async (now = new Date()) => {
    const legacyComputerSessions = await ComputerSession.find({
        status: 'active',
        $or: [{ endsAt: { $exists: false } }, { endsAt: null }]
    }).select('_id startedAt createdAt').lean();

    for (const session of legacyComputerSessions) {
        const startedAt = session.startedAt || session.createdAt || now;
        await ComputerSession.updateOne(
            { _id: session._id, status: 'active', $or: [{ endsAt: { $exists: false } }, { endsAt: null }] },
            {
                $set: {
                    durationMinutes: MAX_TURN_MINUTES,
                    endsAt: getTurnEndAt(startedAt, MAX_TURN_MINUTES)
                }
            }
        );
    }

    const [expiredComputerSessions, expiredCubicleSessions] = await Promise.all([
        ComputerSession.find({ status: 'active', endsAt: { $lte: now } }).select('_id endsAt').lean(),
        CubicleSession.find({ status: 'active', endsAt: { $lte: now } }).select('_id endsAt').lean()
    ]);

    await Promise.all([
        ...expiredComputerSessions.map(session => ComputerSession.updateOne(
            { _id: session._id, status: 'active', endsAt: { $lte: now } },
            { $set: { status: 'expired', endedAt: session.endsAt } }
        )),
        ...expiredCubicleSessions.map(session => CubicleSession.updateOne(
            { _id: session._id, status: 'active', endsAt: { $lte: now } },
            { $set: { status: 'expired', endedAt: session.endsAt } }
        ))
    ]);
};

module.exports = { MAX_TURN_MINUTES, isValidTurnDuration, getTurnEndAt, expireActiveTurns };
