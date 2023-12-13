//Регулярное выражение для URL-адресов

const url_regex = /^https?:\/\/(www\.)?[\w\-_~:\/#\[\]@!&',;=]+\.[\w\-_~:\/#\[\]@!&',;=а-я]+#?/i;

module.exports = {
  url_regex
};