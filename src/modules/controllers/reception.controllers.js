const Receptions = require('../../db/models/receptions/Index');

module.exports.getAllReceptions = (req, res) => {
  Receptions.find().then(result => {
    res.send({ data: result });
  });
};

module.exports.createNewReception = (req, res) => {
  const reception = new Receptions(req.body);
  const body = req.body;

  if (body.hasOwnProperty('nameUser') 
  && body.hasOwnProperty('nameDoctor') 
  && body.hasOwnProperty('date')
  && body.hasOwnProperty('complaint')
  && body.nameUser
  && body.nameDoctor
  && body.date
  && body.complaint) {
    reception.save(body).then(() => {
      Receptions.find().then(result => {
        res.send({ data: result });
      });
    });
  } else {
    res.status(422).send('Invalid data entered!');
  }
};

module.exports.editReception = (req, res) => {
  const body = req.body;

  if (body.hasOwnProperty('_id') && body._id) {
    Receptions.updateOne({ _id: req.body._id }, req.body).then(() => {
      Receptions.find().then(result => {
        res.send({ data: result });
      });
    });
  } else {
    res.status(422).send('Invalid data entered!');
  }
};