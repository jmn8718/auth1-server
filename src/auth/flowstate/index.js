const flowstate = require('flowstate');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { get } = require('lodash');
const { JWT_SIGNING_KEY, JWT_EXPIRATION_SECONDS } = require('../../env');
const { logger } = require('../../logger');

const Manager = flowstate.Manager;
const store = new flowstate.SessionStore();
const manager = new Manager(store);

manager.use(
  'authorize',
  [],
  [
    function(req, res, next) {
      logger.debug(
        'Executing authorize resume middleware chain => ' +
          JSON.stringify(req.session.state)
      );
      next();
    },
    manager.complete('authorize'),
    function(req, res, next) {
      logger.debug(
        'Completing authorize transaction and redirecting user back to client => ' +
          JSON.stringify(req.session.state)
      );
      next();
    },
    function(req, res, next) {
      const user = get(req, 'locals.user', {});
      const state = get(req, 'state', {});
      const now = moment();

      const claims = {
        iss: 'http://localhost:8080',
        sub: user.userId,
        iat: now.unix(),
        exp: now.add(JWT_EXPIRATION_SECONDS, 'seconds').unix(),
      };

      const token = jwt.sign(claims, JWT_SIGNING_KEY);
      res.redirect(
        `${state.redirect_uri}/#access_token=${token}&state=${req.state.state}`
      );
    },
  ]
);

manager.transition('authorize', 'login', [
  function(req, res, next) {
    logger.debug(
      'Transition from /login to authorize => ' +
        JSON.stringify(req.session.state)
    );
    next();
  },
  function(req, res, next) {
    req.locals = req.locals || {};
    req.locals.user = req.user || {};
    next();
  },
]);

module.exports = {
  manager,
  store,
};
