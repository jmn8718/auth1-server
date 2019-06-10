const xenv = require('xenv');
const { extend } = require('lodash');

const env = extend({}, process.env);

const schema = {
  SERVER_HOST: {
    type: 'string',
    default: 'http://localhost',
  },
  SERVER_PORT: {
    type: 'int',
    default: 8080,
  },
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
  COOKIE_MAX_AGE: {
    type: 'int',
    default: 360000,
  },
  GITHUB_CLIENT_ID: {
    type: 'string',
    default: 'client_id',
  },
  GITHUB_CLIENT_SECRET: {
    type: 'string',
    default: 'client_secret',
  },
  GOOGLE_CLIENT_ID: {
    type: 'string',
    default: 'client_id',
  },
  GOOGLE_CLIENT_SECRET: {
    type: 'string',
    default: 'client_secret',
  },
};

module.exports = xenv({ schema }, env);
