const mongoose = require('mongoose');
const dns = require("dns");

// Configurar servidores DNS (Cloudflare resuelve el registro SRV de MongoDB Atlas)
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const connectDB = async () => {
    try {
        const uri = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/BibliotecaISW';
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('Conectado a MongoDB');
    } catch (error) {
        if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('mongodb+srv')) {
            console.warn('No se pudo conectar a MongoDB Atlas. Intentando con MongoDB local...');
            try {
                await mongoose.connect('mongodb://127.0.0.1:27017/BibliotecaISW', { serverSelectionTimeoutMS: 3000 });
                console.log('Conectado exitosamente a MongoDB local (127.0.0.1:27017/BibliotecaISW)');
                return;
            } catch (localErr) {
                console.error('Tampoco se pudo conectar a MongoDB local:', localErr.message);
            }
        }
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;