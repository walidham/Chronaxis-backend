// backend/routes/academicYearRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear
} = require('../controllers/academicYearController');

router.route('/').get(getAcademicYears).post(protect, createAcademicYear);
router.route('/:id').put(protect, updateAcademicYear).delete(protect, deleteAcademicYear);

module.exports = router;
