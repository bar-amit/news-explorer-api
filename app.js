const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { userRouter, articleRouter } = require('./routes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

/* Fake auth */
app.use((req, res, next) => {
  req.user = { _id: "61d2ffb39c95c607ee66af76" };
  next();
});
/**    end     * */

app.use(userRouter);
app.use(articleRouter);

mongoose.connect('mongodb://localhost:27017/news-explorer-db');
app.listen(3000, () => console.log('Listening on port 3000'));
