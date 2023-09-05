const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createUser,
} = require('../controllers/users');
const { emailRegex, httpRegex } = require('../utils/regex');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(httpRegex),
    email: Joi.string().required().pattern(emailRegex),
    password: Joi.string().required().min(3),
  }),
}), createUser);

module.exports = router;
