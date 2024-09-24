const db = require('../config/db');

// Get user settings
exports.getUserSettings = (req, res) => {
  const userId = req.session.user?.id || 1; // Default to user ID 1 for testing

  const sql = 'SELECT UserID, Username, FirstName, LastName, RoleID, Lastlogin, Lastlogout FROM user WHERE UserID = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Failed to fetch user data:', err);
      return res.status(500).json({ error: 'Failed to fetch user data' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(results[0]);
  });
};

exports.updateGoal = (req, res) => {
  const { userID, newGoal } = req.body;

  if (!userID || !newGoal) {
    return res.status(400).json({ error: 'Missing userID or newGoal' });
  }

  // SQL query to update the goal for the specified user
  const query = 'UPDATE user SET goal = ? WHERE UserID = ?';
  db.query(query, [newGoal, userID], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update goal' });
    }

    res.json({ message: 'Goal updated successfully' });
  });
};