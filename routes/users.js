const router = require('express').Router();
const
  {
    validateUserId,
    validateUserAvatar,
    validateUserInfo,
  } = require('../middlewares/validation');

const {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getCurrentUser
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateUserInfo, updateUser);
router.patch('/me/avatar',  validateUserAvatar, updateUserAvatar);

module.exports = router;