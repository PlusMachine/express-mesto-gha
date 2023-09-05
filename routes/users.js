const router = require('express').Router();
const {
  getUsers, getUserById, updateUser, updateAvatar, getUserDetails,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/', getUserDetails);

router.get('/:id', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
