const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const { create, list } = require('../controllers/hasilDiagnostik.controller');

router.use(verifyToken);

router.post('/', create);
router.get('/', list);

module.exports = router;
