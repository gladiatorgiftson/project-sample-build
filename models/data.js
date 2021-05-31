const mongoose = require('mongoose');

const encryptedDataSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true
  },
  reciever: {
    type: String,
    required : true
  },
  ivHex: {
    type: String,
    required : true
  },
  authTag: {
    type: String,
    required : true
  },
  data : {
      type : String,
      required : true
  },
  fileType : {
      type : String,
      required : true
  },
  fileName : {
    type : String,
    required : true
}
});

const encryptedData = mongoose.model('encryptedDataSchema', encryptedDataSchema);

module.exports = encryptedData;
