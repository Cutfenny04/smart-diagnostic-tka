const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const { register, login, changePassword } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.put('/password', verifyToken, changePassword);

module.exports = router;
