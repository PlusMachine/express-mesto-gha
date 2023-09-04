const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The "name" field is required.'],
    minlength: [2, 'The minimum length of the "name" field should be at least 2 characters.'],
    maxlength: [30, 'The maximum length of the "name" field should be no more than 30 characters.'],
  },

  about: {
    type: String,
    required: [true, 'The "about" field is required.'],
    minlength: [2, 'The minimum length of the "about" field should be at least 2 characters.'],
    maxlength: [30, 'The maximum length of the "about" field should be no more than 30 characters.'],
  },
  avatar: {
    type: String,
    required: [true, 'The "avatar" field is required.'],
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
