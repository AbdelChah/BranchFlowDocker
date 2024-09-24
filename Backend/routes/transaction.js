const express = require('express');
const router = express.Router();
const { createTransaction, getRecentTransactions, getDashboardData, startOfDay } = require('../controllers/transactionController');

// Existing routes
router.post('/', createTransaction);
router.get('/recenttransactions', getRecentTransactions);
router.get('/dashboard-data', getDashboardData);

// Add the Start of Day route
router.post('/startofday', startOfDay);

module.exports = router;
