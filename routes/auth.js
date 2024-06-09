const express = require('express');
const router = express.Router();
const { register, login, getUser } = require('../controllers/authController');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validate');
const auth = require('../middleware/auth');

router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);
router.get('/me', auth, getUser);

module.exports = router;
