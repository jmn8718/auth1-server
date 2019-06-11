const express = require('express');
const { logger } = require('../logger');
const router = express.Router();
const { store } = require('../auth/flowstate');
const { Client } = require('../db/client');
const { middleware } = require('flowstate');

function validateParams(req, res, next) {
  let message;

  const { client_id, redirect_uri, state, response_type } = req.query;

  if (!client_id) {
    message = `'Missing client_id`;
  } else if (!redirect_uri) {
    message = `'Missing redirect_uri`;
  } else if (!state) {
    message = 'Missing state';
  } else if (!response_type) {
    message = 'Missing response_type';
  }

  if (message) {
    const err = new Error(message);
    return next(err);
  }
  return next();
}

async function validateClient(req, res, next) {
  let message;
  const { client_id, redirect_uri, response_type } = req.query;

  if (response_type !== 'code' && response_type !== 'token') {
    message = `Invalid response_type: ${response_type}`;
  } else {
    try {
      // TODO search with redirectUri
      const client = await Client.findOne(
        { clientId: client_id },
        { clientId: true, redirectUri: true }
      );

      if (!client) {
        message = 'Invalid client_id';
      } else if (client.redirectUri !== redirect_uri) {
        message = 'Invalid redirect_uri';
      }
    } catch (err) {
      return next(err);
    }
  }

  if (message) {
    const err = new Error(message);
    return next(err);
  }
  return next();
}

// https://auth0.com/docs/protocols/oauth2#authorization-endpoint
router.get(
  '/',
  validateParams,
  validateClient,
  middleware.clean(store, {
    ttl: 259200000, // 3 days
    limit: 5,
  }),
  function(req, res, next) {
    logger.debug('Redirected to /authorize => ' + req.session.state);
    const {
      client_id,
      response_type,
      redirect_uri,
      state = '',
      scope = '',
    } = req.query;
    const authorizeState = {
      name: 'authorize',
      client_id,
      response_type,
      redirect_uri,
      scope,
      state,
    };

    store.save(req, authorizeState, null, function(err, handle) {
      logger.debug(
        `Saving authorize state and redirecting to /login?state=${handle}`
      );
      res.redirect(`/login?state=${handle}`);
    });
  }
);

module.exports = router;
