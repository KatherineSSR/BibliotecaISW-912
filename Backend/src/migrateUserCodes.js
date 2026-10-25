require('dotenv').config();
const crypto = require('crypto');
const connectDB = require('./config/db');
const User = require('./models/User');
const ComputerSession = require('./models/ComputerSession');

const CODE_SPACE_SIZE = 10_000;

function generateCodes(count) {
    const codes = Array.from({ length: CODE_SPACE_SIZE }, (_, value) => value);
    for (let index = codes.length - 1; index > 0; index--) {
        const swapIndex = crypto.randomInt(index + 1);
        [codes[index], codes[swapIndex]] = [codes[swapIndex], codes[index]];
    }
    return codes.slice(0, count).map(code => code.toString().padStart(4, '0'));
}

async function migrateUserCodes() {
    try {
        await connectDB();
        const users = await User.collection.find({}, { projection: { _id: 1 } }).toArray();
        if (users.length > CODE_SPACE_SIZE) {
            throw new Error(`Hay ${users.length} usuarios y solo existen ${CODE_SPACE_SIZE} códigos disponibles.`);
        }

        if (!users.length) {
            console.log('No hay usuarios que necesiten códigos.');
            return;
        }

        const codes = generateCodes(users.length);
        await User.collection.bulkWrite(users.map(user => ({
            updateOne: {
                filter: { _id: user._id },
                update: { $set: { userCode: `__migrating__${user._id}_${crypto.randomUUID()}` } }
            }
        })));

        await User.collection.bulkWrite(users.map((user, index) => ({
            updateOne: {
                filter: { _id: user._id },
                update: { $set: { userCode: codes[index] } }
            }
        })));

        const sessions = await ComputerSession.collection.bulkWrite(users.map((user, index) => ({
            updateMany: {
                filter: { user: user._id },
                update: { $set: { userCode: codes[index] } }
            }
        })));

        console.log(`Códigos numéricos asignados a ${users.length} usuarios.`);
        console.log(`Códigos actualizados en ${sessions.modifiedCount} sesiones de sala informática.`);
    } catch (error) {
        console.error('Error migrando los códigos de usuario:', error);
        process.exitCode = 1;
    } finally {
        const mongoose = require('mongoose');
        await mongoose.disconnect();
    }
}

migrateUserCodes();
