const db = require('../config/db');

// Login route
exports.login = (req, res) => {
  const { username, password } = req.body;

  // Step 1: Query to verify the user credentials
  db.query('SELECT * FROM user WHERE Username = ?', [username], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database error: ' });
    }

    if (results.length === 0 || results[0].Password !== password) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Step 2: If credentials are valid, update the Lastlogin field
    const userId = results[0].UserID;
    db.query('UPDATE user SET Lastlogin = NOW() WHERE UserID = ?', [userId], (updateErr) => {
      if (updateErr) {
        return res.status(500).json({ error: 'Failed to update Lastlogin' });
      }

      // Step 3: Set the user session and respond with success message
      req.session.user = {
        id: results[0].UserID,
        username: results[0].Username,
        firstName: results[0].FirstName
      };

      res.json({
        message: 'Login successful',
        username: results[0].Username,
        firstName: results[0].FirstName,
        userID: results[0].UserID
      });
    });
  });
};

// Logout route
exports.logout = (req, res) => {
  if (!req.session.user) {
    return res.status(400).json({ error: 'Not logged in' });
  }

  const userId = req.session.user.id;
  db.query('UPDATE user SET Lastlogout = NOW() WHERE UserID = ?', [userId], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update Lastlogout' });
    }

    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ error: 'Failed to logout' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logout successful' });
    });
  });
};

// Check session route
exports.checkSession = (req, res) => {
  if (req.session.user) {
    res.status(200).json({ message: 'Session is valid' });
  } else {
    res.status(401).json({ error: 'Session expired' });
  }
};
