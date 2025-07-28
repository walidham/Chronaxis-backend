const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  importCourses
} = require('../controllers/courseController');

router.route('/').get(getCourses).post(createCourse);
router
  .route('/:id')
  .get(getCourseById)
  .put(updateCourse)
  .delete(deleteCourse);

router.post('/import', importCourses);


module.exports = router;