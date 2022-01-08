const supertest = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const validator = require('validator');
const { login, signup } = require('../../controllers/user');
const { userRouter, articleRouter } = require('../index');
const auth = require('../../middlewares/auth');

const app = express();

app.use(bodyParser.json());

app.post('/signin', login);
app.post("/signup", signup);

app.use(auth);

app.use(userRouter);
app.use(articleRouter);

const request = supertest(app);

describe('User routes', () => {
    const fakePassword = '123456';
    const fakeEmail = 'user.test@email.com';
    const fakeUsername = 'Mr. Test';

    beforeEach((done) => {
      mongoose.connect("mongodb://localhost:27017/news-exporer-test-db", () =>{
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
          .post("/signup")
          .send({
            name: fakeUsername,
            email: fakeEmail,
            password: fakePassword,
          })
          .set("Content-Type", "application/json")
          .set("Accept", "application/json")
          .expect(201)
          .end(function (err, res) {
            if (err) throw err;
            done();
          });
    });

    it("Returns user data without hash", (done) => {
      request
        .post("/signup")
        .send({
          name: fakeUsername,
          email: fakeEmail,
          password: fakePassword,
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(201, {
          name: fakeUsername,
          email: fakeEmail,
        })
        .end(function (err, res) {
          if (err) throw err;
          done();
        });
    });

    it("Login user", (done) => {
      request
        .post("/signup")
        .send({
          name: fakeUsername,
          email: fakeEmail,
          password: fakePassword,
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(201)
        .end(function (err, res) {
          if (err) throw err;
          request
            .post("/signin")
            .send({
              email: fakeEmail,
              password: fakePassword,
            })
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .expect(200, function (err, res) {
                const { token } = res.body;
                expect(validator.isJWT(token)).toBeTruthy();
                done();
            });
        });
    });

    it("Get user data", async () => {
      try {
        const token = await request
        .post("/signup")
        .send({
          name: fakeUsername,
          email: fakeEmail,
          password: fakePassword,
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(201)
        .then(function (err, res) {
          return request
            .post("/signin")
            .send({
              email: fakeEmail,
              password: fakePassword,
            })
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .then(function (res) {
              const { token } = res.body;
              return token;
            })
            .catch((err) => {
              throw err;
            });
        })
        .catch(err => {
          throw err
        });
      await request
        .get("/users/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .then((res) => {
          const { name, _id: id, email } = res.body;
          expect(name).toBe(fakeUsername);
          expect(validator.isMongoId(id)).toBeTruthy();
          expect(email).toBe(fakeEmail);
        })
        .catch((err) => {
          throw err;
        });
      }
      catch (err) {
        throw err;
      }
    });

});