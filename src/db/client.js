const uid = require('node-uid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  clientId: {
    type: String,
    required: true,
    unique: true,
  },
  clientSecret: {
    type: String,
    required: true,
  },
  redirectUri: [
    {
      type: String,
      required: true,
    },
  ],
  userId: {
    type: String,
    default: '',
  },
});

function generateClientId() {
  return uid(8);
}

function generateClientSecret() {
  return uid(16);
}

ClientSchema.pre('validate', async function() {
  if (this.isNew) {
    if (!this.clientId) {
      this.clientId = await generateClientId();
    }
    if (!this.clientSecret) {
      this.clientSecret = await generateClientSecret();
    }
  }

  if (this.redirect_uri) {
    this.redirectUri = this.redirect_uri;
    delete this.redirectUri;
  }

  if (!Array.isArray(this.redirectUri)) {
    this.redirectUri = this.redirectUri.split(' ');
  }
});

const Client = mongoose.model('Client', ClientSchema);

module.exports = {
  ClientSchema,
  Client,
  generateClientId,
  generateClientSecret,
};
