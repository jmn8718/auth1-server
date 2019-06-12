const express = require('express');
const qs = require('qs');
const { ensureLoggedIn } = require('connect-ensure-login');
const router = express.Router();

router.get('/', ensureLoggedIn('/login'), function(req, res, next) {
  const authorizeQs = {
    response_type: 'code token',
    client_id: 'id2019',
    scope: 'openid email',
    redirect_uri: 'http://localhost:8080/users/consent',
    nonce: Date.now(),
  };
  const pageOptions = {
    title: 'Users',
    isAuthenticated: true,
    userString: JSON.stringify(req.user),
    user: req.user,
    sessionString: JSON.stringify(req.session),
    consentUrl: `/dialog/authorize?${qs.stringify(authorizeQs)}`,
  };

  res.render('users', pageOptions);
});

router.get('/consent', ensureLoggedIn('/login'), function(req, res, next) {
  const { code } = req.query;
  if (code) {
    const pageOptions = {
      title: 'Users',
      isAuthenticated: true,
      user: req.user,
      code,
      clientId: 'id2019',
      clientSecret: 'secret2019',
      redirectUri: 'http://localhost:8080/users/consent',
      grantType: 'authorization_code',
    };

    res.render('exchange', pageOptions);
  } else {
    res.redirect('/users');
  }
});

module.exports = router;
