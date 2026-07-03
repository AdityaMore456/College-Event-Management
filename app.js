const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');

const apiRoutes = require('./routes/api');
const viewRoutes = require('./routes/views.routes');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Core middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Make the current user + brand name available to every EJS view
app.use((req, res, next) => {
  res.locals.currentUser = res.locals.currentUser || null;
  res.locals.appName = 'CEMS · College Event Management';
  next();
});

// Routes
app.use('/api', apiRoutes);
app.use('/', viewRoutes);

// Errors
app.use(notFound);
app.use(errorHandler);

module.exports = app;
