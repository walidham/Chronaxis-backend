const app = require('./app');

// For Vercel serverless functions, we don't need to listen
// Vercel handles the server startup
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;