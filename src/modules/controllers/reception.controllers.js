const Receptions = require('../../db/models/receptions/Index');
const jwt = require('jsonwebtoken')

SECRET_KEY = 'Rustam4ik228322';
const tokenVerify = (token) => {
  const decoded = jwt.verify(token, SECRET_KEY);
  return decoded;
}

module.exports.getAllReceptions = (req, res) => {
  const tokenParse = tokenVerify(req.headers.authorization);

  Receptions.find({ idUser: tokenParse._id }, ['nameUser', 'nameDoctor', 'date', 'complaint']).then(result => {
    res.send({ data: result });
  });
};

module.exports.createNewReception = (req, res) => {
  const { body, headers } = req;

  const tokenParse = tokenVerify(headers.authorization);

  const flag = body.hasOwnProperty('nameUser')
    && body.hasOwnProperty('nameDoctor')
    && body.hasOwnProperty('date')
    && body.hasOwnProperty('complaint')
    && body.nameUser !== ''
    && body.nameDoctor !== ''
    && body.date !== ''
    && body.complaint !== '';

  if (flag) {
    body["idUser"] = tokenParse._id;
    const reception = new Receptions(body);

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
  const { body, headers } = req;

  if (body.hasOwnProperty('_id')
    && headers.hasOwnProperty('authorization')
    && body._id !== ''
    && headers.authorization !== '') {
    const tokenParse = tokenVerify(headers.authorization);

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
  const { headers } = req;

  if (headers.hasOwnProperty('_id')
    && headers.hasOwnProperty('authorization')
    && headers._id
    && headers.authorization) {
    const tokenParse = tokenVerify(headers.authorization);

    Receptions.deleteOne({ _id: headers._id }).then(() => {
      Receptions.find({ idUser: tokenParse._id }, ['nameUser', 'nameDoctor', 'date', 'complaint']).then(result => {
        res.send({ data: result });
      });
    });
  } else {
    res.status(422).send('Invalid data entered!');
  }
};