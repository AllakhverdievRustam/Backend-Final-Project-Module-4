const Receptions = require('../../db/models/receptions/Index');

module.exports.getAllReceptions = (req, res) => {
  Receptions.find().then(result => {
    res.send({ data: result });
  });
};