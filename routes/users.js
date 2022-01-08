const express = require("express");
const { getUserInfo } = require("../controllers/user");

const userRouter = express.Router();
userRouter.get("/users/me", getUserInfo);

module.exports = userRouter;
