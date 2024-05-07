const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  favoriteSentences: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sentence'
  }]
});

userSchema.plugin(uniqueValidator);

userSchema.methods.generateToken = async function () {
  const user = this;
  const accessToken = jwt.sign({
    "user" : {
      "username" : this.username,
      "password" : this.password,
    }
  }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  return accessToken;
}

userSchema.methods.toUserResponse = async function () {
  return {
    username: this.username,
    nickname: this.nickname,
    favoriteSentences: this.favoriteSentences
  }
}

userSchema.methods.favorite = function (id) {
  if (this.favoriteSentences.indexOf(id) === -1) {
    this.favoriteSentences.push(id);
  }
  return this.save();
}

userSchema.methods.unfavorite = function (id) {
  if (this.favoriteSentences.indexOf(id) !== -1) {
    this.favoriteSentences.remove(id);
  }
  return this.save();
}

module.exports = mongoose.model('User', userSchema);