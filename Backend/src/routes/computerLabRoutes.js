const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/adminAuth');
const {
    getComputerLab,
    startComputerSession,
    finishComputerSession
} = require('../controllers/computerLabController');

router.use(requireAdmin);
router.get('/', getComputerLab);
router.post('/sessions', startComputerSession);
router.patch('/sessions/:id/finish', finishComputerSession);

module.exports = router;
