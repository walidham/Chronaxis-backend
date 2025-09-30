const helmet = require('helmet');

// Security headers middleware
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// API key validation middleware (optional)
const validateApiKey = (req, res, next) => {
  // Skip for public routes
  const publicPaths = ['/api/auth/login', '/api/contact'];
  if (publicPaths.includes(req.path) || req.method === 'OPTIONS') {
    return next();
  }

  // For now, just continue - you can add API key validation here later
  next();
};

module.exports = {
  securityHeaders,
  validateApiKey
};