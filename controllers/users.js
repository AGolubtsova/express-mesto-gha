const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы неккоректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Ошибка на сервере' }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы неккоректные данные'});
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, {name: req.body.name, about: req.body.about }, {
    new: true,
    runValidators: true,
  })
  .then((user) => {
    if (!user) {
      return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
    }
    return res.send({ data: user });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы неккоректные данные' });
    }
    return res.status(500).send({ message: 'Ошибка на сервере' });
  });
};

module.exports.updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
    new: true,
    runValidators: true,
  })
  .then((user) => {
    if (!user) {
      return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
    }
    return res.send({ data: user });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы неккоректные данные при обновлении аватара' });
    }
    return res.status(500).send({ message: 'Ошибка на сервере' });
  });
};