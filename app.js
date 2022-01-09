require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const limiter = require('./middlewares/limiter');
const router = require('./routes');
const { login, signup } = require('./controllers/user');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { userLoginValidator, userDataValidator } = require('./validators/user');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { DB = 'mongodb://localhost:27017/news-explorer-db', PORT = 3000 } = process.env;

const app = express();

app.use('/api', limiter);

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(requestLogger);

app.post('/signin', userLoginValidator, login);
app.post('/signup', userDataValidator, signup);

app.use(auth);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect(DB);
app.listen(PORT);
