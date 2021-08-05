const express = require('express');

const router = express.Router();

const {
  getAllUser,
  createNewUser,
  deleteUser
} = require('../controllers/user.controllers');

router.get('/getAllUser', getAllUser);
router.post('/createNewUser', createNewUser);
router.delete('/deleteUser', deleteUser);

module.exports = router;