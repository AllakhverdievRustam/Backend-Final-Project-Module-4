const Receptions = require('../../db/models/receptions/Index');
const jwt = require('jsonwebtoken')

SECRET_KEY = 'Rustam4ik228322';
const tokenVerify = (token) => {
  const decoded = jwt.verify(token, SECRET_KEY);
  return decoded;
}

module.exports.getAllReceptions = (req, res) => {
  const { headers, query } = req;

  if (query.hasOwnProperty('limit')
    && query.hasOwnProperty('offset')
    && headers.hasOwnProperty('authorization')
    && query.limit
    && query.offset
    && headers.authorization) {
    const tokenParse = tokenVerify(headers.authorization);

    const limit = +(query.limit);
    const offset = +(query.offset);

    const startInd = offset * limit;

    Receptions.find({ idUser: tokenParse._id }).then(resultLength => {
      const lengthResult = resultLength.length;
      Receptions.find({ idUser: tokenParse._id }, ['nameUser', 'nameDoctor', 'date', 'complaint']).skip(startInd).limit(limit).then(result => {
        res.send({ data: result, length: lengthResult });
      });
    });
  } else {
    res.status(422).send('Invalid data entered!');
  }

};

module.exports.createNewReception = (req, res) => {
  const { body, headers, query } = req;

  const flag = body.hasOwnProperty('nameUser')
    && body.hasOwnProperty('nameDoctor')
    && body.hasOwnProperty('date')
    && body.hasOwnProperty('complaint')
    && query.hasOwnProperty('limit')
    && query.hasOwnProperty('offset')
    && headers.hasOwnProperty('authorization')
    && body.nameUser
    && body.nameDoctor
    && body.date
    && body.complaint
    && query.limit
    && query.offset
    && headers.authorization;

  if (flag) {
    const tokenParse = tokenVerify(headers.authorization);

    body["idUser"] = tokenParse._id;
    const reception = new Receptions(body);

    const limit = +(query.limit);
    const offset = +(query.offset);

    const startInd = offset * limit;

    reception.save(body).then(() => {
      Receptions.find({ idUser: tokenParse._id }).then(resultLength => {
        const lengthResult = resultLength.length;
        Receptions.find({ idUser: tokenParse._id }, ['nameUser', 'nameDoctor', 'date', 'complaint']).skip(startInd).limit(limit).then(result => {
          res.send({ data: result, length: lengthResult });
        });
      });
    });
  } else {
    res.status(422).send('Invalid data entered!');
  }
};

module.exports.editReception = (req, res) => {
  const { body, headers, query } = req;

  if (body.hasOwnProperty('_id')
    && query.hasOwnProperty('limit')
    && query.hasOwnProperty('offset')
    && headers.hasOwnProperty('authorization')
    && body._id
    && query.limit
    && query.offset
    && headers.authorization) {
    const tokenParse = tokenVerify(headers.authorization);

    const limit = +(query.limit);
    const offset = +(query.offset);

    const startInd = offset * limit;

    Receptions.updateOne({ _id: body._id }, body).then(() => {
      Receptions.find({ idUser: tokenParse._id }).then(resultLength => {
        const lengthResult = resultLength.length;
        Receptions.find({ idUser: tokenParse._id }, ['nameUser', 'nameDoctor', 'date', 'complaint']).skip(startInd).limit(limit).then(result => {
          res.send({ data: result, length: lengthResult });
        });
      });
    });
  } else {
    res.status(422).send('Invalid data entered!');
  }
};

module.exports.deleteReception = async (req, res) => {
  const { headers, query } = req;

  if (query.hasOwnProperty('_id')
    && query.hasOwnProperty('limit')
    && query.hasOwnProperty('offset')
    && headers.hasOwnProperty('authorization')
    && query._id
    && query.limit
    && query.offset
    && headers.authorization) {
    const tokenParse = tokenVerify(headers.authorization);

    const limit = +(query.limit);
    const offset = +(query.offset);

    const startInd = offset * limit;

    Receptions.deleteOne({ _id: query._id }).then(() => {
      Receptions.find({ idUser: tokenParse._id }).then(resultLength => {
        const lengthResult = resultLength.length;
        Receptions.find({ idUser: tokenParse._id }, ['nameUser', 'nameDoctor', 'date', 'complaint']).skip(startInd).limit(limit).then(result => {
          res.send({ data: result, length: lengthResult });
        });
      });
    });
  } else {
    res.status(422).send('Invalid data entered!');
  }
};