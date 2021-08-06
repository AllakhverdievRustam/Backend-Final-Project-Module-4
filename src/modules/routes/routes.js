const express = require('express');

const router = express.Router();

const {
  getAllUser,
  registrationUser,
  deleteUser,
  authorizationUser,
} = require('../controllers/user.controllers');

router.get('/getAllUser', getAllUser);
router.post('/registrationUser', registrationUser);
router.post('/authorizationUser', authorizationUser);
router.delete('/deleteUser', deleteUser);


const {
  getAllReceptions
} = require('../controllers/reception.controllers');

router.get('/getAllReceptions', getAllReceptions);

module.exports = router;