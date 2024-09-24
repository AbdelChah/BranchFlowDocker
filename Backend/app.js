require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 5000;
const api_base_url_frontend = "localhost:5173";
// Configurations
const db = require('./config/db');
const sessionConfig = require('./config/session');

// Middleware
const authMiddleware = require('./middleware/auth');
console.log
// Use middlewares
app.use(cors({ origin: `http://${api_base_url_frontend}`, methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', credentials: true }));
app.use(bodyParser.json());
app.use(session(sessionConfig));

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const transactionRoutes = require('./routes/transaction');
const serviceRoutes = require('./routes/service');
const imageRoutes = require('./routes/image');


// Routes
app.use('/auth', authRoutes);
app.use('/user', authMiddleware, userRoutes);
app.use('/transactions', authMiddleware, transactionRoutes);
app.use('/services', authMiddleware, serviceRoutes);
app.use('/upload', authMiddleware, imageRoutes);


// Static files (e.g., images)
app.use('/images', express.static(path.join(__dirname, 'images')));

// Fallback route
app.get('*', (req, res) => res.status(404).json({ error: 'Page not found' }));

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
