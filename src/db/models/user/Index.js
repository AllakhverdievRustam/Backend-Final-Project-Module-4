const mongoose = require('mongoose');

const { Schema } = mongoose;

const usersSchema = new Schema({
  login: String,
  password: String,
  imgName: String
});

module.exports = Users = mongoose.model('users', usersSchema);