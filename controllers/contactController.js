const ContactMessage = require('../models/ContactMessage');
const asyncHandler = require('express-async-handler');

// @desc    Create a contact message
// @route   POST /api/contact
// @access  Public
const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('Tous les champs sont requis');
  }

  const contactMessage = await ContactMessage.create({
    name,
    email,
    subject,
    message
  });

  res.status(201).json({
    message: 'Message envoyé avec succès',
    id: contactMessage._id
  });
});

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find({})
    .sort({ createdAt: -1 });
  
  res.json(messages);
});

// @desc    Get contact message by ID
// @route   GET /api/contact/:id
// @access  Private/Admin
const getContactMessageById = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);
  
  if (!message) {
    res.status(404);
    throw new Error('Message non trouvé');
  }
  
  res.json(message);
});

// @desc    Update contact message status
// @route   PUT /api/contact/:id
// @access  Private/Admin
const updateContactMessage = asyncHandler(async (req, res) => {
  const { status, isRead } = req.body;
  
  const message = await ContactMessage.findById(req.params.id);
  
  if (!message) {
    res.status(404);
    throw new Error('Message non trouvé');
  }
  
  if (status !== undefined) message.status = status;
  if (isRead !== undefined) message.isRead = isRead;
  
  const updatedMessage = await message.save();
  res.json(updatedMessage);
});

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);
  
  if (!message) {
    res.status(404);
    throw new Error('Message non trouvé');
  }
  
  await ContactMessage.findByIdAndDelete(req.params.id);
  res.json({ message: 'Message supprimé' });
});

module.exports = {
  createContactMessage,
  getContactMessages,
  getContactMessageById,
  updateContactMessage,
  deleteContactMessage
};