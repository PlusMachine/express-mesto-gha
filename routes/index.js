const router = require('express').Router();
const signUpRouter = require('./signup');
const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/signup', signUpRouter);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

module.exports = router;
