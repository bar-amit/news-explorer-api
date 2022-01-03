const mongoose = require('mongoose');
const validator = require('validator');
const user = require('./user');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    validate: { validator: validator.isURL },
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: user,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('article', articleSchema);
