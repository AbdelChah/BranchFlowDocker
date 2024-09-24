const path = require('path');
const fs = require('fs');
const db = require('../config/db');

// Handle image upload and service creation
exports.uploadImage = (req, res) => {
  const { title, description, CreditAccount, DebitAccount } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Correctly build the source and target paths
  const sourcePath = req.file.path;
  const targetPath = path.join(__dirname, '../images', req.file.filename);

  // Use fs.copyFile to handle cross-device copy, then delete the original
  fs.copyFile(sourcePath, targetPath, (copyErr) => {
    if (copyErr) {
      console.error('Failed to copy file:', copyErr);
      return res.status(500).json({ error: 'Failed to copy file' });
    }

    // Delete the original file after copying
    fs.unlink(sourcePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error('Failed to delete original file:', unlinkErr);
        return res.status(500).json({ error: 'Failed to delete original file' });
      }

      // Store the file information and service data in the database
      const imageUrl = `/images/${req.file.filename}`;
      const creationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const sql = `
        INSERT INTO services (title, description, image_url, creation_date, CreditAccount, DebitAccount)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(sql, [
        title,
        description,
        imageUrl,
        creationDate,
        JSON.stringify(CreditAccount),
        JSON.stringify(DebitAccount)
      ], (err, result) => {
        if (err) {
          console.error('Failed to insert data:', err);
          return res.status(500).json({ error: 'Failed to insert data' });
        }

        res.json({ message: 'Service added successfully', id: result.insertId, imageUrl });
      });
    });
  });
};
