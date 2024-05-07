const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


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

sentenceSchema.methods.toSentenceResponse = async function ( user ) {
  const authorObj = await User.findById(this.author).exec();
  return {
    sentence: this.sentence,
    replace: this.replace,
    place: this.place
  }
}

module.exports = mongoose.model('Sentence', sentenceSchema);