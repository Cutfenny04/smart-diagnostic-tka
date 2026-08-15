const express = require('express');
const router = express.Router();
const { getAllMateri, getMateriById, updateProgress } = require('../controllers/materi.controller');
const verifyToken = require('../middleware/supabaseAuth.middleware');

// Semua route materi butuh login (pakai verifyToken)
router.get('/', verifyToken, getAllMateri);
router.get('/:id', verifyToken, getMateriById);
router.post('/:id/progress', verifyToken, updateProgress);

module.exports = router;
