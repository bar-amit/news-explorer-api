const article = require('../models/article');
const {
  ForbiddenError,
  BadRequestError,
  NotFoundError,
  ServerError,
} = require('../utils/errors');

module.exports = {
  getArticles(req, res, next) {
    const { _id: userId } = req.user;
    return article.find({ owner: userId })
      .then((data) => res.send(data))
      .catch((err) => next(new ServerError(err)));
  },
  saveArticle(req, res, next) {
    const { _id: userId } = req.user;
    const {
      keyword, title, text, date, source, link, image,
    } = req.body;
    return article
      .create({
        keyword,
        title,
        text,
        date,
        source,
        link,
        image,
        owner: userId,
      })
      .then((newArticle) => res.send(newArticle))
      .catch((err) => {
        if (err.statusCode === 400) next(new BadRequestError('Bad request.'));
        next(new ServerError(err));
      });
  },
  deleteArticle(req, res, next) {
    const { _id: userId } = req.user;
    const { id: articleId } = req.params;
    return article
      .findById(articleId).select('+owner')
      .then((articleToDelete) => {
        if (!articleToDelete) next(new NotFoundError('Article was not found.'));
        else if (`${articleToDelete.owner}` !== userId) next(new ForbiddenError('User do not own this article.'));
        return article.findByIdAndDelete(articleId)
          .then((deletedArticle) => res.send({ ...deletedArticle }));
      })
      .catch((err) => next(new ServerError(err)));
  },
};
