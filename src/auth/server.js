const { createServer, exchange, grant } = require('oauth2orize');
const uid = require('node-uid');
const { AuthorizationCode } = require('../db/authorizationCode');
const { AccessToken } = require('../db/accessToken');
const { Client } = require('../db/client');
const { Grant } = require('../db/grant');
const { logger } = require('../logger');
const server = createServer();

server.grant(
  grant.code(function(client, redirectUri, user, ares, done) {
    const code = uid(16);
    const authorizationCode = new AuthorizationCode({
      code,
      clientId: client.clientId,
      redirectUri,
      userId: user.userId,
      scope: ares.scope,
    });

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
    authorizationCode.save(function(err) {
      if (err) {
        return done(err);
      }
      logger.debug(`AC (${code}) => ${JSON.stringify(authorizationCode)}`);
      return done(null, code);
    });
      }
    );
  })
);

server.exchange(
  exchange.code(function(client, code, redirectUri, done) {
    AuthorizationCode.findOne(code, function(err, authorizationCode) {
      if (err) {
        logger.error(err);
        return done(err);
      }
      logger.debug('AZCODE' + JSON.stringify(authorizationCode));
      logger.debug('AZCODE CLIENT' + JSON.stringify(client));
      if (client.clientId !== authorizationCode.clientId) {
        return done(null, false);
      }
      if (redirectUri !== authorizationCode.redirectUri) {
        return done(null, false);
      }

      const token = uid(256);
      const accessToken = new AccessToken(
        token,
        authorizationCode.userId,
        authorizationCode.clientId,
        authorizationCode.scope
      );
      accessToken.save(function(err) {
        if (err) {
          return done(err);
        }
        return done(null, token);
      });
    });
  })
);

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

module.exports = {
  server,
};
