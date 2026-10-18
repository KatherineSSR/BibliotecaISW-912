const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Login administrativo / usuario
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Correo y contraseña son obligatorios.'
            });
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas.'
            });
        }

        // Si la contraseña está encriptada comparamos con bcrypt, de lo contrario simple check
        let isMatch = false;
        if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            isMatch = user.password === password;
        }

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas.'
            });
        }

        // Validar que solo los administradores puedan ingresar al sistema
        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Solo administradores pueden iniciar sesión en el sistema.'
            });
        }

        if (user.isActive === false) {
            return res.status(403).json({
                success: false,
                message: 'Su cuenta de administrador se encuentra inactiva.'
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '8h' }
        );

        return res.status(200).json({
            success: true,
            message: 'Autenticación exitosa.',
            token,
            user: {
                id: user._id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                userCode: user.userCode
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión.',
            error: error.message
        });
    }
};

module.exports = {
    login
};
