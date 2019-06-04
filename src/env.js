const xenv = require('xenv');
const { extend } = require('lodash');

const env = extend({}, process.env);

const schema = {
  PORT: {
    type: 'int',
    default: 80,
  },
  LOG_LEVEL: {
    type: 'string',
    default: 'debug',
    oneOf: ['error', 'info', 'debug'],
  },
  DB_HOST: {
    type: 'string',
    default: 'http://localhost:27017',
  },
  DB_NAME: {
    type: 'string',
    default: 'db',
  },
  SALT_ROUNDS: {
    type: 'int',
    default: 10,
  },
  SESSION_SECRET: {
    type: 'string',
    default: 's3cr3t',
  },
  COOKIE_SECRET: {
    type: 'string',
    default: 'c00k13',
  },
};

module.exports = xenv({ schema }, env);
