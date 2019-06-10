const express = require('express');
const { passport } = require('../auth');
const { get } = require('lodash');
const { logger } = require('../logger');
const router = express.Router();
const { store, manager } = require('../auth/flowstate');
const { checkLoggedIn } = require('./middleware');

router.get('/', checkLoggedIn, function(req, res, next) {
  const pageOptions = {
    title: 'LOGIN',
    buttonLabel: 'Sign in',
    action: '/login',
    redirectTo: '/register',
    redirectToMessage: 'Go to register',
  };
  const errorMessages = req.session.messages;
  if (errorMessages && errorMessages.length > 0) {
    pageOptions.error = errorMessages.join(', ');
  }

  if (get(req, 'query.state') && get(req, 'session.state')) {
    const loginState = { name: 'login', prev: req.query.state };
    logger.debug(
      'Redirected to login from authorize => loginState: ' +
        JSON.stringify(loginState)
    );
    store.save(req, loginState, null, function(err, handle) {
      res.render('authForm', pageOptions);
    });
  } else {
    res.render('authForm', pageOptions);
  }
});

router.post(
  '/',
  passport.authenticate('local', {
    successReturnToOrRedirect: '/users',
    failureRedirect: '/login',
    failureMessage: true,
  })
);

router.get(
  '/callback',
  manager.loadState('login'),
  function(req, res, next) {
    req.state = req.state || {};
    req.locals = req.locals || {};
    // req.locals.strategy = req.state.strategy;
    next();
  },
  manager.complete('login')
);

module.exports = router;
