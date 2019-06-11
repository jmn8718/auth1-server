const uid = require('node-uid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { validateScopes } = require('../auth/utils');

const AuthorizationCodeSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  redirectUri: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  scope: {
    type: String,
    required: false,
    default: '',
  },
});

AuthorizationCodeSchema.pre('save', async function() {
  const { scope } = this;

  this.scope = validateScopes(scope);
});

const AuthorizationCode = mongoose.model(
  'AuthorizationCode',
  AuthorizationCodeSchema
);

async function generateAuthorizationCode({
  code,
  clientId,
  redirectUri,
  userId,
  scope,
}) {
  if (!code) {
    code = generateCode(16);
  }

  const authorizationCode = new AuthorizationCode({
    code,
    clientId,
    redirectUri,
    userId,
    scope,
  });

  await authorizationCode.save();
  return authorizationCode;
}

function generateCode(length = 16) {
  return uid(length);
}

module.exports = {
  AuthorizationCodeSchema,
  AuthorizationCode,
  generateAuthorizationCode,
  generateCode,
};
