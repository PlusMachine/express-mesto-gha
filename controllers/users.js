const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_SERVER_ERROR,
} = require('http2').constants;

const mongoose = require('mongoose');
const Users = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const getUsers = (req, res) => {
  Users.find()
    .then((users) => res.status(HTTP_STATUS_OK).send(users))
    .catch(() => res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Server error' }));
};

const getUserById = (req, res, next) => {
  Users.findById(req.params.id)
    .orFail()
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Неверный id: ${req.params.userId}`));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Пользователь с id ${req.params.userId} не найден`));
      } else { next(err); }
    });
};

const createUser = (req, res, next) => {
  Users.create({ ...req.body })
    .then((user) => res.status(HTTP_STATUS_CREATED).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else { next(err); }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  return Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Пользователь с id ${req.params.userId} не найден`));
      } else { next(err); }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return Users.findByIdAndUpdate(req.params.id, { avatar }, { new: true, runValidators: true })
    .orFail
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Пользователь с id ${req.params.userId} не найден`));
      } else { next(err); }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
