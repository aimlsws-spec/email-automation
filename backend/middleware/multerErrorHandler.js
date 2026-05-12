const multer = require('multer');

// Error handling middleware for multer and other errors
function multerErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err.message);
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({ error: 'File is too large. Maximum 5MB allowed.' });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  if (err) {
    console.error('Middleware error:', err.message);
    return res.status(400).json({ error: err.message || 'An error occurred' });
  }
  next();
}

module.exports = multerErrorHandler;
