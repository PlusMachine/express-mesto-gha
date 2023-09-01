const Users = require('../models/user');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_SERVER_ERROR,
} = require('../errors/httpStatusCodes');

const getUsers = (req, res) => {
  Users.find()
    .then((users) => res.status(HTTP_STATUS_OK).send(users))
    .catch(() => res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Server Error' }));
};

const getUserById = (req, res) => {
  const { id } = req.params;
  Users.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'User not found' });
      }
      return res.status(HTTP_STATUS_OK).send(user);
    })
    .catch(() => res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Server Error' }));
};

const createUser = (req, res) => {
  Users.create({ ...req.body })
    .then((user) => res.status(HTTP_STATUS_CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send(
          { message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` },
        );
      } else {
        res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Server Error' });
      }
    });
};

const updateUser = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  return Users.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send(
          { message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` },
        );
      }
      return res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Server Error' });
    });
};

const updateAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  return Users.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send(
          { message: `${Object.values(err.errors.map((error) => error.message).join(', '))}` },
        );
      }
      return res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Server Error' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
