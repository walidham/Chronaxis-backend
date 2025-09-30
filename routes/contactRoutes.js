const express = require('express');
const router = express.Router();
const {
  createContactMessage,
  getContactMessages,
  getContactMessageById,
  updateContactMessage,
  deleteContactMessage
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { contactLimiter } = require('../middleware/rateLimiter');

// Public route for creating contact messages
router.post('/', contactLimiter, createContactMessage);

// Admin routes for managing contact messages (protection handled globally)
router.get('/', adminOnly, getContactMessages);
router.get('/:id', adminOnly, getContactMessageById);
router.put('/:id', adminOnly, updateContactMessage);
router.delete('/:id', adminOnly, deleteContactMessage);

module.exports = router;