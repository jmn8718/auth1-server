const bcrypt = require('bcrypt');
const { difference, keys } = require('lodash');
const { SALT_ROUNDS } = require('../env');

async function hash(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

async function compare(password, hash = '') {
  return await bcrypt.compare(password, hash);
}

// https://openid.net/specs/openid-connect-core-1_0.html#ScopeClaims
const VALID_OPENID_SCOPES = {
  openid: 'openid',
  profile: 'profile',
  email: 'email',
  address: 'address',
  phone: 'phone',
};

const VALID_OPENID_SCOPES_KEYS = keys(VALID_OPENID_SCOPES);
function validateScopes(scope = '') {
  return scope
    .split(' ')
    .filter(function(currentScope) {
      return !!VALID_OPENID_SCOPES[currentScope];
    })
    .join(' ');
}

function invalidScopes(scopes = [], audienceScopes = []) {
  const invalidScopes = difference(scopes, [
    ...audienceScopes,
    ...VALID_OPENID_SCOPES_KEYS,
  ]);
  return invalidScopes;
}

module.exports = {
  hash,
  compare,
  validateScopes,
  invalidScopes,
};
