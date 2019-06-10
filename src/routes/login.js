const express = require('express');
const { passport } = require('../auth');
const { findKey, get } = require('lodash');
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
    failureRedirect: '/login',
    failureMessage: true,
  }),
  function(req, res, next) {
    logger.debug('Successfully logged with username/password');
    next();
  },
  function redirect(req, res, next) {
    const sessionState = get(req, 'session.state', {});
    console.log(sessionState);
    const state = findKey(sessionState, function({ name }) {
      return name === 'login';
    });

    // login from authorize flow
    if (state) {
      res.redirect(`/login/callback?state=${state}`);
    } else {
      res.redirect('/users');
    }
  }
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
