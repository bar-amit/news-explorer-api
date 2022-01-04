const jwt = require('jsonwebtoken');
const { UnauthorizedErorr, ForbiddenError } = require('../utils/errors');

const { JWT_SECRET = 'not-a-secret' } = process.env;

module.exports = function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) next(new UnauthorizedErorr('authorization required'));
  else {
    const token = authorization.replace('Bearer ', '');

    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      next(new ForbiddenError('Bad token.'));
    }

    req.user = payload;

    next();
  }
};
