class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.name = 'Unauthorized';
  }
}

module.exports = Unauthorized;
