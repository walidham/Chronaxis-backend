// Security logging middleware
const securityLogger = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Log unauthorized access attempts
    if (res.statusCode === 401 || res.statusCode === 403) {
      console.log(`🚨 SECURITY: Unauthorized access attempt - ${req.method} ${req.path} from ${req.ip} at ${new Date().toISOString()}`);
      console.log(`   User-Agent: ${req.get('User-Agent')}`);
      console.log(`   Headers: ${JSON.stringify(req.headers)}`);
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

module.exports = { securityLogger };