const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../env');

async function hash(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

async function compare(password, hash = '') {
  return await bcrypt.compare(password, hash);
}

module.exports = {
  hash,
  compare,
};
