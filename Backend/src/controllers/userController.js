const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { getUniqueUserCode } = require('../utils/codeGenerator');
const { sendUserCodeEmail } = require('../services/emailService');

/**
 * HU-01: Registrar un usuario y generar código único automáticamente
 */
const registerUser = async (req, res) => {
    try {
        const { name, lastName, email, cedula, phone, age, address, role, password } = req.body;

        // Validaciones básicas requeridas
        if (!name || !lastName || !email || !cedula) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, apellidos, cédula y correo electrónico son obligatorios.'
            });
        }

        // Validar formato de correo simple
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'El formato del correo electrónico no es válido.'
            });
        }

        // Verificar si la cédula o correo ya existen
        const existingCedula = await User.findOne({ cedula: cedula.trim() });
        if (existingCedula) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un usuario registrado con esa cédula.'
            });
        }

        const existingEmail = await User.findOne({ email: email.trim().toLowerCase() });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un usuario registrado con ese correo electrónico.'
            });
        }

        // Generar código único alfanumérico
        const userCode = await getUniqueUserCode();

        // Encriptar contraseña si se proporcionó (ej: al registrar administradores)
        let hashedPassword = '';
        if (password && password.trim()) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password.trim(), salt);
        }

        // Crear el usuario
        const newUser = new User({
            name: name.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            cedula: cedula.trim(),
            phone: phone ? phone.trim() : '',
            age: age ? Number(age) : undefined,
            address: address ? address.trim() : '',
            role: role || 'user',
            password: hashedPassword,
            userCode
        });

        await newUser.save();

        // HU-03: Despachar correo electrónico con el código
        const emailResult = await sendUserCodeEmail({
            to: newUser.email,
            name: `${newUser.name} ${newUser.lastName}`,
            userCode: newUser.userCode
        });

        const userObj = newUser.toObject();
        delete userObj.password;

        return res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente.',
            data: userObj,
            emailStatus: emailResult
        });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al registrar el usuario.',
            error: error.message
        });
    }
};

/**
 * HU-02: Editar información de usuario 
 */
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, lastName, email, cedula, phone, age, address, role, isActive } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado.'
            });
        }

        // Si cambia de cédula, verificar que no esté tomada
        if (cedula && cedula.trim() !== user.cedula) {
            const cedulaTaken = await User.findOne({ cedula: cedula.trim(), _id: { $ne: id } });
            if (cedulaTaken) {
                return res.status(400).json({
                    success: false,
                    message: 'La cédula ingresada ya está en uso por otro usuario.'
                });
            }
            user.cedula = cedula.trim();
        }

        // Si cambia de email, verificar que no esté tomado
        if (email && email.trim().toLowerCase() !== user.email) {
            const emailTaken = await User.findOne({ email: email.trim().toLowerCase(), _id: { $ne: id } });
            if (emailTaken) {
                return res.status(400).json({
                    success: false,
                    message: 'El correo electrónico ya está en uso por otro usuario.'
                });
            }
            user.email = email.trim().toLowerCase();
        }

        // Actualizar campos permitidos
        if (name) user.name = name.trim();
        if (lastName) user.lastName = lastName.trim();
        if (phone !== undefined) user.phone = phone.trim();
        if (age !== undefined) user.age = Number(age);
        if (address !== undefined) user.address = address.trim();
        if (role) user.role = role;
        if (isActive !== undefined) user.isActive = isActive;

        await user.save();

        const updatedUser = user.toObject();
        delete updatedUser.password;

        return res.status(200).json({
            success: true,
            message: 'Usuario actualizado exitosamente.',
            data: updatedUser
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar el usuario.',
            error: error.message
        });
    }
};

/**
 * Obtener todos los usuarios con búsqueda opcional
 */
const getUsers = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            const regex = new RegExp(search, 'i');
            query = {
                $or: [
                    { name: regex },
                    { lastName: regex },
                    { cedula: regex },
                    { email: regex },
                    { userCode: regex }
                ]
            };
        }

        const users = await User.find(query).select('-password').sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener usuarios.',
            error: error.message
        });
    }
};

/**
 * Obtener un usuario por su ID
 */
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado.'
            });
        }
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al buscar usuario.',
            error: error.message
        });
    }
};

/**
 * Reenviar código por correo
 */
const resendUserCode = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado.'
            });
        }

        const emailResult = await sendUserCodeEmail({
            to: user.email,
            name: `${user.name} ${user.lastName}`,
            userCode: user.userCode
        });

        return res.status(200).json({
            success: true,
            message: `Código reenviado a ${user.email}`,
            emailStatus: emailResult
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al reenviar código.',
            error: error.message
        });
    }
};

module.exports = {
    registerUser,
    updateUser,
    getUsers,
    getUserById,
    resendUserCode
};
