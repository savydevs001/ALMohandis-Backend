
import { Router } from 'express';
import {
  createCourse,
  updateCourse,
  getCourse,
  deleteCourse,
  updateAccessibilitySettings,
  addCourseObjectives,
  updateCourseObjective,
  addCourseParts,
  updateCoursePart,
  addChapterModule,
  addExamModule,
  addAssignmentModule,
  addAttachmentModule,
  sendforReview
} from '../../controllers/course/course';
import { protect} from '../../middlware/auth'; 

const router = Router();

// -----------------------
// Course Routes
// -----------------------

// Create a new course
router.post(
  '/create',
  protect,
  createCourse
);

// Get a specific course
router.get(
  '/:courseId',
  getCourse
);

// Update a course
router.patch(
  '/:courseId',

  updateCourse
);

// Delete a course
router.delete(
  '/:courseId',

  deleteCourse
);

// -----------------------
// Accessibility Settings Routes
// -----------------------

// Update or create accessibility settings
router.patch(
  '/:courseId/accessibility',
  updateAccessibilitySettings
);

// -----------------------
// Course Objectives Routes
// -----------------------

// Add course objectives
router.post(
  '/:courseId/objectives',
  addCourseObjectives
);

// Update a specific course objective
router.patch(
  '/:courseId/objectives/:objectiveIndex',

  updateCourseObjective
);

// -----------------------
// Course Parts Routes
// -----------------------

// Add course parts
router.post(
  '/:courseId/createPart',
  addCourseParts
);

// Update a specific course part
router.patch(
  '/:courseId/parts/:partId',
  updateCoursePart
);

// -----------------------
// Modules Related Routes
// -----------------------

router.post('/:courseId/parts/:partId/modules/chapter', addChapterModule);
router.post('/:courseId/parts/:partId/modules/exam', addExamModule);
router.post('/:courseId/parts/:partId/modules/assignment', addAssignmentModule);
router.post('/:courseId/parts/:partId/modules/attachment', addAttachmentModule);

// send for Review
router.post('/:courseId/send-for-review', sendforReview);



export default router;
