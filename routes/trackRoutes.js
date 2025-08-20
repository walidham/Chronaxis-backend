const express = require('express');
const router = express.Router();
const { getTracks, createTrack, updateTrack, deleteTrack } = require('../controllers/trackController');

router.route('/')
  .get(getTracks)
  .post(createTrack);

router.route('/:id')
  .put(updateTrack)
  .delete(deleteTrack);

module.exports = router;