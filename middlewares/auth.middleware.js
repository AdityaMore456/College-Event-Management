const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Reads the JWT from a cookie (EJS pages) or Authorization header (API clients)
async function protect(req, res, next) {
  try {
    const token =
      req.cookies?.token || (req.headers.authorization || '').replace('Bearer ', '');

    if (!token) {
      if (req.originalUrl.startsWith('/api')) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      return res.redirect('/login');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error('User no longer exists');

    req.user = user;
    res.locals.currentUser = user;
    next();
  } catch (err) {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({ success: false, message: 'Invalid or expired session' });
    }
    return res.redirect('/login');
  }
}

module.exports = { protect };
