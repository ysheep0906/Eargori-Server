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
  replace: {
    type: String,
    required: true
  },
  place: {
    type: String,
  }
});

sentenceSchema.plugin(uniqueValidator);

sentenceSchema.methods.toSentenceResponse = async function () {
  const authorObj = await User.findById(this.author).exec();
  console.log(authorObj);
  return {
    author: await authorObj.toProfileJSON(),
    sentence: this.sentence,
    replace: this.replace,
    place: this.place
  }
}

sentenceSchema.methods.toSentenceJSON = async function () {
  return {
    sentence: this.sentence
  }
}


module.exports = mongoose.model('Sentence', sentenceSchema);