const crypto = require('crypto');
const User = require('../models/User');

const CODE_SPACE_SIZE = 10_000;

const generateUserCode = () => crypto.randomInt(CODE_SPACE_SIZE).toString().padStart(4, '0');

/**
 * Generates a unique four-digit code, preserving leading zeroes.
 */
const getUniqueUserCode = async () => {
    const existingCodes = new Set(
        (await User.distinct('userCode')).filter(code => /^\d{4}$/.test(code))
    );
    if (existingCodes.size >= CODE_SPACE_SIZE) {
        throw new Error('No quedan códigos de usuario de cuatro dígitos disponibles.');
    }

    const start = crypto.randomInt(CODE_SPACE_SIZE);
    for (let offset = 0; offset < CODE_SPACE_SIZE; offset++) {
        const code = ((start + offset) % CODE_SPACE_SIZE).toString().padStart(4, '0');
        if (!existingCodes.has(code)) return code;
    }

    throw new Error('No quedan códigos de usuario de cuatro dígitos disponibles.');
};

module.exports = {
    generateUserCode,
    getUniqueUserCode
};
