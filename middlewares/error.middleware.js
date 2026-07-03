function notFound(req, res) {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'Route not found' });
  }
  res.status(404).render('errors/404', { title: 'Page Not Found' });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.statusCode || 500;
  if (req.originalUrl.startsWith('/api')) {
    return res.status(status).json({ success: false, message: err.message || 'Server error' });
  }
  res.status(status).render('errors/500', {
    title: 'Something went wrong',
    message: err.message || 'Unexpected server error',
  });
}

module.exports = { notFound, errorHandler };
