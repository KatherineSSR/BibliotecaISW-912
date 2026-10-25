const express = require('express');
const router = express.Router();
const {
    registerUser,
    updateUser,
    getUsers,
    getUserById
} = require('../controllers/userController');

// Registrar usuario
router.post('/', registerUser);
// Listar usuarios
router.get('/', getUsers);
// Buscar usuario por id
router.get('/:id', getUserById);
// Modificar usuario
router.put('/:id', updateUser);

module.exports = router;
