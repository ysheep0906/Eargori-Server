const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');
const sentenceController = require('../controllers/sentenceController');

router.post('/create', verifyJWT, sentenceController.createSentence);

router.delete('/', verifyJWT, sentenceController.deleteSentence);

router.get('/favorite', verifyJWT, sentenceController.getFavoriteSentences);

router.post('/favorite', verifyJWT, sentenceController.favoriteSentence);

router.post('/unfavorite', verifyJWT, sentenceController.unfavoriteSentence);

router.get('/', verifyJWT, sentenceController.getSentences);

router.post('/search', verifyJWT, sentenceController.getSearchSentences);

router.get('/ids', verifyJWT, sentenceController.getSentencesByIds);

module.exports = router;