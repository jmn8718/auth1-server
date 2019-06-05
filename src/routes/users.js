const express = require('express');
const { ensureLoggedIn } = require('connect-ensure-login');
const router = express.Router();

router.get('/', ensureLoggedIn('/login'), function(req, res, next) {
  const pageOptions = {
    title: 'Users',
    isAuthenticated: true,
    userString: JSON.stringify(req.user),
    user: req.user,
    sessionString: JSON.stringify(req.session),
  };

  res.render('users', pageOptions);
});

router.get('/consent', ensureLoggedIn('/login'), function(req, res, next) {
  const pageOptions = {
    title: 'Users',
    isAuthenticated: true,
    user: req.user,
  };

  res.render('users', pageOptions);
});

module.exports = router;
