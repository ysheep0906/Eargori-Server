const Place = require('../models/Place');
const User = require('../models/User');
const Sentence = require('../models/Sentence');
const asyncHandler = require('express-async-handler');

// 장소를 생성하는 함수
const createPlace = asyncHandler(async (req, res) => {
  const id = req.userId;

  const author = await User.findById(id).exec();
  if (!author) {
    return res.status(401).json({ message : "User Not Found" });
  }

  const emptyContent = [];
  const place = req.body.place;

  const newPlace = await Place.create({
    author: author._id,
    place: place,
    content: emptyContent
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

  const { place } = req.params;

  const loginUser = await User.findById(id).exec();
  if (!loginUser) {
    return res.status(401).json({ message : "User Not Found" });
  }

  const currentPlace = await Place.findOne({ place }).exec();
  if(!currentPlace) {
    return res.status(401).json({ message : 'Place Not Found' });
  }

  await loginUser.removePlace(currentPlace._id); // User 장소 삭제 함수
  await currentPlace.deletePlace(); // Place 내 Sentence 삭제 함수

  if(currentPlace.author.toString() === loginUser._id.toString()) {
    await Place.deleteOne({ place : place });
    return res.status(200).json({ message : 'Deleted' });
  } else {
    return res.status(403).json({ message : 'Only the author can delete his place' });
  }
});

module.exports = {
  createPlace,
  insertPlace,
  deletePlace
};