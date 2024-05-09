const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');
const sentenceController = require('../controllers/sentenceController');

router.post('/create', verifyJWT, sentenceController.createSentence);

router.delete('/:sentence', verifyJWT, sentenceController.deleteSentence);

router.post('/favorite', verifyJWT, sentenceController.favoriteSentence);

router.delete('/:sentence/favorite', verifyJWT, sentenceController.unfavoriteSentence);

router.get('/', verifyJWT, sentenceController.getSentences);

router.post('/search', verifyJWT, sentenceController.getSearchSentences);

module.exports = router;