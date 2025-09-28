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

// Public route for creating contact messages
router.post('/', createContactMessage);

// Admin routes for managing contact messages
router.get('/', protect, adminOnly, getContactMessages);
router.get('/:id', protect, adminOnly, getContactMessageById);
router.put('/:id', protect, adminOnly, updateContactMessage);
router.delete('/:id', protect, adminOnly, deleteContactMessage);

module.exports = router;