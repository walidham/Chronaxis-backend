// backend/routes/academicYearRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear
} = require('../controllers/academicYearController');

router.route('/').get(getAcademicYears).post(createAcademicYear);
router.route('/:id').put(updateAcademicYear).delete(deleteAcademicYear);

module.exports = router;
