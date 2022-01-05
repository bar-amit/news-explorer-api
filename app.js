require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate')
const { userRouter, articleRouter } = require('./routes');
const { login, signup } = require('./controllers/user');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { userLoginValidator, userDataValidator } = require('./validators/user');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/signin', userLoginValidator, login);
app.post('/signup', userDataValidator, signup);

app.use(auth);

app.use(userRouter);
app.use(articleRouter);

app.use(errors());
app.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/news-explorer-db');
app.listen(3000, () => console.log('Listening on port 3000'));
