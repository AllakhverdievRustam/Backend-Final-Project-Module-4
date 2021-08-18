const Receptions = require('../../db/models/receptions/Index');
const jwt = require('jsonwebtoken')

SECRET_KEY = 'Rustam4ik228322';
const tokenVerify = (token) => {
  const decoded = jwt.verify(token, SECRET_KEY);
  return decoded;
}

const sort = (result, sortLable, sortDirection) => {
  switch (sortDirection) {
    case 'asc':
      result.sort((a, b) =>
        a[sortLable] < b[sortLable]
          ? -1
          : a[sortLable] > b[sortLable]
            ? 1
            : 0
      );
      break;

    case 'desc':
      result.sort((a, b) =>
        a[sortLable] > b[sortLable]
          ? -1
          : a[sortLable] < b[sortLable]
            ? 1
            : 0
      );
      break;

    default:
      break;
  }

  return result;
}

const filter = (result, firstDate, lastDate) => {
  if (firstDate && !lastDate) {
    result = result.filter(element => element.date >= firstDate);
  } else if (!firstDate && lastDate) {
    result = result.filter(element => element.date <= lastDate);
  } else if (firstDate && lastDate) {
    result = result.filter(element =>
      (element.date >= firstDate) &&
      (element.date <= lastDate)
    );
  }

  return result;
}

module.exports.getAllReceptions = (req, res) => {
  const { headers, body } = req;

  if (body.hasOwnProperty('limit')
    && body.hasOwnProperty('offset')
    && headers.hasOwnProperty('authorization')
    && body.hasOwnProperty('sortLable')
    && body.hasOwnProperty('sortDirection')
    && body.hasOwnProperty('firstDate')
    && body.hasOwnProperty('lastDate')
    && body.limit
    && body.offset
    && headers.authorization) {
    if (!body.sortLable
      && !body.sortDirection
      && !body.firstDate
      && !body.lastDate) {
      const tokenParse = tokenVerify(headers.authorization);

      const limit = +(body.limit);
      const offset = +(body.offset);

      const startInd = offset * limit;

      Receptions.find({ idUser: tokenParse._id }).then(resultLength => {
        const lengthResult = resultLength.length;
        Receptions.find({ idUser: tokenParse._id }, ['nameUser', 'nameDoctor', 'date', 'complaint']).skip(startInd).limit(limit).then(result => {
          res.send({ data: result, length: lengthResult });
        });
      });
    } else if (body.sortLable
      && body.sortDirection
      && !body.firstDate
      && !body.lastDate) {
      const tokenParse = tokenVerify(headers.authorization);

      const limit = +(body.limit);
      const offset = +(body.offset);

      const startInd = offset * limit;

      Receptions.find({ idUser: tokenParse._id }).then(resultLength => {
        const lengthResult = resultLength.length;
        Receptions.find({ idUser: tokenParse._id }, ['nameUser', 'nameDoctor', 'date', 'complaint']).skip(startInd).limit(limit).then(result => {
          result = sort(result, body.sortLable, body.sortDirection);

          res.send({ data: result, length: lengthResult });
        });
      });
    } else if (!body.sortLable
      && !body.sortDirection) {
      const tokenParse = tokenVerify(headers.authorization);

      const limit = +(body.limit);
      const offset = +(body.offset);

      const startInd = offset * limit;

      Receptions.find({ idUser: tokenParse._id }).then(resultLength => {
        const lengthResult = resultLength.length;
        Receptions.find({ idUser: tokenParse._id }, ['nameUser', 'nameDoctor', 'date', 'complaint']).skip(startInd).limit(limit).then(result => {
          result = filter(result, body.firstDate, body.lastDate);

          res.send({ data: result, length: lengthResult });
        });
      });
    } else if (body.sortLable
      && body.sortDirection
      && body.firstDate
      && body.lastDate) {
      const tokenParse = tokenVerify(headers.authorization);

      const limit = +(body.limit);
      const offset = +(body.offset);

      const startInd = offset * limit;

      Receptions.find({ idUser: tokenParse._id }).then(resultLength => {
        const lengthResult = resultLength.length;
        Receptions.find({ idUser: tokenParse._id }, ['nameUser', 'nameDoctor', 'date', 'complaint']).skip(startInd).limit(limit).then(result => {
          result = sort(result, body.sortLable, body.sortDirection);
          result = filter(result, body.firstDate, body.lastDate);

          res.send({ data: result, length: lengthResult });
        });
      });
    } else {
      res.status(422).send('Invalid data entered!');
    }
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
    && body.hasOwnProperty('limit')
    && body.hasOwnProperty('offset')
    && headers.hasOwnProperty('authorization')
    && body.nameUser
    && body.nameDoctor
    && body.date
    && body.complaint
    && body.limit
    && body.offset
    && headers.authorization;

  if (flag) {
    const tokenParse = tokenVerify(headers.authorization);

    body["idUser"] = tokenParse._id;
    const reception = new Receptions(body);

    const limit = +(body.limit);
    const offset = +(body.offset);

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
  const { body, headers } = req;

  if (body.hasOwnProperty('_id')
    && body.hasOwnProperty('limit')
    && body.hasOwnProperty('offset')
    && headers.hasOwnProperty('authorization')
    && body._id
    && body.limit
    && body.offset
    && headers.authorization) {
    const tokenParse = tokenVerify(headers.authorization);

    const limit = +(body.limit);
    const offset = +(body.offset);

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