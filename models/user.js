const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { httpRegex, emailRegex } = require('../utils/regex');

const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'The minimum length of the "name" field should be at least 2 characters.'],
    maxlength: [30, 'The maximum length of the "name" field should be no more than 30 characters.'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'The minimum length of the "about" field should be at least 2 characters.'],
    maxlength: [30, 'The maximum length of the "about" field should be no more than 30 characters.'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(url) {
        return httpRegex.test(url);
      },
      message: 'Wrong url',
    },
  },
  email: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    unique: true,
    validate: {
      validator(email) {
        return emailRegex.test(email);
      },
      message: 'Введите верный email',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Wrong email or password');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Wrong email or password');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
