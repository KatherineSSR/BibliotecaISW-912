const express = require('express');
const router = express.Router();
const {
    registerAccess,
    getAccessHistory
} = require('../controllers/accessController');

// Rutas de control de acceso (HU-04)
// Check-in para registrar el acceso del usuario mediante su código único
router.post('/check-in', registerAccess);

// Bitácora / historial de accesos
router.get('/', getAccessHistory);

module.exports = router;

