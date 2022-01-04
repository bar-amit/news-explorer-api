const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const {
  BadRequestError,
  NotFoundError,
  ServerError,
  DuplicateError,
} = require('../utils/errors');

const { JWT_SECRET = 'not-a-secret' } = process.env;

module.exports = {
  getUserInfo(req, res, next) {
    const { _id: id } = req.user;
    return user.findById(id).then((userInfo) => {
      if (!userInfo) next(new NotFoundError('User was not found'));
      res.send(userInfo);
    }).catch((err) => next(new ServerError(err)));
  },
  login(req, res, next) {
    const { email, password } = req.body;

    user
      .findOne({ email })
      .select('+password')
      .then((foundUser) => {
        if (!foundUser) next(new BadRequestError('Bad email and/or password.'));
        return bcrypt
          .compare(password, foundUser.password)
          .then((matched) => {
            if (!matched) next(new BadRequestError('Bad email and/or password.'));
            const token = jwt.sign({ _id: foundUser._id }, JWT_SECRET);
            res.send({ token });
          });
      }).catch((err) => next(new ServerError(err)));
  },
  signup(req, res, next) {
    const { email, password, name } = req.body;

    bcrypt
      .hash(password, 10)
      .then((hash) => user.create({ email, name, password: hash }))
      .then(({ name: n, email: e }) => res.status(201).send({ name: n, email: e }))
      .catch((err) => {
        if (err.code === 11000) next(new DuplicateError('Email allready exists on the server.'));
        next(new ServerError(err));
      });
  },
};
