const Access = require('../models/Access');
const User = require('../models/User');

/**
 * HU-04: Registrar ingreso a la biblioteca mediante código único de usuario
 */
const registerAccess = async (req, res) => {
    try {
        const { userCode, notes } = req.body;

        if (!userCode || !userCode.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Debe ingresar el código de usuario para el check-in.'
            });
        }

        const cleanCode = userCode.trim().toUpperCase();

        // Buscar el usuario por su código
        const user = await User.findOne({ userCode: cleanCode });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Código de usuario no encontrado. Verifique e intente nuevamente.'
            });
        }

        if (user.isActive === false) {
            return res.status(403).json({
                success: false,
                message: 'El usuario se encuentra inactivo en el sistema.'
            });
        }

        // Crear el registro de acceso con fecha y hora actual
        const entryTime = new Date();
        const access = new Access({
            user: user._id,
            userCode: user.userCode,
            userName: `${user.name} ${user.lastName}`,
            entryTime,
            notes: notes ? notes.trim() : ''
        });

        await access.save();

        return res.status(201).json({
            success: true,
            message: `¡Bienvenido(a) ${user.name} ${user.lastName}! Ingreso registrado correctamente.`,
            data: {
                accessId: access._id,
                user: {
                    id: user._id,
                    name: user.name,
                    lastName: user.lastName,
                    cedula: user.cedula,
                    email: user.email,
                    role: user.role,
                    userCode: user.userCode
                },
                entryTime: access.entryTime
            }
        });
    } catch (error) {
        console.error('Error al registrar acceso:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno al registrar el ingreso.',
            error: error.message
        });
    }
};

/**
 * Obtener historial de accesos
 */
const getAccessHistory = async (req, res) => {
    try {
        const { limit = 50, date } = req.query;
        let query = {};

        // Filtrar por fecha específica
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            query.entryTime = { $gte: startOfDay, $lte: endOfDay };
        }

        const accesses = await Access.find(query)
            .populate('user', 'name lastName email cedula role')
            .sort({ entryTime: -1 })
            .limit(Number(limit));

        return res.status(200).json({
            success: true,
            count: accesses.length,
            data: accesses
        });
    } catch (error) {
        console.error('Error al obtener historial de accesos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al consultar historial de accesos.',
            error: error.message
        });
    }
};

module.exports = {
    registerAccess,
    getAccessHistory
};
