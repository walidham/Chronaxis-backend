const express = require('express');
const router = express.Router();
const { loginUser, changePassword, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/rateLimiter');

router.post('/login', loginLimiter, loginUser);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

module.exports = router;