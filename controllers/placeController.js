const Place = require('../models/Place');
const User = require('../models/User');
const Sentence = require('../models/Sentence');
const asyncHandler = require('express-async-handler');

//장소를 조회하는 함수
const getPlaces = asyncHandler(async (req, res) => {
  const id = req.userId;

  const loginUser = await User.findById(id).exec();
  if (!loginUser) {
    return res.status(401).json({ message : "User Not Found" });
  }

  const places = await Place.find({ _id : { $in : loginUser.places } }).exec();
  if(!places) {
    return res.status(401).json({ message : 'Place Not Found' });
  }

  return res.status(200).json({
    places: places
  });
});

// 장소를 생성하는 함수
const createPlace = asyncHandler(async (req, res) => {
  const id = req.userId;

  const author = await User.findById(id).exec();
  if (!author) {
    return res.status(401).json({ message : "User Not Found" });
  }

  const emptyContent = [];
  const place = req.body.place;
  if (!place) {
    return res.status(400).json({ message : "장소를 입력해주세요" });
  }

  const newPlace = await Place.create({
    author: author._id,
    place: place,
    sentences: emptyContent
  });

  await newPlace.save();
  await author.savePlace(newPlace._id);

  return await res.status(200).json({
    place: await newPlace.toPlaceResponse()
  })
});

const insertPlace = asyncHandler(async (req, res) => {
  const id = req.userId;

  const { place, sentence } = req.body;

  const loginUser = await User.findById(id).exec();
  if (!loginUser) {
    return res.status(401).json({ message : "User Not Found" });
  }

  const currentPlace = await Place.findOne({ place: place }).exec();
  if(!currentPlace) {
    return res.status(401).json({ message : 'Place Not Found' });
  }

  // memo: 장소 추가하기 전에 문장을 미리 생성해야함!
  const currentSentence = await Sentence.findOne({ sentence: sentence }).exec();
  if(!currentSentence) {
    return res.status(401).json({ message : 'Sentence Not Found' });
  }

  await currentPlace.insertSentence(currentSentence._id); // Place에 Sentence 추가 함수

  return await res.status(200).json({
    place: await currentPlace.toPlaceResponse()
  });
});

// 장소를 삭제하는 함수
const deletePlace = asyncHandler(async (req, res) => {
  const id = req.userId;

  const { place } = req.body;

  const loginUser = await User.findById(id).exec();
  if (!loginUser) {
    return res.status(401).json({ message : "User Not Found" });
  }

  const currentPlace = await Place.findOne({ _id : place }).exec();
  if(!currentPlace) {
    return res.status(401).json({ message : 'Place Not Found' });
  }

  await loginUser.removePlace(currentPlace._id); // User 장소 삭제 함수
  await currentPlace.deletePlace(); // Place 내 Sentence 삭제 함수

  if(currentPlace.author.toString() === loginUser._id.toString()) {
    await Place.deleteOne({ _id : place });
    return res.status(200).json({ message : 'Deleted' });
  } else {
    return res.status(403).json({ message : 'Only the author can delete his place' });
  }
});

//장소에 문장들을 보여주는 함수
const getPlaceSentences = asyncHandler(async (req, res) => {
  const id = req.userId;
  const sentenceList = [];

  const { place } = req.body;

  const loginUser = await User.findById(id).exec();
  if (!loginUser) {
    return res.status(401).json({ message : "User Not Found" });
  }

  const currentPlace = await Place.findOne({ _id : place }).exec();
  if(!currentPlace) {
    return res.status(401).json({ message : 'Place Not Found' });
  }
  
  for ( const sentence of currentPlace.sentences ) {
    const currentSentence = await Sentence.findOne({ _id : sentence }).exec();
    if(!currentSentence) {
      return res.status(401).json({ message : 'Sentence Not Found' });
    }
    console.log(currentSentence);
    sentenceList.push(currentSentence);
  }

  return res.status(200).json({
    sentences: sentenceList
  });
});

module.exports = {
  getPlaces,
  createPlace,
  insertPlace,
  deletePlace,
  getPlaceSentences
};