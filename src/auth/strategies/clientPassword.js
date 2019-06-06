const ClientPasswordStrategy = require('passport-oauth2-client-password')
  .Strategy;
const { Client } = require('../../db/client');
const { logger } = require('../../logger');

function registerStrategy(passport) {
  logger.debug('Registering Client Password strategy');

  passport.use(
    new ClientPasswordStrategy(function(clientId, clientSecret, done) {
      logger.debug('Client Password => ' + clientId + ' . ' + clientSecret);
      Client.findOne({ clientId }, function(err, client) {
        if (err) {
          return done(err);
        }
        if (!client || client.clientSecret !== clientSecret) {
          return done(null, false);
        }
        return done(null, client);
      });
    })
  );
}

module.exports = {
  registerStrategy,
};
