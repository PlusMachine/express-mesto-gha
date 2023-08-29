const Cards = require('../models/card');

const getCards = (req, res) => {
  Cards.find()
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send('Server Error'));
};

const createCard = (req, res) => {
  const { _id } = req.user;
  req.body.owner = _id;
  Cards.create({ ...req.body })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(400).send(
          { message: `${Object.values(err.errors).map(() => err.message).join(', ')}` },
        );
      }
      return res.status(500).send('Server Error');
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  return Cards.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Card not found' });
      }
      return res.status(200).send(card);
    })
    .catch(() => res.status(500).send('Server Error'));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
};
