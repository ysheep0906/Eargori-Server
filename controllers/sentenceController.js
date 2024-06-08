const Sentence = require('../models/Sentence');
const User = require('../models/User');
const Place = require('../models/Place');
const asyncHandler = require('express-async-handler');

// 문장을 생성하는 함수
const createSentence = asyncHandler(async (req, res) => {
  const id = req.userId; 

  const author = await User.findById(id).exec();
  if (!author) {
    return res.status(401).json({ message : "사용자를 찾을 수 없습니다." });
  }

  const { sentence, place } = req.body;
  if (!sentence) {
    return res.status(400).json({ message : "문장을 입력해주세요" });
  }

  const placeSet = await Place.findById(place).exec();
  if (!placeSet) {
    return res.status(401).json({ message : "장소를 찾을 수 없습니다." });
  }
  
  const newSentence = await Sentence.create({ sentence: sentence, place: placeSet});

  newSentence.author = id;

  await newSentence.save();

  await placeSet.insertSentence(newSentence._id);

  return await res.status(201).json({
    sentence: await newSentence.toSentenceResponse()
  })
});

// 문장을 삭제하는 함수
const deleteSentence = asyncHandler(async (req, res) => {
  const id = req.userId;

  const { sentence } = req.params;

  const loginUser = await User.findById(id).exec();
  if (!loginUser) {
    return res.status(401).json({ message : "User Not Found" });
  }

  const currentSentence = await Sentence.findOne({sentence})
  if(!currentSentence) {
    return res.status(401).json({ message : 'Sentence Not Found' });
  }

  if(currentSentence.author.toString() === loginUser._id.toString()) {
    await loginUser.unfavorite(currentSentence._id);
    await Sentence.deleteOne({ sentence : sentence });
    return res.status(200).json({ message : 'Deleted' });
  } else {
    return res.status(403).json({ message : 'Only the author can delete his sentence' });
  }
});

//사용자의 즐겨찾기 문장 전부를 가져오는 함수
const getFavoriteSentences = asyncHandler(async (req, res) => {
  const id = req.userId;

  const loginUser = await User.findById(id).exec();
  if (!loginUser) {
    return res.status(401).json({ message : "User Not Found" });
  }

  const favoriteSentences = await Sentence.find({ _id : { $in : loginUser.favoriteSentences } }).exec();
  if(!favoriteSentences) {
    return res.status(401).json({ message : 'Sentence Not Found' });
  }

  return res.status(200).json({
    sentences: favoriteSentences
  });
});

// 사용자가 해당 문장을 즐겨찾기에 추가하는 함수
const favoriteSentence = asyncHandler(async (req, res) => {
  const id = req.userId;

  const { sentence } = req.body;
  if (!sentence) {
    return res.status(400).json({ message : "Sentence Not Found" });
  }
  console.log(sentence);

  
  const loginUser = await User.findById(id).exec();
  if (!loginUser) {
    return res.status(401).json({ message : "User Not Found" });
  }

  const currentSentence = await Sentence.findOne({ 
    author: loginUser._id,
    sentence: sentence 
  }).exec();
  if(!currentSentence) {
    return res.status(401).json({ message : 'Sentence Not Found' });
  }
  console.log(currentSentence);

  await currentSentence.favoriteTrue();

  await loginUser.favorite(currentSentence._id);

  return res.status(200).json({
    sentence: await currentSentence.toSentenceResponse()
   });
});

// 사용자가 해당 문장을 즐겨찾기에서 삭제하는 함수
const unfavoriteSentence = asyncHandler(async (req, res) => {
  const id = req.userId;

  const { sentence } = req.body;

  const loginUser = await User.findById(id).exec();
  if (!loginUser) {
    return res.status(401).json({ message : "User Not Found" });
  }

  const currentSentence = await Sentence.findOne({ 
    author: loginUser._id,
    sentence: sentence }).exec();
  if(!currentSentence) {
    return res.status(401).json({ message : 'Sentence Not Found' });
  }

  await loginUser.unfavorite(currentSentence._id);
  await currentSentence.favoriteFalse();

  return res.status(200).json({
    sentence: await currentSentence.toSentenceResponse()
  });
});

// 사용자가 작성한 문장을 가져오는 함수
const getSentences = asyncHandler(async (req, res) => {
  const id = req.userId;

  const author = await User.findById(id).exec();
  if (!author) {
    return res.status(401).json({ message : "User Not Found" });
  }

  const userSentences = await Sentence.find({ author : author }).exec();
  if(!userSentences) {
    return res.status(401).json({ message : 'Sentence Not Found' });
  }

  return res.status(200).json({
    sentences: userSentences
  });
});

// 사용자가 작성한 문장 중 검색한 문장을 가져오는 함수
const getSearchSentences = asyncHandler(async (req, res) => {
  const id = req.userId;
  const sentence = req.body.sentence;
  const author = await User.findById(id).exec();
  if (!author) {
    return res.status(401).json({ message : "User Not Found" });
  }

  const userSentences = await Sentence.find({ 
    author : author,
    sentence: { $regex: sentence, $options: 'i' }

   }).exec();

  return res.status(200).json({ sentences: userSentences });
});

//문장 아이디 리스트를 주면 문장 리스트를 반환하는 함수
const getSentencesByIds = asyncHandler(async (req, res) => {
  const { sentenceIds } = req.body;

  const sentences = await Sentence.find({ _id : { $in : sentenceIds } }).exec();
  if(!sentences) {
    return res.status(401).json({ message : 'Sentence Not Found' });
  }

  return res.status(200).json({
    sentences: sentences
  });
});


module.exports = {
  createSentence,
  deleteSentence,
  getFavoriteSentences,
  favoriteSentence,
  unfavoriteSentence,
  getSentences,
  getSearchSentences,
  getSentencesByIds
};