const Cubicle = require('../models/Cubicle');

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
        const cubicles = await Cubicle.find({ number: { $lte: TOTAL_CUBICLES } })
            .sort({ number: 1 })
            .lean();
        const occupied = cubicles.filter(cubicle => cubicle.status === 'occupied').length;

        return res.status(200).json({
            success: true,
            total: cubicles.length,
            occupied,
            free: cubicles.length - occupied,
            data: cubicles
        });
    } catch (error) {
        console.error('Error al consultar cubículos:', error);
        return res.status(500).json({
            success: false,
            message: 'No se pudo consultar el estado de los cubículos.'
        });
    }
};

const updateCubicleStatus = async (req, res) => {
    try {
        const number = Number(req.params.number);
        const { status } = req.body;

        if (!Number.isInteger(number) || number < 1 || number > TOTAL_CUBICLES) {
            return res.status(400).json({
                success: false,
                message: `El número de cubículo debe estar entre 1 y ${TOTAL_CUBICLES}.`
            });
        }
        if (!['free', 'occupied'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'El estado debe ser "free" u "occupied".'
            });
        }

        await ensureCubiclesExist();
        const cubicle = await Cubicle.findOneAndUpdate(
            { number },
            { $set: { status } },
            { returnDocument: 'after', runValidators: true }
        ).lean();

        if (!cubicle) {
            return res.status(404).json({
                success: false,
                message: 'No se encontró el cubículo solicitado.'
            });
        }

        return res.status(200).json({
            success: true,
            message: `El cubículo ${number} ahora está ${status === 'occupied' ? 'en uso' : 'libre'}.`,
            data: cubicle
        });
    } catch (error) {
        console.error('Error al actualizar cubículo:', error);
        return res.status(500).json({
            success: false,
            message: 'No se pudo actualizar el estado del cubículo.'
        });
    }
};

module.exports = {
    getCubicles,
    updateCubicleStatus
};
