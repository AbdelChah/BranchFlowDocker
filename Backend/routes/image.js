const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage } = require('../controllers/imageController');
const path = require('path');
const fs = require('fs');

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Temporarily store uploads in the /uploads directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate a unique name for each file
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), uploadImage);

module.exports = router;
