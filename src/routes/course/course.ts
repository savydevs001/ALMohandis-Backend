import { Router } from 'express';
import {
  createCourse,
  updateAccessibilitySettings,
  addCourseObjectives,
  addCourseParts,
  addModuleToPart,
  addLessonToModule,
  addQuestionsToModule,
  addAttachmentsToModule,
} from '../../controllers/course/course';

const router = Router();

// Define routes // these route we will use while creating course
router.post('/', createCourse); // Create a new course
router.post('/:courseId/accessibility', updateAccessibilitySettings); // Update accessibility settings
router.post('/:courseId/objectives', addCourseObjectives); // Add course objectives
router.post('/:courseId/parts', addCourseParts); // Add course parts
router.post('/:courseId/parts/:partId/modules', addModuleToPart); // Add modules to a part
router.post('/:courseId/parts/:partId/modules/:moduleId/lessons', addLessonToModule); // Add lessons to a module
router.post('/:courseId/parts/:partId/modules/:moduleId/questions', addQuestionsToModule); // Add questions to module
router.post('/:courseId/parts/:partId/modules/:moduleId/attachments', addAttachmentsToModule); // Add attachments to module 

export default router;
