const Receptions = require('../../db/models/receptions/Index');
const jwt = require('jsonwebtoken')

SECRET_KEY = 'Rustam4ik228322';
const tokenVerify = (token) => {
  const decoded = jwt.verify(token, SECRET_KEY);
  return decoded;
}

module.exports.getAllReceptions = (req, res) => {
  const { headers, body } = req;
  const { limit, offset, sortLable, sortDirection, firstDate, lastDate } = body;

  if (body.hasOwnProperty('limit')
    && body.hasOwnProperty('offset')
    && headers.hasOwnProperty('authorization')
    && body.hasOwnProperty('sortLable')
    && body.hasOwnProperty('sortDirection')
    && body.hasOwnProperty('firstDate')
    && body.hasOwnProperty('lastDate')
    && limit !== ''
    && offset !== ''
    && headers.authorization) {
    const tokenParse = tokenVerify(headers.authorization);

    const sortArr = [];
    (sortLable && sortDirection)
      ? sortArr.push({ [sortLable]: sortDirection === "asc" ? 1 : -1 })
      : sortArr.push({ ["_id"]: 1 })

    const filterArr = [{ idUser: tokenParse._id }];
    if (firstDate && lastDate) {
      filterArr.push({ date: { $gte: firstDate, $lte: lastDate } });
    } else if (firstDate && !lastDate) {
      filterArr.push({ date: { $gte: firstDate } });
    } else if (!firstDate && lastDate) {
      filterArr.push({ date: { $lte: lastDate } });
    } else {
      filterArr.push({});
    }

    const limitNun = +(limit);
    const startInd = +(offset) * limitNun;

    Receptions.find(
      { $and: filterArr },
      ['nameUser', 'nameDoctor', 'date', 'complaint'])
      .sort(sortArr[0])
      .skip(startInd).limit(limitNun)
      .then(result => {
        Receptions.count(
          { $and: filterArr })
          .then(resultCount => {
            res.send({ data: result, length: resultCount });
          });
      });
  } else {
    res.status(422).send('Invalid data entered!');
  }
};

module.exports.createNewReception = (req, res) => {
  const { body, headers } = req;

  const flag = body.hasOwnProperty('nameUser')
    && body.hasOwnProperty('nameDoctor')
    && body.hasOwnProperty('date')
    && body.hasOwnProperty('complaint')
    && headers.hasOwnProperty('authorization')
    && body.nameUser
    && body.nameDoctor
    && body.date
    && body.complaint
    && headers.authorization;

  if (flag) {
    const tokenParse = tokenVerify(headers.authorization);

    body["idUser"] = tokenParse._id;
    const reception = new Receptions(body);

    reception.save(body).then(() => {
      Receptions.find(
        { idUser: tokenParse._id },
        ['nameUser', 'nameDoctor', 'date', 'complaint'])
        .then(result => {
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
    && body._id
    && headers.authorization) {
    const tokenParse = tokenVerify(headers.authorization);

    Receptions.updateOne({ _id: body._id }, body).then(() => {
      Receptions.find(
        { idUser: tokenParse._id },
        ['nameUser', 'nameDoctor', 'date', 'complaint'])
        .then(result => {
          res.send({ data: result });
        });
    });
  } else {
    res.status(422).send('Invalid data entered!');
  }
};

module.exports.deleteReception = async (req, res) => {
  const { headers, query } = req;

  if (query.hasOwnProperty('_id')
    && headers.hasOwnProperty('authorization')
    && query._id
    && headers.authorization) {
    const tokenParse = tokenVerify(headers.authorization);

    Receptions.deleteOne({ _id: query._id }).then(() => {
      Receptions.find(
        { idUser: tokenParse._id },
        ['nameUser', 'nameDoctor', 'date', 'complaint'])
        .then(result => {
          res.send({ data: result });
        });
    });
  } else {
    res.status(422).send('Invalid data entered!');
  }
};