const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { httpRegex } = require('../utils/regex');

const {
  getUsers, getUserById, updateUser, updateAvatar, getUserDetails,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserDetails);

router.get('/:id', celebrate({
  params: Joi.object().keys({ id: Joi.string().length(24).hex().required() }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(httpRegex).required(),
  }),
}), updateAvatar);

module.exports = router;
