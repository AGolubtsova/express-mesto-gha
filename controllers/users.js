require('dotenv').config();

const { NODE_ENV, JWT_SECRET_KEY } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const validator = require('validator');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then(hash => User.create({ name, about, avatar, email, password: hash }))
    .then(user => {
      if (validator.isEmail(email) === false) {
        throw new BadRequestError('Указан неверный email');
      }
      res.status(201).send({ user: { name, about, avatar, email } })
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: err.message }));
      } if (err.code === 11000 || err.name === 'MongoServerError') {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      }
      next(err);
    })
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => { next(err); });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      next(new NotFoundError('Пользователь по данному id не найден'));
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError('Пользователь по данному id не найден'));
        return;
      }
      next(err);
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      next(new NotFoundError('Пользователь по данному id не найден'));
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError('Пользователь по данному id не найден'));
        return;
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id пользователя'));
        return;
      }
      next(err);
    });
  };

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, {name, about}, {
    new: true,
    runValidators: true,
  })
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    if (err.message === 'NotFound') {
      next(new NotFoundError('Пользователь по данному id не найден'));
      return;
    }
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы неккоректные данные'));
      return;
    }
  });
  next(err);
};

module.exports.updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
    new: true,
    runValidators: true,
  })
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы неккоректные данные при обновлении аватара'));
      return;
    }
    if (err.message === 'NotFound') {
      next(new NotFoundError('Пользователь с указанным _id не найден'));
      return;
    }
  });
  next(err);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET_KEY : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true });
      res.send({ token });
    })
    .catch(next);
};