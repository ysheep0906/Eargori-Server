const express = require('express');
const router = express.Router();
const sentenceController = require('../controllers/sentenceController');

router.post('/create', sentenceController.createSentence);

router.delete('/:sentence', sentenceController.deleteSentence);

router.post('/favorite', sentenceController.favoriteSentence);

router.delete('/:sentence/favorite', sentenceController.unfavoriteSentence);

router.get('/', sentenceController.getSentences);

router.post('/search', sentenceController.getSearchSentences);

module.exports = router;