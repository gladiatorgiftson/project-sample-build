const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
// bookSchema.virtual('coverImagePath').get(function() {
//   if (this.coverImage != null && this.coverImageType != null) {
//     return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
//   }
// })


