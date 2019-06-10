const express = require('express');
const { findKey, get } = require('lodash');
const { passport } = require('../auth');
const router = express.Router();
const { logger } = require('../logger');

function redirect(req, res, next) {
  const sessionState = get(req, 'session.state', {});
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

router.get('/github', passport.authenticate('github'));
router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  function(req, res, next) {
    logger.debug('Successfully logged with github');
    next();
  },
  redirect
);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  function(req, res, next) {
    logger.debug('Successfully logged with google');
    next();
  },
  redirect
);

module.exports = router;
