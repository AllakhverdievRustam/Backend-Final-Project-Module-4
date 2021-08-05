const mongoose = require('mongoose');

const { Schema } = mongoose;

const usersSchema = new Schema ({
  login: String,
  password: String
});

module.exports = Users = mongoose.model('users', usersSchema);

const receptionsSchema = new Schema ({
  nameUser: String,
  nameВoctor: String,
  date: String,
  complaint: String
});

module.exports = Receptions = mongoose.model('receptions', receptionsSchema);