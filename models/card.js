const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The "name" field is required.'],
    minlength: [2, 'The minimum length of the "name" field should be at least 2 characters.'],
    maxlength: [30, 'The maximum length of the "name" field should be no more than 30 characters.'],
  },
  link: {
    type: String,
    required: [true, 'The "link" field is required.'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'The "owner" field is required.'],
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
