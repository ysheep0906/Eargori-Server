const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

const registerUser = asyncHandler(async (req, res) => {
  const { username, password, nickname } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    "username": username,
    "password": hashedPassword,
    "nickname": nickname
  }

  const createdUser = await User.create(user);
  
  if (createdUser) {
    res.status(201).json({
      "user": createdUser.toUserResponse()
    });
  } else {
    res.status(422).json({
      "error": {
        body: "Unable to register a user"
      }
    });
  }
});

const userLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const loginUser = await User.findOne({ username: username }).exec();

  if (!loginUser) {
    return res.status(404).json({ message : "User Not Found" });
  }

  const match = await bcrypt.compare(password, loginUser.password);

  if(!match) {
    return res.status(401).json({ message : 'Unauthorized: Wrong password' });
  }

  res.status(200).json({
    user : loginUser.toUserResponse()
  });

});

module.exports = {
  registerUser,
  userLogin
};