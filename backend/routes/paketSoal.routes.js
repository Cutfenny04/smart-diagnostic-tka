const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/supabaseAuth.middleware');
const { writeLimiter } = require('../middleware/rateLimit.middleware');
const { list, getById, create, update, remove, logPlay } = require('../controllers/paketSoal.controller');

// Semua route paket soal butuh login (guru hanya boleh kelola paketnya sendiri)
router.use(verifyToken);

router.get('/', list);
router.get('/:id', getById);
router.post('/', writeLimiter, create);
router.put('/:id', writeLimiter, update);
router.delete('/:id', remove);
router.post('/:id/played', logPlay);

module.exports = router;
