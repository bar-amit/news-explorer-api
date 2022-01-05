const express = require('express');
const { getUserInfo } = require('../controllers/user');
const { deleteArticle, saveArticle, getArticles } = require('../controllers/article');
const { idValidator, articleDataValidator } = require('../validators/article');

const userRouter = express.Router();
userRouter.get('/users/me', getUserInfo);

const articleRouter = express.Router();
articleRouter.delete('/articles/:id', idValidator, deleteArticle);
articleRouter.post('/articles', articleDataValidator, saveArticle);
articleRouter.get('/articles', getArticles);

module.exports = { userRouter, articleRouter };
