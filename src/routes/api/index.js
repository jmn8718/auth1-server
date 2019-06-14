const passport = require('passport');
const express = require('express');
const router = express.Router();

const clientsRouter = require('./clients');

const isBearerAuthenticated = passport.authenticate(['bearer'], {
  session: false,
});

router.use('/clients', isBearerAuthenticated, clientsRouter);

module.exports = router;
