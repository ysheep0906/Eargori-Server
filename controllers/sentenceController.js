const Sentence = require('../models/Sentence');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// 문장을 생성하는 함수
const createSentence = asyncHandler(async (req, res) => {
  const id = req.userId; // 

  const author = await User.findById(id).exec();

  const { sentence, replace, place } = req.body;
  
  const newSentence = await Sentence.create({ sentence, replace, place });

  newSentence.author = id;

  await newSentence.save();

  return await res.status(200).json({
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

// 사용자가 해당 문장을 즐겨찾기에 추가하는 함수
const favoriteSentence = asyncHandler(async (req, res) => {
  const id = req.userId;

  const { sentence } = req.params;
  
  const loginUser = await User.findById(id).exec();
  if (!loginUser) {
    return res.status(401).json({ message : "User Not Found" });
  }

  const currentSentence = await Sentence.findOne({ sentence }).exec();
  if(!currentSentence) {
    return res.status(401).json({ message : 'Sentence Not Found' });
  }

  await currentSentence.favoriteTrue();

  await loginUser.favorite(currentSentence._id);

  return res.status(200).json({
    sentence: await currentSentence.toSentenceResponse()
   });
});

// 사용자가 해당 문장을 즐겨찾기에서 삭제하는 함수
const unfavoriteSentence = asyncHandler(async (req, res) => {
  const id = req.userId;

  const { sentence } = req.params;

  const loginUser = await User.findById(id).exec();
  if (!loginUser) {
    return res.status(401).json({ message : "User Not Found" });
  }

  const currentSentence = await Sentence.findOne({ sentence }).exec();
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



module.exports = {
  createSentence,
  deleteSentence,
  favoriteSentence,
  unfavoriteSentence,
  getSentences,
  getSearchSentences
};