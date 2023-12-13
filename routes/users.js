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
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateUserInfo, updateUser);
router.patch('/me/avatar',  validateUserAvatar, updateUserAvatar);
router.get('/me', getCurrentUser);

module.exports = router;