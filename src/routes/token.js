const express = require('express');
const router = express.Router();
const { passport } = require('../auth');
const { server } = require('../auth/server');

router.post(
  '/',
  passport.authenticate(['oauth2-client-password'], {
    session: false,
  }),
  server.token(),
  server.errorHandler()
);

module.exports = router;
