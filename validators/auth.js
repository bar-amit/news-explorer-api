const { celebrate, Joi } = require("celebrate");

module.exports.authValidator = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string()
        .required()
        .pattern(/^Bearer /),
    })
    .unknown(true),
});
