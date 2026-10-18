const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// Rutas de autenticación
//login para admins
router.post('/login', login);

module.exports = router;
