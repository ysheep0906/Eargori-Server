const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');
const placeController = require('../controllers/placeController');

router.post('/create', verifyJWT, placeController.createPlace);

router.post('/insert', verifyJWT, placeController.insertPlace);

router.delete('/:place', verifyJWT, placeController.deletePlace);

module.exports = router;