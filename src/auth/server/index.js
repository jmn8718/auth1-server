const { createServer } = require('oauth2orize');
const { extensions } = require('oauth2orize-audience');
const { Client } = require('../../db/client');
const { logger } = require('../../logger');
const server = createServer();
const { registerCodeFlow } = require('./code');
const { registerImplicitFlow } = require('./implicit');

server.serializeClient(function(client, done) {
  logger.debug('SERIALIZE CLIENT => ' + JSON.stringify(client));
  return done(null, client.id);
});

server.deserializeClient(function(id, done) {
  logger.debug('DESERIALIZE CLIENT => ' + JSON.stringify(id));
  Client.findById(id, function(err, client) {
    if (err) {
      return done(err);
    }
    return done(null, client);
  });
});

// https://auth0.com/docs/flows
registerCodeFlow(server);
registerImplicitFlow(server);

logger.debug('Adding oauth2orize audience extension');
server.grant(extensions());

module.exports = {
  server,
};
