const multer = require('multer');
const path = require('path');

// Multer — store upload in memory (max 20MB), for the bulk campaign import
// endpoint. The legacy `middleware/upload.js` is capped at 5MB and is used
// by the manual single-sender upload flow; this is a separate, larger limit
// so a 7,000+ row master sheet doesn't get rejected.
const uploadLarge = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.csv', '.xlsx', '.xls'];
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.includes(ext) ? cb(null, true) : cb(new Error('Only CSV and Excel files allowed'));
  },
});

module.exports = { uploadLarge };
