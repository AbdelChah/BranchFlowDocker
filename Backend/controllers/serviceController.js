const db = require('../config/db');

// Fetch all services
exports.getAllServices = (req, res) => {
  const sql = 'SELECT id, title, description, image_url, creation_date, CreditAccount, DebitAccount FROM services';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Failed to fetch services:', err);
      return res.status(500).json({ error: 'Failed to fetch services' });
    }

    const formattedResults = results.map(service => ({
      ...service,
      CreditAccount: JSON.parse(service.CreditAccount),
      DebitAccount: JSON.parse(service.DebitAccount)
    }));

    res.json(formattedResults);
  });
};
