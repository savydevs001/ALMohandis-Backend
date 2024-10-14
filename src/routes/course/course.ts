
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
  addModuleToPart,
  updateModuleInPart,
  addLessonToModule,
  updateLessonInModule,
  addQuestionsToModule,
  updateQuestionsInModule,
  addAttachmentsToModule,
  updateAttachmentsInModule,
} from '../../controllers/course/course';
import { protect, admin } from '../../middlware/auth'; 

const router = Router();

// -----------------------
// Course Routes
// -----------------------

// Create a new course
router.post(
  '/',
  // Optionally, add validation middlewares here
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
  '/:courseId/parts',
  addCourseParts
);

// Update a specific course part
router.patch(
  '/:courseId/parts/:partId',
  updateCoursePart
);

// -----------------------
// Modules Routes
// -----------------------

// Add modules to a part
router.post(
  '/:courseId/parts/:partId/modules',
  addModuleToPart
);

// Update a specific module in a part
router.patch(
  '/:courseId/parts/:partId/modules/:moduleId',
  updateModuleInPart
);

// -----------------------
// Lessons Routes
// -----------------------

// Add lessons to a module
router.post(
  '/:courseId/parts/:partId/modules/:moduleId/lessons',
  addLessonToModule
);

// Update a specific lesson in a module
router.patch(
  '/:courseId/parts/:partId/modules/:moduleId/lessons/:lessonId',
  updateLessonInModule
);

// -----------------------
// Questions Routes
// -----------------------

// Add questions to a module
router.post(
  '/:courseId/parts/:partId/modules/:moduleId/questions',
  addQuestionsToModule
);

// Update a specific question in a module
router.patch(
  '/:courseId/parts/:partId/modules/:moduleId/questions/:questionId',
  updateQuestionsInModule
);

// -----------------------
// Attachments Routes
// -----------------------

// Add attachments to a module
router.post(
  '/:courseId/parts/:partId/modules/:moduleId/attachments',
  addAttachmentsToModule
);

// Update a specific attachment in a module
router.patch(
  '/:courseId/parts/:partId/modules/:moduleId/attachments/:attachmentId',
)

export default router;
