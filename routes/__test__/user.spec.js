const supertest = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const validator = require('validator');
const { login, signup } = require('../../controllers/user');
const user = require('../../models/user');
const userRouter = require("../users");
const auth = require('../../middlewares/auth');

const app = express();

app.use(bodyParser.json());

app.post('/signin', login);
app.post('/signup', signup);

app.use(auth);

app.use(userRouter);

const request = supertest(app);

describe('User routes', () => {
  const fakePassword = '123456';
  const fakeEmail = 'user.test@email.com';
  const fakeUsername = 'Mr. Test';

  beforeEach((done) => {
    mongoose.connect('mongodb://localhost:27017/news-exporer-test-db', () => {
      done();
    });
  });

  afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });

  it('Creates new user', (done) => {
    request
      .post('/signup')
      .send({
        name: fakeUsername,
        email: fakeEmail,
        password: fakePassword,
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(201)
      .end((err, res) => {
        if (err) throw err;
        done();
      });
  });

  it('Returns user data without hash', (done) => {
    request
      .post('/signup')
      .send({
        name: fakeUsername,
        email: fakeEmail,
        password: fakePassword,
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(201, {
        name: fakeUsername,
        email: fakeEmail,
      })
      .end((err, res) => {
        if (err) throw err;
        done();
      });
  });

  it('Login user', (done) => {
    user.create({
        name: fakeUsername,
        email: fakeEmail,
        password: fakePassword,
      }).then(() => {
        request
          .post('/signin')
          .send({
            email: fakeEmail,
            password: fakePassword,
          })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200, (err, res) => {
            const { token } = res.body;
            expect(validator.isJWT(token)).toBeTruthy();
            done();
          });
      });
  });

  it('Get user data', async () => {
    try {
      await user.create({
        name: fakeUsername,
        email: fakeEmail,
        password: fakePassword,
      });
      const token = await request
        .post("/signin")
        .send({
          email: fakeEmail,
          password: fakePassword,
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .then((res) => {
          const { token } = res.body;
          return token;
        });
      await request
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((res) => {
          const { name, _id: id, email } = res.body;
          expect(name).toBe(fakeUsername);
          expect(validator.isMongoId(id)).toBeTruthy();
          expect(email).toBe(fakeEmail);
        });
    } catch (err) {
      throw err;
    }
  });
});
