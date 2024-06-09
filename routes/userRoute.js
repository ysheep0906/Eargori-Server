const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');
const userController = require('../controllers/userController');

router.post('/login', userController.userLogin);

router.post('/register', userController.registerUser);

router.get('/profile', verifyJWT,userController.getUser);

module.exports = router;