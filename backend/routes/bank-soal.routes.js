const express = require('express');
const router = express.Router();
const {
  getAllPaketSoal,
  getPaketSoalBySlug,
  createPaketSoal,
  updatePaketSoal,
  deletePaketSoal,
} = require('../controllers/bank-soal.controller');
const verifyToken = require('../middleware/auth.middleware');

router.get('/', verifyToken, getAllPaketSoal);
router.get('/:slug', verifyToken, getPaketSoalBySlug);
router.post('/', verifyToken, createPaketSoal);
router.put('/:slug', verifyToken, updatePaketSoal);
router.delete('/:slug', verifyToken, deletePaketSoal);

module.exports = router;