const mongoose = require('mongoose');
const dns = require("dns");

// Configurar servidores DNS (Cloudflare resuelve el registro SRV de MongoDB Atlas)
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;