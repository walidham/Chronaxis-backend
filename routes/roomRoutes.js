const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');

router.route('/').get(getRooms).post(protect, createRoom);
router
  .route('/:id')
  .get(getRoomById)
  .put(protect, updateRoom)
  .delete(protect, deleteRoom);

module.exports = router;