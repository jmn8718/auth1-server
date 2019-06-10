const { logger } = require('../logger');
const usersRouter = require('./users');
const socialRouter = require('./social');
const registerRouter = require('./register');
const loginRouter = require('./login');
const logoutRouter = require('./logout');
const authRouter = require('./auth');
const userinfoRouter = require('./userinfo');
const tokenRouter = require('./token');
const authorizeRouter = require('./authorize');
const { ensureAuthenticated } = require('./middleware');

function applyRoutes(app) {
  logger.debug('Applying routes');

  app.get('/', function(req, res, next) {
    const pageOptions = {
      title: 'AUTH1-SERVER',
      isAuthenticated: req.isAuthenticated(),
    };
    res.render('index', pageOptions);
  });

  app.use('/register', registerRouter);
  app.use('/login', loginRouter);
  app.use('/logout', logoutRouter);
  app.use('/social', socialRouter);
  app.use('/token', tokenRouter);
  app.use('/authorize', authorizeRouter);

  app.use('/userinfo', userinfoRouter);

  app.use('/dialog', ensureAuthenticated, authRouter);
  app.use('/users', ensureAuthenticated, usersRouter);
}

module.exports = {
  applyRoutes,
};
