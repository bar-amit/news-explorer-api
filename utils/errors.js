const BadRequestError = require('./error/BadRequestError');
const UnauthorizedErorr = require('./error/UnauthorizedError');
const ForbiddenError = require('./error/ForbiddenError');
const NotFoundError = require('./error/NotFoundError');
const ServerError = require('./error/ServerError');
const DuplicateError = require('./error/DuplicateError');

module.exports = {
  UnauthorizedErorr,
  ForbiddenError,
  BadRequestError,
  NotFoundError,
  ServerError,
  DuplicateError,
};
