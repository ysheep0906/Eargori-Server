const Sentence = require('../models/sentence');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');

// sentence를 만들고 이것을 mongodb에 저장하는 함수
const createSentence = asyncHandler(async (req, res) => {
  const id = req.userId;

  const author = await User.findById(id).exec();

  const { sentence, replace, place } = req.body;
  
  const newSentence = await Sentence.create({ sentence, replace, place });

  await newSentence.save();

  return await res.status(200).json({
    sentence: await newSentence.toSentenceResponse()
  })
});

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
    await Sentence.deleteOne({ sentence : sentence });
    return res.status(200).json({ message : 'Deleted' });
  } else {
    return res.status(403).json({ message : 'Only the author can delete his sentence' });
  }
});

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

  await loginUser.favoriteSentence(currentSentence._id);

  return res.status(200).json({
    sentence: await currentSentence.toSentenceResponse()
   });
});

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

  await loginUser.unfavoriteSentence(currentSentence._id);

  return res.status(200).json({
    sentence: await currentSentence.toSentenceResponse()
  });
});

module.exports = {
  createSentence,
  deleteSentence
};