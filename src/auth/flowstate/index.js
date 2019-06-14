const flowstate = require('flowstate');
const { get } = require('lodash');
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
      const returnTo = get(req, 'state.returnTo', '');
      if (returnTo) {
        return res.redirect(returnTo);
      }
      next();
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
