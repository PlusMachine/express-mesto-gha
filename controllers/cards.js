const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_SERVER_ERROR,
} = require('http2').constants;

const mongoose = require('mongoose');
const Cards = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const getCards = (req, res, next) => {
  Cards.find()
    .then((users) => res.status(HTTP_STATUS_OK).send(users))
    .catch(next);
};

const createCard = (req, res, next) => {
  req.body.owner = req.user._id;
  Cards.create({ ...req.body })
    .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else { next(err); }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Cards.findByIdAndDelete(cardId)
    .orFail()
    .then(() => {
      res.status(HTTP_STATUS_OK).send({ message: 'Card was deleted' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Card ${cardId} not found`));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Wrong id: ${req.params.userId}`));
      } else {
        next();
      }
    });
};

const likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) { return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Wrong _id' }); }
      return res.status(HTTP_STATUS_CREATED).send(card);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid ID' });
      }
      return res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Server error' });
    });
};

const dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) { return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Wrong _id' }); }
      return res.status(HTTP_STATUS_OK).send(card);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid ID' });
      }
      return res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Server error' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
