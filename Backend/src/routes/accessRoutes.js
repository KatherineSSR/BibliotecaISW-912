const express = require('express');
const router = express.Router();
const {
    registerAccess,
    getAccessHistory
} = require('../controllers/accessController');

// Rutas de control de acceso
//check in para registrar el acceso del usuario
router.post('/check-in', registerAccess);
//para ver historial de accesos como si fuera bitacora
router.get('/', getAccessHistory);

module.exports = router;
