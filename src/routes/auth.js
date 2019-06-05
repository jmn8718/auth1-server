const express = require('express');
const router = express.Router();
const { ensureLoggedIn } = require('connect-ensure-login');
const { server } = require('../auth/server');
const { Client } = require('../db/client');
const { logger } = require('../logger');

router.get(
  '/authorize',
  ensureLoggedIn('/login'),
  server.authorize(function(clientId, redirectUri, done) {
    logger.debug('authorize ---> ' + clientId + ' . ' + redirectUri);
    Client.findOne({ clientId }, function(err, client) {
      if (err) {
        return done(err);
      }
      logger.debug('client +-> ' + JSON.stringify(client));
      if (!client) {
        return done(null, false);
      }
      if (client.redirectUri !== redirectUri) {
        return done(null, false);
      }
      return done(null, client, client.redirectUri);
    });
  }),
  function(req, res) {
    const { transactionID, client } = req.oauth2;
    res.render('consentForm', {
      action: `/dialog/authorize/decision?transaction_id=${transactionID}`,
      client,
      title: 'Consent',
      buttonLabel: 'Accept',
    });
  }
);

router.post('/authorize/decision', ensureLoggedIn('/login'), server.decision());

module.exports = router;
