const Receptions = require('../../db/models/receptions/Index');
const jwt = require('jsonwebtoken')

SECRET_KEY = 'Rustam4ik228322';
const tokenVerify = (token) => {
  const decoded = jwt.verify(token, SECRET_KEY);
  return decoded;
}

module.exports.getAllReceptions = (req, res) => {
  const tokenParse = tokenVerify(req.headers.token);

  Receptions.find({ idUser: tokenParse._id }, ['nameUser', 'nameDoctor', 'date', 'complaint']).then(result => {
    res.send({ data: result });
  });
};

module.exports.createNewReception = (req, res) => {
  const tokenParse = tokenVerify(req.headers.token);

  req.body["idUser"] = tokenParse._id;

  const body = req.body;

  const reception = new Receptions(body);

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
      Receptions.find({ idUser: tokenParse._id }, ['nameUser', 'nameDoctor', 'date', 'complaint']).then(result => {
        res.send({ data: result });
      });
    });
  } else {
    res.status(422).send('Invalid data entered!');
  }
};

module.exports.editReception = (req, res) => {
  const body = req.body;
  const headers = req.headers;

  if (body.hasOwnProperty('_id')
    && headers.hasOwnProperty('token')
    && body._id
    && headers.token) {
    const tokenParse = tokenVerify(headers.token);

    Receptions.updateOne({ _id: body._id }, body).then(() => {
      Receptions.find({ idUser: tokenParse._id }, ['nameUser', 'nameDoctor', 'date', 'complaint']).then(result => {
        res.send({ data: result });
      });
    });
  } else {
    res.status(422).send('Invalid data entered!');
  }
};

module.exports.deleteReception = async (req, res) => {
  const header = req.headers;

  if (header.hasOwnProperty('_id')
    && header.hasOwnProperty('token')
    && header._id
    && header.token) {
    const tokenParse = tokenVerify(header.token);

    Receptions.deleteOne({ _id: header._id }).then(() => {
      Receptions.find({ idUser: tokenParse._id }, ['nameUser', 'nameDoctor', 'date', 'complaint']).then(result => {
        res.send({ data: result });
      });
    });
  } else {
    res.status(422).send('Invalid data entered!');
  }
};