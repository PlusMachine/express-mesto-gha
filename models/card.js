const mongoose = require('mongoose');
const { httpRegex } = require('../utils/regex');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'The minimum length of the "name" field should be at least 2 characters.'],
    maxlength: [30, 'The maximum length of the "name" field should be no more than 30 characters.'],
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(r) {
        return httpRegex.test(r);
      },
      message: 'Wrong URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true],
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
