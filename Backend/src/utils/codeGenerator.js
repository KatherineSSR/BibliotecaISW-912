const crypto = require('crypto');
const User = require('../models/User');

/**
 * Genera un código único alfanumérico para el usuario.
 * Formato: BCQ-XXXXX 
 */
const generateUserCode = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    const bytes = crypto.randomBytes(5);
    for (let i = 0; i < 5; i++) {
        code += chars[bytes[i] % chars.length];
    }
    return `BCQ-${code}`;
};

/**
 * Genera un código garantizando que no exista en la base de datos.
 */
const getUniqueUserCode = async () => {
    let code = '';
    let exists = true;
    let attempts = 0;

    while (exists && attempts < 10) {
        code = generateUserCode();
        const found = await User.findOne({ userCode: code });
        if (!found) {
            exists = false;
        }
        attempts++;
    }

    if (exists) {
        // En caso de colisiones, agregar timestamp
        code = `BCQ-${Date.now().toString().slice(-6)}`;
    }

    return code;
};

module.exports = {
    generateUserCode,
    getUniqueUserCode
};
