class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.name = 'Conflicting Request';
  }
}

module.exports = ConflictError;
