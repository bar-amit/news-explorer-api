const user = require('../models/user');

module.exports = {
  getUserInfo(req, res, next) {
    const { _id: id } = req.user;
    return user.findById(id).then((userInfo) => {
      if (!userInfo) throw new Error('user was not found');
      res.send(userInfo);
    }).catch((err) => res.status(err.statusCode || 404).send({ message: err.message }));
  },
};
