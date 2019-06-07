const express = require('express');
const router = express.Router();
const { User } = require('../db/user');
const { logger } = require('../logger');

const { checkLoggedIn } = require('./middleware');

router.get('/', checkLoggedIn, function(req, res, next) {
  const pageOptions = {
    title: 'REGISTER',
    buttonLabel: 'Sign up',
    action: '/register',
    redirectTo: '/login',
    redirectToMessage: 'Go to Login',
  };
  const errorMessages = req.flash('error-register');
  if (errorMessages.length > 0) {
    pageOptions.error = errorMessages.join(', ');
  }
  res.render('authForm', pageOptions);
});

router.post('/', async function(req, res, next) {
  const { username, password } = req.body;
  logger.info(`Register new user: ${JSON.stringify(req.body)}`);
  if (!username || !password) {
    req.flash('error-register', 'Username and password are required');
    return res.redirect('/register');
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
      return res.redirect('/users/' + req.user.username);
    });
  } catch (err) {
    if (err.code === 11000) {
      req.flash('error-register', 'User already exist');
      return res.redirect('/register');
    }
    req.flash('error-register', 'Error creating the user, try again');
    return res.redirect('/register');
  }
});

module.exports = router;
