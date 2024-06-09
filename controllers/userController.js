const User = require('../models/User');
const Place = require('../models/Place');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

const registerUser = asyncHandler(async (req, res) => {
  const { username, password, nickname } = req.body;

  if (!nickname || !username || !password) {
    return res.status(400).json({message: "모든 칸을 채워주세요"});
  }

  const existingUser = await User.findOne({ username: username }).exec();
  if (existingUser) {
    return res.status(409).json({ message: "중복된 아이디가 존재합니다." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userObject = {
    "username": username,
    "password": hashedPassword,
    "nickname": nickname
  }

  const createdUser = await User.create(userObject);
  
  
  if (createdUser) {
    res.status(201).json({
      "user": createdUser.toProfileJSON()
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
    return res.status(404).json({ message : "아이디 혹은 비밀번호 오류" });
  }

  const match = await bcrypt.compare(password, loginUser.password);

  if(!match) {
    return res.status(401).json({ message : '아이디 혹은 비밀번호 오류' });
  }

  res.status(200).json({
    user : loginUser.toUserResponse(),
  });

});

const getUser = asyncHandler(async (req, res) => {
  const id = req.userId;

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(401).json({ message : "User Not Found" });
  }

  return res.status(200).json({
    user : user.toProfileJSON()
  });
});

module.exports = {
  registerUser,
  userLogin,
  getUser
};