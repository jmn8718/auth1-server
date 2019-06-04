const { logger } = require('../logger');
const usersRouter = require('./users');
const auhtRouter = require('./auth');

function ensureAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

function applyRoutes(app) {
  logger.debug('Applying routes');

  app.use('/', auhtRouter);

  app.use('/users', ensureAuthenticated, usersRouter);

  app.use('*', function(req, res, next) {
    res.redirect('/login');
  });
}

module.exports = {
  applyRoutes,
};
