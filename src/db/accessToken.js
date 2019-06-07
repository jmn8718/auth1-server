const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { validateScopes } = require('../auth/utils');

const AccessTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  clientId: {
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

const AccessToken = mongoose.model('AccessToken', AccessTokenSchema);

AccessTokenSchema.pre('save', function() {
  const { scope } = this;

  this.scope = validateScopes(scope);
});

module.exports = {
  AccessTokenSchema,
  AccessToken,
};
