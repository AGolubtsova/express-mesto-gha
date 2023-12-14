const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const Unauthorized = require('../errors/Unauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';

  if (!authorization || !authorization.startsWith(bearer)) {
    next(new Unauthorized('Необходима авторизация'));
    return;
  }

  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    next(new Unauthorized('Необходима авторизация'));
    return;
  }

  req.user = payload;

  next();
};