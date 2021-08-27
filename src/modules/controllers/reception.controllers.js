const Receptions = require('../../db/models/receptions/Index');
const jwt = require('jsonwebtoken');

SECRET_KEY = 'Rustam4ik228322';
const tokenVerify = (token) => {
  const decoded = jwt.verify(token, SECRET_KEY);
  return decoded;
}

module.exports.getAllReceptions = (req, res) => {

  // #swagger.tags = ['receptions']

  /* #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      type: 'object',
      schema: { $ref: "#/definitions/paramsGetAllReceptions" }
  } */

  /* #swagger.parameters['authorization'] = {
      in: 'header',
      required: true,
      type: 'string'
  } */

  /* #swagger.responses[422] = { 
       schema: { $ref: "#/definitions/paramsGetAllReceptions" },
       description: 'Invalid data entered!' 
      }
   */

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

  // #swagger.tags = ['receptions']

  /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        type: 'object',
        schema: { $ref: "#/definitions/paramsCreateNewReceptions" }
    } */

  /* #swagger.parameters['authorization'] = {
      in: 'header',
      required: true,
      type: 'string'
  } */

  /* #swagger.responses[422] = { 
       schema: { $ref: "#/definitions/paramsCreateNewReceptions" },
       description: 'Invalid data entered!' 
      }
   */

  const { body, headers } = req;
  const { limit, offset, sortLable, sortDirection, firstDate, lastDate } = body;

  const flag = body.hasOwnProperty('nameUser')
    && body.hasOwnProperty('nameDoctor')
    && body.hasOwnProperty('date')
    && body.hasOwnProperty('complaint')
    && body.hasOwnProperty('limit')
    && body.hasOwnProperty('offset')
    && headers.hasOwnProperty('authorization')
    && body.hasOwnProperty('sortLable')
    && body.hasOwnProperty('sortDirection')
    && body.hasOwnProperty('firstDate')
    && body.hasOwnProperty('lastDate')
    && limit !== ''
    && offset !== ''
    && body.nameUser
    && body.nameDoctor
    && body.date
    && body.complaint
    && headers.authorization;

  if (flag) {
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
    }

    const limitNun = +(limit);
    const startInd = +(offset) * limitNun;

    body["idUser"] = tokenParse._id;
    const reception = new Receptions(body);

    reception.save(body).then(() => {
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
    });
  } else {
    res.status(422).send('Invalid data entered!');
  }
};

module.exports.editReception = (req, res) => {

  // #swagger.tags = ['receptions']

  /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        type: 'object',
        schema: { $ref: "#/definitions/paramsEditReceptions" }
    } */

  /* #swagger.parameters['authorization'] = {
      in: 'header',
      required: true,
      type: 'string'
  } */

  /* #swagger.responses[422] = { 
       schema: { $ref: "#/definitions/paramsEditReceptions" },
       description: 'Invalid data entered!' 
      }
   */

  const { body, headers } = req;
  const { limit, offset, sortLable, sortDirection, firstDate, lastDate } = body;

  if (body.hasOwnProperty('_id')
    && body.hasOwnProperty('limit')
    && body.hasOwnProperty('offset')
    && headers.hasOwnProperty('authorization')
    && body.hasOwnProperty('sortLable')
    && body.hasOwnProperty('sortDirection')
    && body.hasOwnProperty('firstDate')
    && body.hasOwnProperty('lastDate')
    && limit !== ''
    && offset !== ''
    && body._id
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
    }

    const limitNun = +(limit);
    const startInd = +(offset) * limitNun;

    Receptions.updateOne({ _id: body._id }, body).then(() => {
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
    });
  } else {
    res.status(422).send('Invalid data entered!');
  }
};

module.exports.deleteReception = async (req, res) => {

  // #swagger.tags = ['receptions']

  /* #swagger.parameters['limit'] = {
    in: 'query',
    required: true,
    type: 'string',
    value: '5'
  } */
  /* #swagger.parameters['offset'] = {
    in: 'query',
    required: true,
    type: 'string',
    value: '0'
  } */
  /* #swagger.parameters['sortLable'] = {
    in: 'query',
    required: true,
    type: 'string',
    value: 'nameDoctor'
  } */
  /* #swagger.parameters['sortDirection'] = {
    in: 'query',
    required: true,
    type: 'string',
    value: 'asc/desc'
  } */
  /* #swagger.parameters['firstDate'] = {
    in: 'query',
    required: true,
    type: 'string',
    value: '2021-08-01'
  } */
  /* #swagger.parameters['lastDate'] = {
    in: 'query',
    required: true,
    type: 'string',
    value: '2021-08-31'
  } */
  /* #swagger.parameters['_id'] = {
    in: 'query',
    required: true,
    type: 'string'
  } */

  /* #swagger.parameters['authorization'] = {
      in: 'header',
      required: true,
      type: 'string'
  } */

  /* #swagger.responses[422] = {
       description: 'Invalid data entered!' 
      }
   */

  const { headers, query } = req;
  const { limit, offset, sortLable, sortDirection, firstDate, lastDate, _id } = query;

  if (query.hasOwnProperty('_id')
    && query.hasOwnProperty('limit')
    && query.hasOwnProperty('offset')
    && headers.hasOwnProperty('authorization')
    && query.hasOwnProperty('sortLable')
    && query.hasOwnProperty('sortDirection')
    && query.hasOwnProperty('firstDate')
    && query.hasOwnProperty('lastDate')
    && limit !== ''
    && offset !== ''
    && _id
    && headers.authorization
  ) {

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
    }

    const limitNun = +(limit);
    const startInd = +(offset) * limitNun;

    Receptions.deleteOne({ _id }).then(() => {
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
    });
  } else {
    res.status(422).send('Invalid data entered!');
  }
};