const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const { checkEmbeddable } = require('../controllers/wordwall.controller');

router.use(verifyToken);

router.get('/check-embed', checkEmbeddable);

module.exports = router;
