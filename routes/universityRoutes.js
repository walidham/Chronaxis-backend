const express = require('express');
const router = express.Router();
const {
  getUniversity,
  updateUniversity,
} = require('../controllers/universityController');

router.route('/').get(getUniversity).post(updateUniversity);

module.exports = router;