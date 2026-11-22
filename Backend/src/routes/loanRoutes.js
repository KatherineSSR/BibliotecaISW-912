const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/adminAuth');
const {
    createLoan,
    returnLoan,
    getLoans,
    getLoanById,
    getLoanStats,
    addToWaitlist,
    getWaitlist,
    cancelWaitlist
} = require('../controllers/loanController');

// Todas las rutas de préstamos y lista de espera requieren sesión de administrador
router.use(requireAdmin);

// Métricas de préstamos
router.get('/stats', getLoanStats);

// Lista de espera
router.get('/waitlist', getWaitlist);
router.post('/waitlist', addToWaitlist);
router.delete('/waitlist/:id', cancelWaitlist);

// Préstamos
router.get('/', getLoans);
router.post('/', createLoan);
router.get('/:id', getLoanById);
router.post('/:id/return', returnLoan);
router.patch('/:id/return', returnLoan);

module.exports = router;
