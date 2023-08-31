const Users = require('../models/user');

const getUsers = (req, res) => {
  Users.find()
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Server Error' }));
};

const getUserById = (req, res) => {
  const { id } = req.params;
  return Users.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.status(200).send(user);
    })
    .catch(() => res.status(500).send({ message: 'Server Error' }));
};

const createUser = (req, res) => {
  Users.create({ ...req.body })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send(
          { message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` },
        );
      } else {
        res.status(500).send({ message: 'Server Error' });
      }
    });
};

const updateUser = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  return Users.findByIdAndUpdate(_id, { name, about }, { new: true })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send(
          { message: `${Object.values(err.errors).map((err) => err.message).join(', ')}` },
        );
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const updateAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  return Users.findByIdAndUpdate(_id, { avatar }, { new: true })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send(
          { message: `${Object.values(err.errors.map(() => err.message).join(', '))}` },
        );
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
