const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/adminAuth');
const { getCubicles, startCubicleSession, finishCubicleSession } = require('../controllers/cubicleController');

router.use(requireAdmin);
router.get('/', getCubicles);
router.post('/sessions', startCubicleSession);
router.patch('/sessions/:id/finish', finishCubicleSession);

module.exports = router;
