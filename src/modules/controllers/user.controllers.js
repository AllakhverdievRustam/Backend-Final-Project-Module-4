const Users = require('../../db/models/user/Index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const path = require('path');

SECRET_KEY = 'Rustam4ik228322';
const generateJwt = (login, _id) => {
  return jwt.sign(
    { login, _id },
    SECRET_KEY,
    { expiresIn: '24h' }
  )
}

const tokenVerify = async (token) => await jwt.verify(token, SECRET_KEY);

// Registration
module.exports.registrationUser = async (req, res) => {
  const body = req.body;
  const { login, password, imgName } = body;

  if (body.hasOwnProperty('login')
    && body.hasOwnProperty('password')
    && body.hasOwnProperty('imgName')
    && login
    && password) {
    const candidate = await Users.findOne({ login: body.login });
    if (candidate) return res.status(421).send('This user already exists!');

    const hashPassword = await bcrypt.hash(password, 5);

    const newUser = await Users.create({
      login,
      password: hashPassword,
      imgName
    });

    newUser.save();

    const token = generateJwt(newUser.login, newUser._id);

    res.send({ authorization: token, image: newUser.imgName });
  } else {
    res.status(422).send('Invalid data entered!');
  }
};

// Authorization
module.exports.authorizationUser = async (req, res) => {
  const body = req.body;
  const { login, password } = body;

  if (body.hasOwnProperty('login')
    && login
    && body.hasOwnProperty('password')
    && password) {
    const candidate = await Users.findOne({ login });
    if (!candidate) return res.status(420).send('Such user does not exist!');

    const comparePassword = bcrypt.compareSync(password, candidate.password);
    if (!comparePassword) return res.status(421).send('Wrong password!');

    const token = generateJwt(login, candidate._id);

    res.send({ authorization: token, image: candidate.imgName });
  } else {
    res.status(422).send('Invalid data entered!');
  }
};

// Add image to user
module.exports.changeUser = async (req, res) => {
  const { headers, files } = req;

  if (files.hasOwnProperty('img')
    && headers.hasOwnProperty('authorization')
    && files.img
    && headers.authorization) {
    const { img } = files;

    let end = img.name.split('.');
    end = end[end.length - 1];
    let fileName = uuid.v4() + '.' + end;
    img.mv(path.resolve(__dirname, '../../../source/images', fileName));
    fileName = 'http://localhost:8000/' + fileName;

    const tokenParse = tokenVerify(headers.authorization);

    Users.updateOne({ _id: tokenParse._id }, { imgName: fileName })
      .then(res.send({ image: fileName }));
  } else {
    res.status(422).send('Invalid data entered!');
  }
}

// -----------------------------------------------------------

module.exports.getAllUser = (req, res) => {
  Users.find().then(result => {
    res.send({ data: result });
  });
};

module.exports.deleteUser = (req, res) => {
  if (req.query._id) {
    Users.deleteOne({ _id: req.query._id }).then(() => {
      res.send('User deleted successfully!');
    });
  } else {
    res.status(422).send('Invalid data entered!');
  }
};