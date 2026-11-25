const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/adminAuth');
const { getAccessReport, getLoansReport, getCubiclesReport } = require('../controllers/reportController');

router.use(requireAdmin);

router.get('/access', getAccessReport);
router.get('/loans', getLoansReport);
router.get('/cubicles', getCubiclesReport);

module.exports = router;
