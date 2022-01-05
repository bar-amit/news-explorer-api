const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

function validateURL(value, helpers) {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
}

function validateMongoId(value, helpers) {
  if (validator.isMongoId(value)) {
    return value;
  }
  return helpers.error("string.id");
}

const idValidator = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().custom(validateMongoId),
  }),
});

const articleDataValidator = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom(validateURL),
    image: Joi.string().required(),
    owner: Joi.string().required().custom(validateMongoId),
  }),
});

module.exports = {
  idValidator,
  articleDataValidator,
};
