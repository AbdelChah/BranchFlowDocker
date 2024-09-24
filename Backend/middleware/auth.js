module.exports = function checkAuth(req, res, next) {
  if (req.session.user) {
    next(); // User is authenticated
  } else {
    res.status(401).json({ error: 'Unauthorized, please log in' });
  }
};
