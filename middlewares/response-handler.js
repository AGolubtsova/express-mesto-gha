// Централизованный обработчик ошибок
module.exports = (err, req, res) => {
  console.log(err);
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
};
