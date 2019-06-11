const express = require('express');
const { passport } = require('../auth');
const { findKey, get } = require('lodash');
const { logger } = require('../logger');
const router = express.Router();
const { store, manager } = require('../auth/flowstate');
const {
  redirectCompleteWithFlowState,
  checkLoggedIn,
} = require('./middleware');

router.get('/', checkLoggedIn, function(req, res, next) {
  const pageOptions = {
    title: 'LOGIN',
    buttonLabel: 'Sign in',
    action: '/login',
    redirectTo: '/register',
    redirectToMessage: 'Go to register',
    githubHref: '/social/github',
    googleHref: '/social/google',
  };
  const errorMessages = req.session.messages;
  if (errorMessages && errorMessages.length > 0) {
    pageOptions.error = errorMessages.join(', ');
    req.session.messages = [];
  }

  if (get(req, 'query.state') && get(req, 'session.state')) {
    const loginState = { name: 'login', prev: req.query.state };
    logger.debug(
      'Redirected to login from authorize => loginState: ' +
        JSON.stringify(loginState)
    );
    store.save(req, loginState, null, function(err, handle) {
      pageOptions.action = pageOptions.action + '?state=' + handle;
      pageOptions.githubHref = pageOptions.githubHref + '?state=' + handle;
      pageOptions.googleHref = pageOptions.googleHref + '?state=' + handle;
      res.render('authForm', pageOptions);
    });
  } else {
    res.render('authForm', pageOptions);
  }
});

router.post(
  '/',
  manager.loadState('login'),
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureMessage: true,
  }),
  function(req, res, next) {
    logger.debug('Successfully logged with username/password');
    next();
  },
  redirectCompleteWithFlowState
);

module.exports = router;
