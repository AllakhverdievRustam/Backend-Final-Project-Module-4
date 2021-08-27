const express = require('express');

const router = express.Router();

const {
  getAllUser,
  registrationUser,
  deleteUser,
  authorizationUser,
  changeUser
} = require('../controllers/user.controllers');

router.get('/getAllUser', getAllUser);
router.post('/registrationUser', registrationUser);
router.post('/authorizationUser', authorizationUser);
router.delete('/deleteUser', deleteUser);
router.patch('/changeUser', changeUser);


const {
  getAllReceptions,
  createNewReception,
  editReception,
  deleteReception
} = require('../controllers/reception.controllers');

router.post('/getAllReceptions', getAllReceptions);
router.post('/createNewReception', createNewReception);
router.patch('/editReception', editReception);
router.delete('/deleteReception', deleteReception);

module.exports = router;