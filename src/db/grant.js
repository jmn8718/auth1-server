const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GrantSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  scope: [
    {
      type: String,
      default: [],
    },
  ],
  audience: {
    type: String,
    default: '',
  },
});

const Grant = mongoose.model('Grant', GrantSchema);

module.exports = {
  GrantSchema,
  Grant,
};
