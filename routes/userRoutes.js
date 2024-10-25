const express = require('express');
const {
  getAllUsers,
  registerController,
  loginController,
} = require('../controllers/userController');

//routee object
const router = express.Router();

//GET all users || GET method used
router.get('/all-users', getAllUsers);

//Create user || POST method
router.post('/register', registerController);

//Login || POST method
router.post('/login', loginController);

module.exports = router;
