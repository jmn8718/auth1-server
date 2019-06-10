const express = require('express');
const { logger } = require('../logger');
const router = express.Router();
const { store } = require('../auth/flowstate');
const { CLIENTS } = require('../db/data');

function validateParams(req, res, next) {
  let message;

  const { client_id, redirect_uri, state } = req.query;

  if (!client_id) {
    message = `'Missing client_id`;
  } else if (!redirect_uri) {
    message = `'Missing redirect_uri`;
  } else if (!state) {
    message = 'Missing state';
  }

  if (message) {
    const err = new Error(message);
    return next(err);
  }
  return next();
}

function validateClient(req, res, next) {
  const client = CLIENTS[1];
  let message;

  // TODO validate client from db
  const { client_id, redirect_uri, state } = req.query;
  if (client.clientId !== client_id) {
    message = 'Invalid client_id';
  } else if (client.redirectUri !== redirect_uri) {
    message = 'Invalid redirectUri';
  }
  if (message) {
    const err = new Error(message);
    return next(err);
  }
  return next();
}

router.get('/', validateParams, validateClient, function(req, res, next) {
  logger.debug('Redirected to /authorize => ' + req.session.state);
  const { client_id, response_type, redirect_uri, state } = req.query;
  const authorizeState = {
    name: 'authorize',
    client_id,
    response_type,
    redirect_uri,
    state,
  };

  store.save(req, authorizeState, null, function(err, handle) {
    logger.debug(
      `Saving authorize state and redirecting to /login?state=${handle}`
    );
    res.redirect(`/login?state=${handle}`);
  });
});

module.exports = router;