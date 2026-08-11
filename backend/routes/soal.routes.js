const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const { list } = require('../controllers/soal.controller');

// Semua route soal butuh login (bacaan bersama, sama seperti paket_soal)
router.use(verifyToken);

router.get('/', list);

module.exports = router;
