require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const { expireActiveTurns } = require('./services/turns');

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

let expiringTurns = false;
const expiryTimer = setInterval(async () => {
    if (expiringTurns || mongoose.connection.readyState !== 1) return;
    expiringTurns = true;
    try {
        await expireActiveTurns();
    } catch (error) {
        console.error('Error al liberar turnos vencidos:', error);
    } finally {
        expiringTurns = false;
    }
}, 60 * 1000);
expiryTimer.unref();
