const article = require('../models/article');

module.exports = {
  getArticles(req, res, next) {
    const { _id: userId } = req.user;
    return article.find({ owner: userId })
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send({ message: err.message }));
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
      .catch((err) => res.status(500).send({ message: err.message }));
  },
  deleteArticle(req, res, next) {
    const { _id: userId } = req.user;
    const { id: articleId } = req.params;
    return article
      .findById(articleId).select('+owner')
      .then((articleToDelete) => {
        if (!articleToDelete) throw new Error('Article was not found');
        else if (`${articleToDelete.owner}` !== userId) throw Error('Permission denied');
        else return article.findByIdAndDelete(articleId).then(deletedArticle => res.send({deletedArticle}));
      })
      .catch((err) => res.status(500).send({ message: err.message }));
  },
};
