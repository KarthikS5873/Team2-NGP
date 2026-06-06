// CampusBridge AI - Main Express Server
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- Middleware ---
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/guidance', require('./routes/guidance'));
app.use('/api/help', require('./routes/help'));
app.use('/api/community', require('./routes/community'));
app.use('/api/vault', require('./routes/vault'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'CampusBridge AI server is running!', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error.' });
});

// --- Database & Server Start ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/campusbridge';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 CampusBridge AI server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
