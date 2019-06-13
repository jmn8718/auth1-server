const jwt = require('jsonwebtoken');
const moment = require('moment');
const { assign } = require('lodash');
const {
  JWT_SIGNING_KEY,
  JWT_EXPIRATION_SECONDS,
  SERVER_HOST,
} = require('../env');
const { logger } = require('../logger');

function sign(claims, options = {}) {
  const token = jwt.sign(claims, JWT_SIGNING_KEY, options);
  return token;
}

function verify(token, options = {}) {
  try {
    const decoded = jwt.verify(token, JWT_SIGNING_KEY, options);
    return { decoded };
  } catch (err) {
    logger.error(`Error verifying token '${token}' ${JSON.stringify(err)}`);
    const error = new Error(err.message);
    error.status = 401;
    return { error };
  }
}
function generateClaimsAndSign(context, signOptions) {
  const now = moment();
  const { user_id, ...rest } = context;

  const commonClaims = {
    iss: SERVER_HOST,
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
  verify,
};
