const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const { json } = require('express');

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
  }],
  places: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place'
  }]
});

userSchema.plugin(uniqueValidator);

userSchema.methods.generateToken = function () {
  const accessToken = jwt.sign({
    "user" : {
      "id" : this._id,
      "password" : this.password,
    }
  }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
  return accessToken;
}

userSchema.methods.toUserResponse = function () {
  return {
    username: this.username,
    nickname: this.nickname,
    favoriteSentences: this.favoriteSentences || [],
    places: this.places || [],
    token: this.generateToken()
  }
}

userSchema.methods.toProfileJSON = function () {
  return {
    username: this.username,
    nickname: this.nickname
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

userSchema.methods.savePlace = function (id) {
  if (this.places.indexOf(id) === -1) {
    this.places.push(id);
  }
  return this.save();
}

userSchema.methods.removePlace = function (id) {
  if (this.places.indexOf(id) !== -1) {
    this.places.remove(id);
  }
  return this.save();
}

userSchema.methods.searchPlace = function (place) {
  // place 모델 안에 place 요소가 같은지 확인하고 id return
  for (let i = 0; i < this.places.length; i++) {
    if (this.places[i].toString() === place) {
      return this.places[i].toString();
    }
  }

  return null;
}

module.exports = mongoose.model('User', userSchema);