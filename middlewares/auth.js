const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'not-a-secret' } = process.env;

module.exports = function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) res.status(401).send({ message: 'authorization required' });

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    res.status(401).send({ message: 'bad token' });
  }

  req.user = payload;

  next();
};
