const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

const userLoginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(7).max(50).email(),
    password: Joi.string().required().min(6).max(16),
  }),
});

const userDataValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().min(7).max(50).email(),
    password: Joi.string().required().min(6).max(16),
  }),
});

module.exports = {
  userLoginValidator,
  userDataValidator,
};
