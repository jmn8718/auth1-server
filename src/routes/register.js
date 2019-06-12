const express = require('express');
const { get } = require('lodash');
const router = express.Router();
const { User } = require('../db/user');
const { logger } = require('../logger');
const { manager } = require('../auth/flowstate');
const {
  redirectCompleteWithFlowState,
  checkLoggedIn,
} = require('./middleware');

router.get('/', checkLoggedIn, function(req, res, next) {
  const pageOptions = {
    title: 'REGISTER',
    buttonLabel: 'Sign up',
    action: '/register',
    redirectTo: '/login',
    redirectToMessage: 'Go to Login',
    githubHref: '/oauth/github',
    googleHref: '/oauth/google',
  };
  const errorMessages = req.flash('error-register');
  if (errorMessages.length > 0) {
    pageOptions.error = errorMessages.join(', ');
    req.session.messages = [];
  }

  const state = get(req, 'query.state');
  if (state && get(req, 'session.state')) {
    logger.debug(
      'Redirected to register from login => state ' + JSON.stringify(state)
    );
    pageOptions.action = pageOptions.action + '?state=' + state;
    pageOptions.githubHref = pageOptions.githubHref + '?state=' + state;
    pageOptions.googleHref = pageOptions.googleHref + '?state=' + state;
    pageOptions.redirectTo = pageOptions.redirectTo + '?state=' + state;
    res.render('authForm', pageOptions);
  } else {
    res.render('authForm', pageOptions);
  }
});

router.post(
  '/',
  manager.loadState('login'),
  async function(req, res, next) {
    const { username, password } = req.body;
    logger.info(`Register new user: ${JSON.stringify(req.body)}`);
    if (!username || !password) {
      return next(new Error('Username and password are required'));
    }

    const userId = `local-${username}`;
    const connection = 'local';
    const newUser = new User({ username, password, userId, connection });
    try {
      await newUser.save();
      req.login(newUser, function(err) {
        if (err) {
          return next(err);
        }
        next();
      });
    } catch (err) {
      logger.error(err);
      if (err.code === 11000) {
        return next(new Error('User already exist'));
      }
      return next(new Error('Error creating the user, try again'));
    }
  },
  function(err, req, res, next) {
    logger.error(err);
    if (err) {
      let failureRedirect = '/register';
      const failureMessage = err.message;
      const state = get(req, 'query.state');
      const flowState = get(req, 'state', {});
      if (state && state === flowState.handle) {
        failureRedirect = failureRedirect + '?state=' + state;
      }
      req.flash('error-register', failureMessage);
      logger.error(
        `Error creating the user => ${failureMessage} || redirectTo: ${failureRedirect}`
      );
      return res.redirect(failureRedirect);
    }
    next();
  },
  redirectCompleteWithFlowState
);

module.exports = router;
