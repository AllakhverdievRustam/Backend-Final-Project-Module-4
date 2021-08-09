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
    reception.save(body).then((result) => {
      res.send(result);
    });
  } else {
    res.status(422).send('Invalid data entered!');
  }
};