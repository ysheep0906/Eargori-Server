const mongoose = require('mongoose');
const User = require('./User');
const Sentence = require('./Sentence');

const placeSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  place: {
    type: String,
    required: true,
    unique: true
  },
  sentences: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sentence'
  }]
});

placeSchema.methods.toPlaceResponse = async function () {
  const authorObj = await User.findById(this.author).exec();
  return {
    author: await authorObj.toProfileJSON(),
    place: this.place,
    sentences: this.sentences
  }
}

//장소에 문장을 추가하는 함수
placeSchema.methods.insertSentence = async function (id) {
  if (this.sentences.indexOf(id) === -1) {
    console.log(id);
    this.sentences.push(id);
  }
  return this.save();
}

//장소에 있는 문장을 삭제하는 함수
placeSchema.methods.deleteSentence = async function (id) {
  if (this.sentences.indexOf(id) !== -1) {
    this.sentences.remove(id);
  }
  return this.save();
}

//장소를 삭제하는 함수, 장소가 삭제되면 안에 들어있는 Sentence들도 모두 삭제
placeSchema.methods.deletePlace = async function () {
  const sentences = this.sentences;
  for ( const sentence of sentences ) {
    await Sentence.findByIdAndDelete(sentence).exec();
  }
}

module.exports = mongoose.model('Place', placeSchema);