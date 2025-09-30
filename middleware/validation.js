const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Input sanitization middleware
const sanitizeInput = [
  // Prevent NoSQL injection attacks
  mongoSanitize(),
  
  // Prevent XSS attacks
  xss()
];

module.exports = { sanitizeInput };