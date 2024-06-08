const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const User = require('./User');

const sentenceSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sentence: {
    type: String,
    required: true,
    unique: true
  },
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place'
  },
  favorite: {
    type: Boolean,
    default: false
  }
});

sentenceSchema.plugin(uniqueValidator);

sentenceSchema.methods.toSentenceResponse = async function () {
  const authorObj = await User.findById(this.author).exec();
  console.log(authorObj);
  return {
    author: await authorObj.toProfileJSON(),
    sentence: this.sentence,
  }
}

sentenceSchema.methods.toSentenceJSON = async function () {
  return {
    sentence: this.sentence
  }
}

sentenceSchema.methods.favoriteTrue = async function () {
  this.favorite = true;
  return this.save();
}

sentenceSchema.methods.favoriteFalse = async function () {
  this.favorite = false;
  return this.save();
}

module.exports = mongoose.model('Sentence', sentenceSchema);