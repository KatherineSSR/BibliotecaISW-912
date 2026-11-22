const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Book = require('./models/Book');

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
                userCode: '0001',
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
                userCode: '0002',
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
                userCode: '0003',
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
                userCode: '1001',
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
                userCode: '1002',
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
                userCode: '1003',
                isActive: true
            }
        ];

        const allUsers = [...admins, ...users];

        // 5 Libros iniciales para el catálogo
        const initialBooks = [
            {
                title: 'Cien años de soledad',
                author: 'Gabriel García Márquez',
                isbn: '978-0307474728',
                category: 'Ficción y Novela',
                editorial: 'Editorial Sudamericana',
                publicationYear: 1967,
                totalCopies: 4,
                availableCopies: 4,
                location: 'Estantería Literatura A-1',
                synopsis: 'La obra cumbre del realismo mágico sobre la saga de la familia Buendía en Macondo.',
                isActive: true
            },
            {
                title: 'Don Quijote de la Mancha',
                author: 'Miguel de Cervantes',
                isbn: '978-8424116286',
                category: 'Literatura Clásica',
                editorial: 'Real Academia Española',
                publicationYear: 1605,
                totalCopies: 3,
                availableCopies: 3,
                location: 'Estantería Clásicos B-2',
                synopsis: 'Las aventuras del hidalgo don Quijote y su fiel escudero Sancho Panza.',
                isActive: true
            },
            {
                title: 'Breve historia del tiempo',
                author: 'Stephen Hawking',
                isbn: '978-8498929492',
                category: 'Ciencia y Tecnología',
                editorial: 'Crítica',
                publicationYear: 1988,
                totalCopies: 2,
                availableCopies: 2,
                location: 'Estantería Ciencias C-1',
                synopsis: 'Un viaje divulgativo por los misterios del cosmos, el Big Bang y los agujeros negros.',
                isActive: true
            },
            {
                title: 'El Principito',
                author: 'Antoine de Saint-Exupéry',
                isbn: '978-0156013987',
                category: 'Infantil y Juvenil',
                editorial: 'Reynal & Hitchcock',
                publicationYear: 1943,
                totalCopies: 5,
                availableCopies: 5,
                location: 'Sala Juvenil D-1',
                synopsis: 'Un clásico universal sobre la amistad, la inocencia y el valor de lo invisible.',
                isActive: true
            },
            {
                title: 'Historia de Costa Rica',
                author: 'Carlos Monge Alfaro',
                isbn: '978-9977641234',
                category: 'Historia y Geografía',
                editorial: 'Editorial Costa Rica',
                publicationYear: 1980,
                totalCopies: 2,
                availableCopies: 2,
                location: 'Colección Nacional CR-1',
                synopsis: 'Estudio general de la evolución histórica e institucional del pueblo costarricense.',
                isActive: true
            }
        ];

        // Borrar todo de la base de datos para reiniciar limpia
        await User.deleteMany({});
        await Book.deleteMany({});

        // Insertar los registros
        await User.insertMany(allUsers);
        await Book.insertMany(initialBooks);
        console.log('Base de datos limpiada, usuarios y catálogo de libros insertados con éxito.');
        process.exit(0);
    } catch (error) {
        console.error('Error ejecutando el seed:', error);
        process.exit(1);
    }
};

seedData();
