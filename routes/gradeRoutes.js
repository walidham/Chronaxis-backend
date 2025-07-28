const express = require('express');
const router = express.Router();
const {
  getGrades,
  createGrade,
  updateGrade,
  deleteGrade,
} = require('../controllers/gradeController');

router.route('/').get(getGrades).post(createGrade);
router.route('/:id').put(updateGrade).delete(deleteGrade);

module.exports = router;