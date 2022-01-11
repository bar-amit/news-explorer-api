const supertest = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { login } = require("../../controllers/user");
const user = require("../../models/user");
const article = require("../../models/article");
const articleRouter = require("../articles");
const userRouter = require("../users");
const auth = require("../../middlewares/auth");

const app = express();

app.use(bodyParser.json());

app.use("/signin", login);

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
  let userId;
  let articleId;

  beforeAll(async () => {
    try {
      await mongoose.connect(
        "mongodb://localhost:27017/news-exporer-test-db-articles"
      );
      const newUser = await user.create({
        name: fakeUsername,
        email: fakeEmail,
        password: fakePassword,
      });
      userId = newUser._id;
      token = await request
        .post("/signin")
        .send({
          email: fakeEmail,
          password: fakePassword,
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .then((res) => {
          return res.body.token;
        });
      const newArticle = await article.create({
        ...fakeArticle,
        owner: userId,
      });
      articleId = newArticle._id;
    } catch (e) {
      throw e;
    }
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
      .expect(200, (err, res) => {
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

  it("Get articles", (done) => {
    request
      .get("/articles")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .expect(200, (err, res) => {
        if (err) throw err;
        expect(res.body.length).toBeGreaterThan(0);
        done();
      });
  });

  it("Delete article", (done) => {
    request
      .delete(`/articles/${articleId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200, () => done());
  });

  // it("Can't delete article of another user", async () => {
  //   const otherUser = {
  //     email: "other@mail.com",
  //     password: "123456",
  //     name: "the other one",
  //   };
  //   const { _id: otherUserId } = await user.create(otherUser);
  //   const { _id: deleteArticleId } = await article.create({
  //     ...fakeArticle,
  //     owner: otherUserId,
  //   });
  //   await request
  //     .delete(`/articles/${deleteArticleId}`)
  //     .set("Authorization", `Bearer ${token}`)
  //     .expect(403);
  // });
});
