const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const User = require('./User');
const Sentence = require('./Sentence');
const Place = require('./Place');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},  { timestamps: true
});

articleSchema.plugin(uniqueValidator);

articleSchema.methods.toArticleResponse = async function() {
  const authorObj = await User.findById(this.author).exec();
  const contentObj = await Place.findById(this.content).exec();
  return {
    title: this.title,
    description: this.description,
    content: await contentObj.toPlaceResponse(),
    favoriteCount: this.favoriteCount,
    author: await authorObj._id
  }
}

articleSchema.methods.updateFavoriteCount = async function () {
  const favoriteCount = await User.count({
    favoriteSentences: {$in: [this._id]}
  });

  this.favoriteCount = favoriteCount;

  return this.save();
}

module.exports = mongoose.model('Article', articleSchema);

