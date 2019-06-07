const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../env');

async function hash(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

async function compare(password, hash = '') {
  return await bcrypt.compare(password, hash);
}

// https://openid.net/specs/openid-connect-core-1_0.html#ScopeClaims
const VALID_SCOPES = {
  openid: 'openid',
  profile: 'profile',
  email: 'email',
  address: 'address',
  phone: 'phone',
};

function validateScopes(scope = '') {
  return scope
    .split(' ')
    .filter(function(currentScope) {
      return !!VALID_SCOPES[currentScope];
    })
    .join(' ');
}
module.exports = {
  hash,
  compare,
  validateScopes,
};
