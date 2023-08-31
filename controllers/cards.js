const Cards = require('../models/card');

const getCards = (req, res) => {
  Cards.find()
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Server Error' }));
};

const createCard = (req, res) => {
  const { _id } = req.user;
  req.body.owner = _id;
  Cards.create({ ...req.body })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send(
          { message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` },
        );
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  if (req.params.cardId.length === 24) {
    Cards.findByIdAndDelete(cardId)
      .then((card) => {
        if (!card) {
          return res.status(404).send({ message: 'Card not found' });
        }
        return res.status(200).send(card);
      })
      .catch(() => res.status(500).send({ message: 'Server Error' }));
  } else {
    res.status(400).send({ message: 'Incorrect id card' });
  }
};

const likeCard = (req, res) => {
  const { _id } = req.user;
  if (req.params.cardId.length === 24) {
    Cards.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: _id } },
      { new: true },
    )
      .then((card) => {
        if (!card) { return res.status(404).send({ message: 'Wrong _id' }); }
        return res.status(201).send(card);
      })
      .catch(() => res.status(500).send({ message: 'Server Error' }));
  } else {
    res.status(400).send({ message: 'Incorrect id card' });
  }
};

const dislikeCard = (req, res) => {
  const { _id } = req.user;
  if (req.params.cardId.length === 24) {
    Cards.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: _id } },
      { new: true },
    )
      .then((card) => {
        if (!card) { return res.status(404).send({ message: 'Wrong _id' }); }
        return res.status(200).send(card);
      })
      .catch(() => res.status(500).send({ message: 'Server Error' }));
  } else {
    res.status(400).send({ message: 'Incorrect id card' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
