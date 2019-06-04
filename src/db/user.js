const mongoose = require('mongoose');
const { hash } = require('../auth/utils');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  connection: {
    type: String,
    required: true,
  },
  profile: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

UserSchema.pre('save', async function() {
  if (this.isNew) {
    this.password = await hash(this.password);
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = {
  UserSchema,
  User,
};
