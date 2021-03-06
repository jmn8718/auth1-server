const { exchange, grant } = require('oauth2orize');
const { get } = require('lodash');
const {
  AuthorizationCode,
  generateAuthorizationCode,
} = require('../../db/authorizationCode');
const { AccessToken } = require('../../db/accessToken');
const { logger } = require('../../logger');
const { generateClaimsAndSign } = require('../token');

function registerCodeFlow(server) {
  server.grant(
    grant.code(async function(client, redirectUri, user, ares, areq, done) {
      const areqScope = get(areq, 'scope');
      const scope = Array.isArray(areq.scope) ? areqScope.join(' ') : areqScope;
      try {
        const authorizationCode = await generateAuthorizationCode({
          clientId: client.clientId,
          redirectUri,
          userId: user.userId,
          scope,
        });
        logger.debug(
          `AC (${authorizationCode.code}) => ${JSON.stringify(
            authorizationCode
          )}`
        );
        return done(null, authorizationCode.code);
      } catch (err) {
        done(err);
      }
    })
  );

  server.exchange(
    exchange.code(function(client, code, redirectUri, done) {
      AuthorizationCode.findOne(
        { code },
        { scope: true, userId: true, clientId: true, redirectUri: true },
        function(err, authorizationCode) {
          if (err) {
            logger.error(err);
            return done(err);
          }

          logger.debug('AZCODE' + JSON.stringify(authorizationCode));
          if (!authorizationCode) {
            return done(null, false);
          }
          logger.debug('AZCODE CLIENT ' + JSON.stringify(client));
          logger.debug('AZCODE redirectUri ' + redirectUri);
          if (redirectUri !== authorizationCode.redirectUri) {
            return done(null, false);
          } else if (
            client.clientId &&
            client.clientId !== authorizationCode.clientId
          ) {
            // support client secret
            return done(null, false);
          }

          const token = generateClaimsAndSign({
            user_id: authorizationCode.userId,
          });

          const accessToken = new AccessToken({
            token,
            userId: authorizationCode.userId,
            clientId: authorizationCode.clientId,
            scope: authorizationCode.scope,
          });
          accessToken.save(function(err) {
            if (err) {
              return done(err);
            }
            return done(null, token);
          });
        }
      );
    })
  );
}

module.exports = {
  registerCodeFlow,
};
