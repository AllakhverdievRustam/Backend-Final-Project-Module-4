const Users = require('../../db/models/user/Index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

SECRET_KEY = 'Rustam4ik228322';
const generateJwt = (password) => {
  return jwt.sign(
    { password },
    SECRET_KEY,
    { expiresIn: '24h' }
  )
}

module.exports.createNewUser = async (req, res) => {
  const users = new Users(req.body);
  const body = req.body;
  const { login, password } = body;

  if (body.hasOwnProperty('login')
    && body.hasOwnProperty('password')
    && login
    && password) {

    const candidate = await Users.findOne({ login: body.login });
    if (candidate) return res.send('Такой пользователь уже существует!');
    
    const hashPassword = await bcrypt.hash(password, 5);

    const newUser = await Users.create({ login: login, password: hashPassword });

    newUser.save();

    const token = generateJwt(body.login);

    res.send(token);
  } else {
    res.status(422).send('Введены неверные данные!');
  }
};

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
    res.status(422).send('Введены неверные данные!');
  }
};