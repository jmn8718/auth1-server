const express = require('express');
const { passport } = require('../auth');
const router = express.Router();
const { logger } = require('../logger');
const { manager } = require('../auth/flowstate');
const {
  redirectCompleteWithFlowState,
  handlePassportWithState,
} = require('./middleware');

router.get(
  '/github',
  manager.loadState('login'),
  handlePassportWithState('github')
);

router.get(
  '/github/callback',
  manager.loadState('login'),
  passport.authenticate('github', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  function(req, res, next) {
    logger.debug('Successfully logged with github');
    next();
  },
  redirectCompleteWithFlowState
);

router.get(
  '/google',
  manager.loadState('login'),
  handlePassportWithState('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  manager.loadState('login'),
  passport.authenticate('google', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  function(req, res, next) {
    logger.debug('Successfully logged with google');
    next();
  },
  redirectCompleteWithFlowState
);

module.exports = router;
