
const { SECRET_KEY } = require('../config');
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
    .then((user) => res.status(201).send({ name: user.name, about: user.about, avatar: user.avatar, email: user.email }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: err.message }));
      } if (err.code === 11000 || err.name === 'MongoServerError') {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      }
      next(err);
    })
};

module.exports.getUsers = (req, res, next) => {
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
      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
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

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, {name, about}, {
    new: true,
    runValidators: true,
  })
  .orFail(() => {
    next(new NotFoundError('Пользователь по данному id не найден'));
  })
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы неккоректные данные'));
      return;
    }
  });
  next(err);
};

module.exports.updateUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
    new: true,
    runValidators: true,
  })
  .orFail(() => {
    next(new NotFoundError('Пользователь по данному id не найден'));
  })
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы неккоректные данные при обновлении аватара'));
      return;
    }
    next(err);
  });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};