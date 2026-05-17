const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const goalRoutes       = require('./routes/goalRoutes');
const sharedGoalRoutes = require('./routes/sharedGoalRoutes');

const app = express();

// ✅ CORS — allow local dev + Vercel production
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://atomquest-portal-chi.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ✅ Handle ALL OPTIONS preflight requests globally
app.options('/{*path}', cors());

// ✅ Body parser
app.use(express.json());

// ✅ Request logger
app.use((req, res, next) => {
  console.log(`[📡 Network Inbound] ${req.method} ${req.url}`);
  next();
});

// ✅ Routes
app.use('/api/goals',        goalRoutes);
app.use('/api/shared-goals', sharedGoalRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB database cluster cleanly.");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 AtomQuest Engine running on Port: ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Database connection failure: ", err);
  });