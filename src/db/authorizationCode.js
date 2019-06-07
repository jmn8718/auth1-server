const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

// https://openid.net/specs/openid-connect-core-1_0.html#ScopeClaims
const VALID_SCOPES = {
  profile: 'profile',
  email: 'email',
  address: 'address',
  phone: 'phone',
};

AuthorizationCodeSchema.pre('save', async function() {
  const { scope } = this;
  this.scope = scope
    .split(' ')
    .filter(function(currentScope) {
      return !!VALID_SCOPES[currentScope];
    })
    .join(' ');
});

const AuthorizationCode = mongoose.model(
  'AuthorizationCode',
  AuthorizationCodeSchema
);

module.exports = {
  AuthorizationCodeSchema,
  AuthorizationCode,
};
