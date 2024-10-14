"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const course_1 = require("../../controllers/course/course");
const router = (0, express_1.Router)();
// Define routes // these route we will use while creating course
router.post('/', course_1.createCourse); // Create a new course
router.post('/:courseId/accessibility', course_1.updateAccessibilitySettings); // Update accessibility settings
router.post('/:courseId/objectives', course_1.addCourseObjectives); // Add course objectives
router.post('/:courseId/parts', course_1.addCourseParts); // Add course parts
router.post('/:courseId/parts/:partId/modules', course_1.addModuleToPart); // Add modules to a part 
router.post('/:courseId/parts/:partId/modules/:moduleId/lessons', course_1.addLessonToModule); // Add lessons to a module
router.post('/:courseId/parts/:partId/modules/:moduleId/questions', course_1.addQuestionsToModule); // Add questions to module
router.post('/:courseId/parts/:partId/modules/:moduleId/attachments', course_1.addAttachmentsToModule); // Add attachments to module 
exports.default = router;
