const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const { list, getById, create, update, remove } = require('../controllers/paketSoal.controller');

// Semua route paket soal butuh login (guru hanya boleh kelola paketnya sendiri)
router.use(verifyToken);

router.get('/', list);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
