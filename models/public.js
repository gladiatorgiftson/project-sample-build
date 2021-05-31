const mongoose = require('mongoose');

const publicKeySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  publicKey: {
    type: String,
    required : true
  }
});

const publicKey = mongoose.model('publicUserKey', publicKeySchema);

module.exports = publicKey;