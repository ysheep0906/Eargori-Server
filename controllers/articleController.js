const Article = require('../models/Article');
const User = require('../models/User');
const Sentence = require('../models/Sentence');
const Place = require('../models/Place');
const asyncHandler = require('express-async-handler');

// 게시글을 생성하는 함수
const createArticle = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const author = await User.findById(userId).exec();
  if (!author) {
    return res.status(401).json({ message : "User Not Found" });
  }

  const contentName = req.body.content;
  const contentId = author.searchPlace(contentName);
  console.log(contentId)
  const content = await Place.findById(contentId).exec();
  if (!content) {
    return res.status(401).json({ message : "Place Not Found" });
  }

  const { title, description }= req.body;
  if (!title || !description) {
    return res.status(400).json({ message : 'Please fill in all fields' });
  }

  const article = await Article.create({
    title: title,
    description: description,
    content: content._id,
    author: author._id
  });

  await article.save();

  return await res.status(200).json({
    article: await article.toArticleResponse()
  });
});

// 게시글을 삭제하는 함수
const deleteArticle = asyncHandler(async (req, res) => {
  const id = req.userId;

  const loginUser = await User.findById(id).exec();
  if (!loginUser) {
    return res.status(401).json({ message : "User Not Found" });
  }

  const { title } = req.params;
  console.log(title)
  const currentArticle = await Article.findOne({ title: title }).exec();
  if(!currentArticle) {
    return res.status(401).json({ message : 'Article Not Found' });
  }

  if (currentArticle.author.toString() === loginUser._id.toString()) {
    await Article.deleteOne({ title: title });
    return res.status(200).json({ message : 'Deleted' });
  } else {
    return res.status(403).json({ message : 'Only the author can delete his article' });
  }
});

// 게시글을 20개씩 가져오는 함수
const getArticles = asyncHandler(async (req, res) => {
  const articles = await Article.find().limit(20).exec();

  return res.status(200).json({
    articles: await Promise.all(articles.map(async (article) => {
      return await article.toArticleResponse();
    }))
  });
});

module.exports = {
  createArticle,
  deleteArticle,
  getArticles
};