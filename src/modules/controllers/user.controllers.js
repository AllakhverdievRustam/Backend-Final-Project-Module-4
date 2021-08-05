const Users = require('../../db/models/user/Index');

module.exports.getAllUser = (req, res) => {
  Users.find().then(result => {
    res.send({data: result});
  });
};

module.exports.createNewUser = (req, res) => {
  const users = new Users(req.body);
  const body = req.body;

  if (body.hasOwnProperty('login') 
  && body.hasOwnProperty('password')
  && body.login
  && body.password) {
    users.save(body).then(() => {
      Users.find().then(result => {
        res.send({data: result});
      });
    });
  } else {
    res.status(422).send('Error!');
  }
};

module.exports.deleteUser = (req, res) => {
  if (req.query._id) {
    Users.deleteOne({ _id: req.query._id }).then(() => {
      Users.find().then(result => {
        res.send({data: result});
      });
    });
  } else {
    res.status(422).send('Error!');
  }
};