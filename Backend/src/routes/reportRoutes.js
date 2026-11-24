const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/adminAuth');
const { getAccessReport, getLoansReport } = require('../controllers/reportController');

router.use(requireAdmin);

router.get('/access', getAccessReport);
router.get('/loans', getLoansReport);

module.exports = router;
