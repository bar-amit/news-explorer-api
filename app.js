require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const { userRouter, articleRouter } = require('./routes');
const { login, signup } = require('./controllers/user');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { userLoginValidator, userDataValidator } = require('./validators/user');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to API calls only
app.use('/api', apiLimiter);

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(requestLogger);

app.post('/signin', userLoginValidator, login);
app.post('/signup', userDataValidator, signup);

app.use(auth);

app.use(userRouter);
app.use(articleRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/news-explorer-db');
app.listen(3000);
