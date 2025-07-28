// backend/routes/trackRoutes.js
const express = require('express');
const router = express.Router();
const {
  getTracks,
  getTrackById,
  createTrack,
  updateTrack,
  deleteTrack,
} = require('../controllers/trackController');

router.route('/').get(getTracks).post(createTrack);
router
  .route('/:id')
  .get(getTrackById)
  .put(updateTrack)
  .delete(deleteTrack);

module.exports = router;
