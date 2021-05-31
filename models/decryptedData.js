const mongoose = require("mongoose");

const decryptedDataSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
});


const decryptedData = mongoose.model(
  "decryptedDataSchema",
  decryptedDataSchema
);

// decryptedDataSchema.virtual('filePath').get(function() {
//     if (this.fileType != null && this.fileType != null) {
//       return `data:${this.fileType};charset=utf-8;base64,${this.data.toString('base64')}`
//     }

module.exports = decryptedData;
