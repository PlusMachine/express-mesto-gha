const Cards = require('../models/card');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_SERVER_ERROR,
} = require('../errors/httpStatusCodes');

const getCards = (req, res) => {
  Cards.find()
    .then((users) => res.status(HTTP_STATUS_OK).send(users))
    .catch(() => res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Server Error' }));
};

const createCard = (req, res) => {
  const { _id } = req.user;
  req.body.owner = _id;
  Cards.create({ ...req.body })
    .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send(
          { message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` },
        );
      }
      return res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Server Error' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Cards.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Card not found' });
      }
      return res.status(HTTP_STATUS_OK).send(card);
    })
    .catch(() => res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Server Error' }));
};

const likeCard = (req, res) => {
  const { _id } = req.user;
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  )
    .then((card) => {
      if (!card) { return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Wrong _id' }); }
      return res.status(HTTP_STATUS_CREATED).send(card);
    })
    .catch(() => res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Server Error' }));
};

const dislikeCard = (req, res) => {
  const { _id } = req.user;
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: _id } },
    { new: true },
  )
    .then((card) => {
      if (!card) { return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Wrong _id' }); }
      return res.status(HTTP_STATUS_OK).send(card);
    })
    .catch(() => res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Server Error' }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
