// server/routes/authRoutes.js
const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const pool    = require('../db/postgres');

const router = express.Router();

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  if (!userId || !password)
    return res.status(400).json({ message: 'User ID and password are required.' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId.trim()]);
    const user = result.rows[0];

    if (!user)
      return res.status(401).json({ message: 'Invalid credentials.' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ message: 'Invalid credentials.' });

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role, label: user.label, icon: user.icon },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, COOKIE_OPTS);
    res.json({ id: user.id, name: user.name, role: user.role, label: user.label, icon: user.icon });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', COOKIE_OPTS);
  res.json({ message: 'Logged out.' });
});

// GET /api/auth/me — verify token and return user
router.get('/me', (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated.' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ id: user.id, name: user.name, role: user.role, label: user.label, icon: user.icon });
  } catch {
    res.clearCookie('token', COOKIE_OPTS);
    res.status(401).json({ message: 'Session expired. Please log in again.' });
  }
});

module.exports = router;
