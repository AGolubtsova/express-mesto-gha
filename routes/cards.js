const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likedCard,
  dislikedCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createCard);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', likedCard);

router.delete('/:cardId/likes', dislikedCard);

module.exports = router;