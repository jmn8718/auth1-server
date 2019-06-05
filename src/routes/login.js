const express = require('express');
const { passport } = require('../auth');
const router = express.Router();

const { checkLoggedIn } = require('./middleware');

router.get('/', checkLoggedIn, function(req, res, next) {
  const pageOptions = {
    title: 'LOGIN',
    buttonLabel: 'Sign in',
    action: '/login',
  };
  const errorMessages = req.session.messages;
  if (errorMessages && errorMessages.length > 0) {
    pageOptions.error = errorMessages.join(', ');
  }
  res.render('authForm', pageOptions);
});

router.post(
  '/',
  passport.authenticate('local', {
    successReturnToOrRedirect: '/users',
    failureRedirect: '/login',
    failureMessage: true,
  })
);

module.exports = router;
