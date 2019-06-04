const { logger } = require('../logger');
const usersRouter = require('./users');
const auhtRouter = require('./auth');
const socialRouter = require('./social');

function ensureAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

function applyRoutes(app) {
  logger.debug('Applying routes');

  app.get('/', function(req, res, next) {
    const pageOptions = {
      title: 'AUTH1-SERVER',
      isAuthenticated: req.isAuthenticated(),
    };
    res.render('index', pageOptions);
  });

  app.use('/', auhtRouter);
  app.use('/social', socialRouter);

  app.use('/users', ensureAuthenticated, usersRouter);

  app.use('*', function(req, res, next) {
    res.redirect('/login');
  });
}

module.exports = {
  applyRoutes,
};
