const express = require('express');
const router = express.Router();
const {
  getStudyPlans,
  getStudyPlanById,
  createStudyPlan,
  updateStudyPlan,
  deleteStudyPlan,
} = require('../controllers/studyPlanController');

router.route('/').get(getStudyPlans).post(createStudyPlan);
router
  .route('/:id')
  .get(getStudyPlanById)
  .put(updateStudyPlan)
  .delete(deleteStudyPlan);

module.exports = router;