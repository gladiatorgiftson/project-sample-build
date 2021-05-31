const mongoose = require('mongoose');

const UserKeySchema = new mongoose.Schema({
   email: {
    type: String,
    required: true
  },
  privateKey: {
    type: String,
    required: true
  },
   publicKey: {
    type: String,
    required : true
  }
});

const UserKey = mongoose.model('UserKey', UserKeySchema);

module.exports = UserKey;