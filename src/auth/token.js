const jwt = require('jsonwebtoken');
const moment = require('moment');
const { assign } = require('lodash');
const { JWT_SIGNING_KEY, JWT_EXPIRATION_SECONDS } = require('../env');

function sign(claims, options = {}) {
  const token = jwt.sign(claims, JWT_SIGNING_KEY, options);
  return token;
}

function generateClaimsAndSign(context, signOptions) {
  const now = moment();
  const { user_id, ...rest } = context;

  const commonClaims = {
    iss: 'http://localhost:8080',
    iat: now.unix(),
    exp: now.add(JWT_EXPIRATION_SECONDS, 'seconds').unix(),
    sub: user_id,
  };

  const claims = assign({}, rest, commonClaims);

  return sign(claims, signOptions);
}

module.exports = {
  sign,
  generateClaimsAndSign,
};
