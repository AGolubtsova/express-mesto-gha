const router = require('express').Router();
const { validateCard, validateCardId } = require('../middlewares/validation');

const {
  getCards,
  createCard,
  deleteCard,
  likedCard,
  dislikedCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', validateCard, createCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, likedCard);
router.delete('/:cardId/likes', validateCardId, dislikedCard);

module.exports = router;