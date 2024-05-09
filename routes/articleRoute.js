const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');
const articleController = require('../controllers/articleController');

router.post('/create', verifyJWT, articleController.createArticle);

router.delete('/:title', verifyJWT, articleController.deleteArticle);

router.get('/list', verifyJWT, articleController.getArticles);

module.exports = router;