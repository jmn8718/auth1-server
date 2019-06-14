const { indexOf } = require('lodash');
const { logger } = require('../../logger');
const { Client } = require('../../db/client');

function verifyClient(clientId, redirectUri, scope, type, done) {
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
}

module.exports = {
  validateResponse: verifyClient,
};
