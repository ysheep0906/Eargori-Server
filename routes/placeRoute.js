const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');
const placeController = require('../controllers/placeController');

router.get('/', verifyJWT, placeController.getPlaces);

router.post('/create', verifyJWT, placeController.createPlace);

router.post('/insert', verifyJWT, placeController.insertPlace);

router.delete('/', verifyJWT, placeController.deletePlace);

router.get('/sentence', verifyJWT, placeController.getPlaceSentences);

module.exports = router;