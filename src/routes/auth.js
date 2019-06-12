const express = require('express');
const { indexOf } = require('lodash');
const router = express.Router();
const { ensureLoggedIn } = require('connect-ensure-login');
const { server } = require('../auth/server');
const { Client } = require('../db/client');
const { Grant } = require('../db/grant');
const { logger } = require('../logger');

router.get(
  '/',
  ensureLoggedIn('/login'),
  server.authorize(
    function(clientId, redirectUri, scope, type, done) {
      logger.debug('authorize ---> ' + clientId + ' . ' + redirectUri);
      logger.debug('scope ---> ' + scope + ' . ' + type);
      Client.findOne({ clientId }, { __v: false }, function(err, client) {
        if (err) {
          return done(err);
        }
        logger.debug('client +-> ' + JSON.stringify(client));
        if (!client) {
          return done(null, false);
        }
        if (indexOf(client.redirectUri, redirectUri) === -1) {
          return done(null, false);
        }
        return done(null, client, redirectUri);
      });
    },
    function(tx, done) {
      const { client, user } = tx;
      Grant.findOne(
        { userId: user.userId, clientId: client.clientId },
        function(err, grant) {
          logger.debug(grant);
          done(err, !!grant);
        }
      );
    }
  ),
  function(req, res, next) {
    const { transactionID, client, user } = req.oauth2;
    logger.debug(
      'consent +=> ' +
        JSON.stringify({ userId: user.userId, clientId: client.clientId })
    );
    res.render('consentForm', {
      action: `/oauth/authorize/decision?transaction_id=${transactionID}`,
      client,
      title: 'Consent',
      buttonLabel: 'Accept',
      isAuthenticated: true,
      user: req.user,
    });
  }
);

router.post(
  '/decision',
  ensureLoggedIn('/login'),
  function deny(req, res, next) {
    if (req.body.cancel) {
      next(new Error('consent denied'));
    }
    next();
  },
  server.decision(function(req, done) {
    const { user, oauth2 } = req;
    const { client } = oauth2;
    const grantData = { userId: user.userId, clientId: client.clientId };
    Grant.findOneAndUpdate(
      grantData,
      grantData,
      { upsert: true, new: true },
      function(err, grant) {
        if (err) {
          return done(err);
        }
        logger.debug('grant saved => ' + JSON.stringify(grant));
        return done(null, { scope: req.scope });
      }
    );
  })
);

module.exports = router;
