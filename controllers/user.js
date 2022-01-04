const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

const { JWT_SECRET = 'not-a-secret' } = process.env;

module.exports = {
  getUserInfo(req, res, next) {
    const { _id: id } = req.user;
    return user.findById(id).then((userInfo) => {
      if (!userInfo) throw new Error('user was not found');
      res.send(userInfo);
    }).catch((err) => res.status(err.statusCode || 404).send({ message: err.message }));
  },
  login(req, res, next) {
    const { email, password } = req.body;

    user
      .findOne({ email })
      .select('+password')
      .then((foundUser) => {
        if (!foundUser) throw new Error('Incorrect password or email');
        return bcrypt
          .compare(password, foundUser.password)
          .then((matched) => {
            if (!matched) throw new Error('bad cred');
            const token = jwt.sign({ _id: foundUser._id }, JWT_SECRET);
            res.send({ token });
          })
          .catch((err) => {
            res.status(401).send({ message: err.message });
          });
      })
      .catch((err) => res.status(err.statusCode || 404).send({ message: err.message }));
  },
  signup(req, res, next) {
    const { email, password, name } = req.body;

    bcrypt
      .hash(password, 10)
      .then((hash) => user.create({ email, name, password: hash }))
      .then(({ name: n, email: e }) => res.status(201).send({ name: n, email: e }))
      .catch((err) => res.status(err.statusCode || 404).send({ message: err.message }));
  },
};
