const path = require('path');
const multer = require('multer');

// File uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/uploads'),
  filename: function(req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname)
  }
});
const upload = multer({
  storage: storage
});

module.exports = {
  storage,
  upload
};
