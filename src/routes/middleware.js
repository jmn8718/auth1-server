const { get, assign } = require('lodash');
const { passport } = require('../auth');
const { logger } = require('../logger');
const { manager } = require('../auth/flowstate');

module.exports.checkLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/users');
  }
  next();
};

module.exports.ensureAuthenticated = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
};

module.exports.redirectCompleteWithFlowState = function(req, res, next) {
  const flowState = get(req, 'state', {});
  if (flowState.handle) {
    return manager.complete('login')(req, res, next);
  } else {
    return res.redirect('/users');
  }
};

module.exports.handlePassportWithState = function(
  strategy = '',
  strategyOptions = {}
) {
  return function(req, res, next) {
    logger.debug(`passport middleware for ${strategy}`);
    const state = get(req, 'query.state', '');
    const flowState = get(req, 'state', {});
    const options = {};
    if (state && state === flowState.handle) {
      options.state = state;
    }
    return passport.authenticate(strategy, assign(options, strategyOptions))(
      req,
      res,
      next
    );
  };
};
