const oauth2orize = require('oauth2orize');
const openid = require('oauth2orize-openid');
const { AccessToken } = require('../../db/accessToken');
const uid = require('node-uid');
const { get } = require('lodash');
const { logger } = require('../../logger');
const { generateClaimsAndSign } = require('../token');

function handleIdToken(client, user, ares, areq, done) {
  logger.debug('id client => ' + JSON.stringify(client));
  logger.debug('id user => ' + JSON.stringify(user));
  logger.debug('id areq => ' + JSON.stringify(areq));
  const idToken = uid(128);
  done(null, idToken);
}

function handleCode(client, redirect_uri, user, done) {
  logger.debug('code client => ' + JSON.stringify(client));
  logger.debug('code redirect_uri => ' + JSON.stringify(redirect_uri));
  logger.debug('code user => ' + JSON.stringify(user));
  const code = uid();
  done(null, code);
}

function handleToken(client, user, ares, areq, done) {
  logger.debug('token ares => ' + JSON.stringify(ares));
  logger.debug('token areq => ' + JSON.stringify(areq));
  logger.debug('token client => ' + JSON.stringify(client));
  logger.debug('token user => ' + JSON.stringify(user));
  const token = generateClaimsAndSign({
    user_id: user.userId,
  });
  const scope = get(areq, 'scope', []);
  const accessToken = new AccessToken({
    token,
    userId: user.userId,
    clientId: client.clientId,
    scope: scope.join(' '),
  });
  accessToken.save(function(err) {
    if (err) {
      return done(err);
    }
    return done(null, token);
  });
}

function registerImplicitFlow(server) {
  // Implicit Flow

  // id_token grant type.
  server.grant(openid.grant.idToken(handleIdToken));

  // id_token grant type.
  server.grant(openid.grant.idTokenToken(handleToken, handleIdToken));

  // Hybrid Flow

  // 'code id_token' grant type.
  server.grant(openid.grant.codeIDToken(handleCode, handleIdToken));

  // 'code token' grant type.
  server.grant(openid.grant.codeToken(handleToken, handleCode));

  // 'code id_token token' grant type.
  server.grant(
    openid.grant.codeIdTokenToken(handleToken, handleCode, handleIdToken)
  );

  // Grant implicit authorization
  server.grant(oauth2orize.grant.token(handleToken));
}

module.exports = {
  registerImplicitFlow,
};
