// Usage: allowRoles('organizer', 'admin')
function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      if (req.originalUrl.startsWith('/api')) {
        return res.status(403).json({ success: false, message: 'Forbidden: insufficient role' });
      }
      return res.status(403).render('errors/500', {
        title: 'Forbidden',
        message: "You don't have permission to view this page.",
      });
    }
    next();
  };
}

module.exports = { allowRoles };
