const express = require('express');
const router = express.Router();
const { getHasilSummary } = require('../controllers/dashboard.controller');
const verifyToken = require('../middleware/supabaseAuth.middleware');

router.get('/hasil', verifyToken, getHasilSummary);

module.exports = router;
