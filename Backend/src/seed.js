require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Access = require('./models/Access');

const seedData = async () => {
    try {
        await connectDB();

        // Contraseña por defecto para administradores
        const defaultAdminPassword = 'Admin123!';
        const salt = await bcrypt.genSalt(10);
        const hashedAdminPassword = await bcrypt.hash(defaultAdminPassword, salt);

        // 3 Administradores
        const admins = [
            {
                name: 'Katherine',
                lastName: 'Solis Ramírez',
                cedula: '208000111',
                email: 'admin.katherine@bibliotecacq.cr',
                phone: '8811-2233',
                age: 23,
                address: 'Ciudad Quesada, San Carlos',
                role: 'admin',
                password: hashedAdminPassword,
                userCode: 'BCQ-ADM01',
                isActive: true
            },
            {
                name: 'Karol',
                lastName: 'Miranda Mora',
                cedula: '208000222',
                email: 'admin.karol@bibliotecacq.cr',
                phone: '8822-3344',
                age: 23,
                address: 'Ciudad Quesada, San Carlos',
                role: 'admin',
                password: hashedAdminPassword,
                userCode: 'BCQ-ADM02',
                isActive: true
            },
            {
                name: 'Rudy',
                lastName: 'Barboza Rodríguez',
                cedula: '208000333',
                email: 'admin.rudy@bibliotecacq.cr',
                phone: '8833-4455',
                age: 45,
                address: 'Ciudad Quesada, Centro',
                role: 'admin',
                password: hashedAdminPassword,
                userCode: 'BCQ-ADM03',
                isActive: true
            }
        ];

        // 3 Usuarios regulares (Lectores / Visitantes)
        const users = [
            {
                name: 'María Elena',
                lastName: 'Quesada Soto',
                cedula: '207550123',
                email: 'maria.quesada@ejemplo.com',
                phone: '8899-1122',
                age: 28,
                address: 'Ciudad Quesada, Barrio San Roque',
                role: 'user',
                password: '',
                userCode: 'BCQ-U7K9A',
                isActive: true
            },
            {
                name: 'Juan Diego',
                lastName: 'Murillo Vargas',
                cedula: '206440567',
                email: 'juan.murillo@ejemplo.com',
                phone: '8344-5566',
                age: 19,
                address: 'Ciudad Quesada, Urbanización La Abundancia',
                role: 'user',
                password: '',
                userCode: 'BCQ-U3X8P',
                isActive: true
            },
            {
                name: 'Sofía',
                lastName: 'Hernández Castro',
                cedula: '208110890',
                email: 'sofia.hernandez@ejemplo.com',
                phone: '8711-2233',
                age: 34,
                address: 'Ciudad Quesada, Cedral',
                role: 'user',
                password: '',
                userCode: 'BCQ-U5M2L',
                isActive: true
            }
        ];

        const allUsers = [...admins, ...users];

        // Borrar todo de la base de datos para reiniciar limpia
        await User.deleteMany({});
        await Access.deleteMany({});

        // Insertar los 6 registros
        await User.insertMany(allUsers);
        console.log('Base de datos limpiada y semilla insertada con éxito.');
        process.exit(0);
    } catch (error) {
        console.error('Error ejecutando el seed:', error);
        process.exit(1);
    }
};

seedData();
