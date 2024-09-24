const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true in production for using HTTPS
  },
};
