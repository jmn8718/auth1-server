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

const AuthorizationCode = mongoose.model(
  'AuthorizationCode',
  AuthorizationCodeSchema
);

module.exports = {
  AuthorizationCodeSchema,
  AuthorizationCode,
};
