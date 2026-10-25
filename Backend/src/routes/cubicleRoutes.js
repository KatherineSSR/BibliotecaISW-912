const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/adminAuth');
const { getCubicles, updateCubicleStatus } = require('../controllers/cubicleController');

router.use(requireAdmin);
router.get('/', getCubicles);
router.patch('/:number', updateCubicleStatus);

module.exports = router;
