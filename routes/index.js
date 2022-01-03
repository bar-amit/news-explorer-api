const express = require('express');
const { getUserInfo } = require('../controllers/user');
const { deleteArticle, saveArticle, getArticles } = require('../controllers/article');

const userRouter = express.Router();
userRouter.get('/users/me', getUserInfo);

const articleRouter = express.Router();
articleRouter.delete('/articles/:id', deleteArticle);
articleRouter.post('/articles', saveArticle);
articleRouter.get('/articles', getArticles);

module.exports = { userRouter, articleRouter };
