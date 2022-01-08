const express = require('express');
const userRouter = require('./users');
const articleRouter = require('./articles');

const router = express.Router();

router.use(userRouter);
router.use(articleRouter);

module.exports = router;
