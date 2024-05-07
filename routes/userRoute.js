const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/login', userController.userLogin);

router.post('/register', userController.registerUser);

module.exports = router;