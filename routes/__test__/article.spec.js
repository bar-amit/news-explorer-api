const supertest = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const validator = require("validator");
const { login, signup } = require("../../controllers/user");
const { userRouter, articleRouter } = require("../index");
const auth = require("../../middlewares/auth");

const app = express();

app.use(bodyParser.json());

app.post("/signin", login);
app.post("/signup", signup);

app.use(auth);

app.use(userRouter);
app.use(articleRouter);

const request = supertest(app);

describe("Article routes", () => {
  const fakePassword = "123456";
  const fakeEmail = "article.test@email.com";
  const fakeUsername = "Mr. Test";
  const fakeArticle = {
    keyword: "search term",
    title: "test article",
    text: "This is some test I wrote while testing my app. Why? Who knows.",
    date: "8/1/2022",
    source: "test news",
    link: "http://test.news.com/article",
    image: "http://unsplash.com/image",
  };

  let token;

  beforeAll((done) => {
    mongoose.connect("mongodb://localhost:27017/news-exporer-test-db", () => {
      request
        .post("/signup")
        .send({
          name: fakeUsername,
          email: fakeEmail,
          password: fakePassword,
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
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
            .then(function (res) {
              token = res.body.token;
              done();
            })
            .catch((err) => {
              throw err;
            });
        });
    });
  });

  afterAll((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });


  it("Saves an article", (done) => {
    request
      .post("/articles")
      .send({ ...fakeArticle })
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        expect(res.body.keyword).toBe(fakeArticle.keyword);
        expect(res.body.title).toBe(fakeArticle.title);
        expect(res.body.text).toBe(fakeArticle.text);
        expect(res.body.date).toBe(fakeArticle.date);
        expect(res.body.source).toBe(fakeArticle.source);
        expect(res.body.link).toBe(fakeArticle.link);
        expect(res.body.image).toBe(fakeArticle.image);
        done();
      });
  });

  it("Get articles", async () => {
    try {
      const { _id: id } = await request
        .post("/articles")
        .send({ ...fakeArticle })
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .expect(200)
        .then((res) => {
          return res.body;
        })
        .catch((err) => {
          throw err;
        });
    await request
      .get("/articles")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body.find((i) => i._id === id)).toBeTruthy();
      })
      .catch((err) => {
        throw err;
      });
    }
    catch (err) {
      throw err;
    }
  });

  it("Delete article", async () => {
    try {
      const { _id: id } = await request
        .post("/articles")
        .send({ ...fakeArticle })
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .expect(200)
        .then((res) => {
          return res.body;
        })
        .catch((err) => {
          throw err;
        });
    request
      .delete(`/articles/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        expect(res.body._id, id);
      })
      .catch((err) => {
        throw err;
      });
    }
    catch (err) {
      throw err
    }
  });

});
