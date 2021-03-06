const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
// const createError = require('http-errors');
const flash = require('connect-flash');
const { passport } = require('../auth');
const { logger } = require('../logger');
const { server } = require('../auth/server');
const {
  SESSION_SECRET,
  COOKIE_SECRET,
  NODE_ENV,
  COOKIE_MAX_AGE,
} = require('../env');

const sessionConfig = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: COOKIE_MAX_AGE,
  },
};

module.exports = {
  applyBefore: function(app) {
    logger.debug('Applying middleware before routes');

    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser(COOKIE_SECRET));
    app.use(express.static(path.join(__dirname, '..', '..', 'public')));

    if (NODE_ENV === 'production') {
      app.set('trust proxy', 1);
      sessionConfig.cookie.secure = true;
    }

    app.use(session(sessionConfig));
    app.use(passport.initialize());
    app.use(flash());
    app.use(passport.session());
  },
  applyAfter: function(app) {
    logger.debug('Applying middleware after routes');

    // catch 404 and forward to error handler
    // app.use(function(req, res, next) {
    //   next(createError(404));
    // });

    // redirect to '/' on 404
    app.use(function(req, res) {
      res.redirect('/');
    });

    if (NODE_ENV !== 'development') {
      app.use(server.errorHandler());
    }

    // error handler
    // app.use(function(err, req, res) {
    //   logger.error(err);
    //   // set locals, only providing error in development
    //   res.locals.message = err.message;
    //   res.locals.error = req.app.get('env') === 'development' ? err : {};

    //   // render the error page
    //   res.status(err.status || 500);
    //   res.render('error');
    // });
  },
};
