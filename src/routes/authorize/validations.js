const { indexOf, filter } = require('lodash');
const { Client } = require('../../db/client');

const VALID_RESPONSE_TYPES = ['code', 'id_token', 'token'];

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

  const responseTypes = filter(response_type.split(' '), function(type) {
    return indexOf(VALID_RESPONSE_TYPES, type) === -1;
  });

  if (responseTypes.length > 0) {
    message = `Invalid response_type: ${responseTypes.join(', ')}`;
  } else {
    try {
      // TODO search with redirectUri
      const client = await Client.findOne(
        { clientId: client_id },
        { clientId: true, redirectUri: true }
      );

      if (!client) {
        message = 'Invalid client_id';
      } else if (indexOf(client.redirectUri, redirect_uri) === -1) {
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

module.exports = {
  validateClient,
  validateParams,
  VALID_RESPONSE_TYPES,
};
