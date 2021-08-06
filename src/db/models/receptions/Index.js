const mongoose = require('mongoose');

const { Schema } = mongoose;

const receptionsSchema = new Schema ({
  nameUser: String,
  nameDoctor: String,
  date: String,
  complaint: String
});

module.exports = Receptions = mongoose.model('receptions', receptionsSchema);