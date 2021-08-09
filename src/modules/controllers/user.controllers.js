const Users = require('../../db/models/user/Index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

SECRET_KEY = 'Rustam4ik228322';
const generateJwt = (login, _id) => {
  return jwt.sign(
    { login, _id },
    SECRET_KEY,
    { expiresIn: '24h' }
  )
}

// Registration
module.exports.registrationUser = async (req, res) => {
  const body = req.body;
  const { login, password } = body;

  if (body.hasOwnProperty('login')
    && body.hasOwnProperty('password')
    && login
    && password) {

    const candidate = await Users.findOne({ login: body.login });
    if (candidate) return res.status(421).send('This user already exists!');
    
    const hashPassword = await bcrypt.hash(password, 5);

    const newUser = await Users.create({ login: login, password: hashPassword });

    newUser.save();

    const token = generateJwt(newUser.login, newUser._id);

    res.send(token);
  } else {
    res.status(422).send('Invalid data entered!');
  }
};

// Authorization
module.exports.authorizationUser = async (req, res) => {
  const body = req.body;
  const { login, password, _id } = body;

  if (body.hasOwnProperty('login')
    && login
    && body.hasOwnProperty('password')
    && password) {
      const candidate = await Users.findOne({ login });
      if (!candidate) return res.status(420).send('Such user does not exist!');
      
      const comparePassword = bcrypt.compareSync(password, candidate.password);
      if (!comparePassword) return res.status(421).send('Wrong password!');

      const token = generateJwt(login, _id);
      
      res.send({ token, login: candidate.login, _id: candidate._id });
  } else {
    res.status(422).send('Invalid data entered!');
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
    res.status(422).send('Invalid data entered!');
  }
};