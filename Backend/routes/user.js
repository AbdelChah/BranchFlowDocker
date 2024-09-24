const express = require('express');
const router = express.Router();
const { getUserSettings } = require('../controllers/userController');
const { updateGoal } = require('../controllers/userController');
router.get('/settings', getUserSettings);
router.post('/update-goal', updateGoal);

module.exports = router;
