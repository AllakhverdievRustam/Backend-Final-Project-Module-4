const Receptions = require('../../db/models/receptions/Index');

module.exports.getAllReceptions = (req, res) => {
  Receptions.find({ idUser: req.query.idUser }).then(result => {
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
  && body.hasOwnProperty('idUser')
  && body.nameUser
  && body.nameDoctor
  && body.date
  && body.complaint
  && body.idUser) {
    reception.save(body).then(() => {
      Receptions.find({ idUser: body.idUser }).then(result => {
        res.send({ data: result });
      });
    });
  } else {
    res.status(422).send('Invalid data entered!');
  }
};

module.exports.editReception = (req, res) => {
  const body = req.body;

  if (body.hasOwnProperty('_id')
  && body.hasOwnProperty('idUser')
  && body._id
  && body.idUser) {
    Receptions.updateOne({ _id: req.body._id }, req.body).then(() => {
      Receptions.find({ idUser: req.body.idUser }).then(result => {
        res.send({ data: result });
      });
    });
  } else {
    res.status(422).send('Invalid data entered!');
  }
};

module.exports.deleteReception = async (req, res) => {
  const query = req.query;
  if (query.hasOwnProperty('_id')
  && query.hasOwnProperty('idUser')
  && query._id
  && query.idUser) {
    Receptions.deleteOne({ _id: query._id }).then(() => {
      Receptions.find({ idUser: query.idUser }).then(result => {
        res.send({data: result});
      });
    });
  } else {
    res.status(422).send('Invalid data entered!');
  }
};