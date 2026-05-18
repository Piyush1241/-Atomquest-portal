// server/middleware/auth.js
const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const token = req.cookies?.token;
  if (!token)
    return res.status(401).json({ message: 'Not authenticated.' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Session expired. Please log in again.' });
  }
}

module.exports = { requireAuth };
