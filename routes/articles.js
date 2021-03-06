const express = require('express');
const {
  deleteArticle,
  saveArticle,
  getArticles,
} = require('../controllers/article');
const { idValidator, articleDataValidator } = require('../validators/article');

const articleRouter = express.Router();
articleRouter.delete('/articles/:id', idValidator, deleteArticle);
articleRouter.post('/articles', articleDataValidator, saveArticle);
articleRouter.get('/articles', getArticles);

module.exports = articleRouter;
