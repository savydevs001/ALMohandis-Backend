// src/controllers/courseController.ts

import { Request, Response } from 'express';
import prisma from '../../prisma/client';
import {
  Course,
  CreateCourseInput,
  UpdateCourseInput,
  AccessibilitySettings,
  UpdateAccessibilitySettingsInput,
  AddCourseObjectivesInput,
  AddCoursePartInput,
  ModuleType,
  AddModuleToPartInput,
  Lesson,
  AddLessonToModuleInput,
  Question,
  AddQuestionsToModuleInput,
  Attachment,
  AddAttachmentsToModuleInput,
} from '../../types/types';

// Helper function for error handling
const handleError = (res: Response, error: any, message: string) => {
  console.error(message, error);
  res.status(500).json({ error: message });
};

// -----------------------
// Create a New Course
// -----------------------
export const createCourse = async (req: Request, res: Response) => {
  const { title, description, isFree, objectives, instructorId }: CreateCourseInput = req.body;

  // Basic validation
  if (!title || !description || isFree === undefined || !objectives || !instructorId) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const course = await prisma.course.create({
      data: {
        title,
        description,
        isFree,
        objectives,
        instructorId,
      },
    });
    res.status(201).json(course);
  } catch (error) {
    handleError(res, error, 'An error occurred while creating the course.');
  }
};

// -----------------------
// Update an Existing Course
// -----------------------
export const updateCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { title, description, isFree, objectives }: UpdateCourseInput = req.body;

  try {
    // Check if the course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!existingCourse) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        title: title ?? existingCourse.title,
        description: description ?? existingCourse.description,
        isFree: isFree ?? existingCourse.isFree,
        objectives: objectives ?? existingCourse.objectives,
      },
    });

    res.status(200).json(updatedCourse);
  } catch (error) {
    handleError(res, error, 'An error occurred while updating the course.');
  }
};

// -----------------------
// Get a Specific Course
// -----------------------
export const getCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        accessibility: true,
        parts: {
          include: {
            modules: true,
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    res.status(200).json(course);
  } catch (error) {
    handleError(res, error, 'An error occurred while retrieving the course.');
  }
};

// -----------------------
// Delete a Course
// -----------------------
export const deleteCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params;

  try {
    // Check if the course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!existingCourse) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    // Delete the course (Cascade delete based on Prisma schema)
    await prisma.course.delete({
      where: { id: courseId },
    });

    res.status(200).json({ message: 'Course deleted successfully.' });
  } catch (error) {
    handleError(res, error, 'An error occurred while deleting the course.');
  }
};

// -----------------------
// Update Accessibility Settings
// -----------------------
export const updateAccessibilitySettings = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { studentAccessType, academicStage, canAccessIfPurchased }: UpdateAccessibilitySettingsInput = req.body;

  try {
    // Check if the course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    // Check if accessibility settings already exist
    const existingSettings = await prisma.accessibilitySettings.findUnique({
      where: { courseId },
    });

    if (existingSettings) {
      // Update existing settings
      const updatedSettings = await prisma.accessibilitySettings.update({
        where: { courseId },
        data: {
          studentAccessType: studentAccessType ?? existingSettings.studentAccessType,
          academicStage: academicStage ?? existingSettings.academicStage,
          canAccessIfPurchased: canAccessIfPurchased ?? existingSettings.canAccessIfPurchased,
        },
      });
      res.status(200).json(updatedSettings);
    } else {
      // Create new settings
      const accessibility = await prisma.accessibilitySettings.create({
        data: {
          courseId,
          studentAccessType,
          academicStage,
          canAccessIfPurchased,
        },
      });
      res.status(201).json(accessibility);
    }
  } catch (error) {
    handleError(res, error, 'An error occurred while updating accessibility settings.');
  }
};

// -----------------------
// Add Course Objectives
// -----------------------
export const addCourseObjectives = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { objectives }: AddCourseObjectivesInput = req.body;

  if (!objectives || !Array.isArray(objectives)) {
    return res.status(400).json({ error: 'Objectives must be an array of strings.' });
  }

  try {
    // Check if the course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    // Update course objectives
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: { objectives },
    });

    res.status(200).json(updatedCourse);
  } catch (error) {
    handleError(res, error, 'An error occurred while adding course objectives.');
  }
};

// -----------------------
// Update a Specific Course Objective
// -----------------------
export const updateCourseObjective = async (req: Request, res: Response) => {
  const { courseId, objectiveIndex } = req.params;
  const { objective }: { objective: string } = req.body;

  if (!objective) {
    return res.status(400).json({ error: 'Objective is required.' });
  }

  const index = parseInt(objectiveIndex, 10);

  if (isNaN(index) || index < 0) {
    return res.status(400).json({ error: 'Invalid objective index.' });
  }

  try {
    // Fetch course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    if (index >= course.objectives.length) {
      return res.status(400).json({ error: 'Objective index out of range.' });
    }

    // Update the specific objective
    const updatedObjectives = [...course.objectives];
    updatedObjectives[index] = objective;

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: { objectives: updatedObjectives },
    });

    res.status(200).json(updatedCourse);
  } catch (error) {
    handleError(res, error, 'An error occurred while updating the course objective.');
  }
};

// -----------------------
// Add Course Parts
// -----------------------
export const addCourseParts = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { title, price, completionTime, openingDate }: AddCoursePartInput = req.body;

  // Basic validation
  if (!title || price === undefined || completionTime === undefined || !openingDate) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Check if the course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    // Create the part
    const part = await prisma.part.create({
      data: {
        title,
        price,
        completionTime,
        openingDate: new Date(openingDate),
        courseId,
      },
    });

    res.status(201).json(part);
  } catch (error) {
    handleError(res, error, 'An error occurred while adding course parts.');
  }
};

// -----------------------
// Update a Specific Course Part
// -----------------------
export const updateCoursePart = async (req: Request, res: Response) => {
  const { courseId, partId } = req.params;
  const { title, price, completionTime, openingDate }: Partial<AddCoursePartInput> = req.body;

  try {
    // Check if the course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    // Check if the part exists and belongs to the course
    const part = await prisma.part.findUnique({
      where: { id: partId },
    });

    if (!part || part.courseId !== courseId) {
      return res.status(404).json({ error: 'Part not found in the specified course.' });
    }

    // Update the part
    const updatedPart = await prisma.part.update({
      where: { id: partId },
      data: {
        title: title ?? part.title,
        price: price ?? part.price,
        completionTime: completionTime ?? part.completionTime,
        openingDate: openingDate ? new Date(openingDate) : part.openingDate,
      },
    });

    res.status(200).json(updatedPart);
  } catch (error) {
    handleError(res, error, 'An error occurred while updating the course part.');
  }
};

// -----------------------
// Add Modules to a Part
// -----------------------
export const addModuleToPart = async (req: Request, res: Response) => {
  const { courseId, partId } = req.params;
  const { type }: AddModuleToPartInput = req.body;

  // Validation: Ensure type is one of the defined ModuleType
  if (!Object.values(ModuleType).includes(type)) {
    return res.status(400).json({ error: `Invalid module type. Must be one of ${Object.values(ModuleType).join(', ')}` });
  }

  try {
    // Check if the course and part exist
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    const part = await prisma.part.findUnique({
      where: { id: partId },
    });

    if (!part || part.courseId !== courseId) {
      return res.status(404).json({ error: 'Part not found in the specified course.' });
    }

    // Create the module
    const module = await prisma.module.create({
      data: {
        type,
        partId,
        courseId,
      },
    });

    res.status(201).json(module);
  } catch (error) {
    handleError(res, error, 'An error occurred while adding modules.');
  }
};

// -----------------------
// Update a Specific Module in a Part
// -----------------------
export const updateModuleInPart = async (req: Request, res: Response) => {
  const { courseId, partId, moduleId } = req.params;
  const { type }: AddModuleToPartInput = req.body;

  // Validation: Ensure type is one of the defined ModuleType
  if (type && !Object.values(ModuleType).includes(type)) {
    return res.status(400).json({ error: `Invalid module type. Must be one of ${Object.values(ModuleType).join(', ')}` });
  }

  try {
    // Check if the course, part, and module exist
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    const part = await prisma.part.findUnique({
      where: { id: partId },
    });

    if (!part || part.courseId !== courseId) {
      return res.status(404).json({ error: 'Part not found in the specified course.' });
    }

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!module || module.partId !== partId || module.courseId !== courseId) {
      return res.status(404).json({ error: 'Module not found in the specified part and course.' });
    }

    // Update the module
    const updatedModule = await prisma.module.update({
      where: { id: moduleId },
      data: {
        type: type ?? module.type,
      },
    });

    res.status(200).json(updatedModule);
  } catch (error) {
    handleError(res, error, 'An error occurred while updating the module.');
  }
};

// -----------------------
// Add Lessons to a Module
// -----------------------
export const addLessonToModule = async (req: Request, res: Response) => {
  const { courseId, partId, moduleId } = req.params;
  const { title, videoUrl, audioUrl, isPromotional }: AddLessonToModuleInput = req.body;

  // Basic validation
  if (!title) {
    return res.status(400).json({ error: 'Lesson title is required.' });
  }

  try {
    // Check if the course, part, and module exist
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    const part = await prisma.part.findUnique({
      where: { id: partId },
    });

    if (!part || part.courseId !== courseId) {
      return res.status(404).json({ error: 'Part not found in the specified course.' });
    }

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!module || module.partId !== partId || module.courseId !== courseId) {
      return res.status(404).json({ error: 'Module not found in the specified part and course.' });
    }

    // Create the lesson
    const lesson = await prisma.lesson.create({
      data: {
        title,
        videoUrl,
        audioUrl,
        isPromotional: isPromotional ?? false,
        moduleId,
      },
    });

    res.status(201).json(lesson);
  } catch (error) {
    handleError(res, error, 'An error occurred while adding lessons.');
  }
};

// -----------------------
// Update a Specific Lesson in a Module
// -----------------------
export const updateLessonInModule = async (req: Request, res: Response) => {
  const { courseId, partId, moduleId, lessonId } = req.params;
  const { title, videoUrl, audioUrl, isPromotional }: AddLessonToModuleInput = req.body;

  try {
    // Check if the course, part, module, and lesson exist
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    const part = await prisma.part.findUnique({
      where: { id: partId },
    });

    if (!part || part.courseId !== courseId) {
      return res.status(404).json({ error: 'Part not found in the specified course.' });
    }

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!module || module.partId !== partId || module.courseId !== courseId) {
      return res.status(404).json({ error: 'Module not found in the specified part and course.' });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson || lesson.moduleId !== moduleId) {
      return res.status(404).json({ error: 'Lesson not found in the specified module.' });
    }

    // Update the lesson
    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: title ?? lesson.title,
        videoUrl: videoUrl ?? lesson.videoUrl,
        audioUrl: audioUrl ?? lesson.audioUrl,
        isPromotional: isPromotional ?? lesson.isPromotional,
      },
    });

    res.status(200).json(updatedLesson);
  } catch (error) {
    handleError(res, error, 'An error occurred while updating the lesson.');
  }
};

// -----------------------
// Add Questions to a Module
// -----------------------
export const addQuestionsToModule = async (req: Request, res: Response) => {
  const { courseId, partId, moduleId } = req.params;
  const { questions }: AddQuestionsToModuleInput = req.body;

  if (!questions || !Array.isArray(questions)) {
    return res.status(400).json({ error: 'Questions must be an array.' });
  }

  try {
    // Check if the course, part, and module exist
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    const part = await prisma.part.findUnique({
      where: { id: partId },
    });

    if (!part || part.courseId !== courseId) {
      return res.status(404).json({ error: 'Part not found in the specified course.' });
    }

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!module || module.partId !== partId || module.courseId !== courseId) {
      return res.status(404).json({ error: 'Module not found in the specified part and course.' });
    }


    // Create questions
    const createdQuestions = await prisma.question.createMany({
      data: questions.map((question) => ({
        questionText: question.questionText,
        answerType: question.answerType,
        options: question.options,
        correctAnswer: question.correctAnswer,
        moduleId,
      })),
      skipDuplicates: true,
    });

    res.status(201).json({ count: createdQuestions.count });
  } catch (error) {
    handleError(res, error, 'An error occurred while adding questions.');
  }
};

// -----------------------
// Update a Specific Question in a Module
// -----------------------
export const updateQuestionsInModule = async (req: Request, res: Response) => {
  const { courseId, partId, moduleId, questionId } = req.params;
  const { questionText, answerType, options, correctAnswer }: Partial<Question> = req.body;

  // Validation: If answerType is provided, ensure it's valid
  if (answerType && !Object.values(answerType).includes(answerType)) {
    return res.status(400).json({ error: `Invalid answer type. Must be one of ${Object.values(answerType).join(', ')}` });
  }

  try {
    // Check if the course, part, module, and question exist
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    const part = await prisma.part.findUnique({
      where: { id: partId },
    });

    if (!part || part.courseId !== courseId) {
      return res.status(404).json({ error: 'Part not found in the specified course.' });
    }

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!module || module.partId !== partId || module.courseId !== courseId) {
      return res.status(404).json({ error: 'Module not found in the specified part and course.' });
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question || question.moduleId !== moduleId) {
      return res.status(404).json({ error: 'Question not found in the specified module.' });
    }

    // Update the question
    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: {
        questionText: questionText ?? question.questionText,
        answerType: answerType ?? question.answerType,
        options: options ?? question.options,
        correctAnswer: correctAnswer ?? question.correctAnswer,
      },
    });

    res.status(200).json(updatedQuestion);
  } catch (error) {
    handleError(res, error, 'An error occurred while updating the question.');
  }
};

// -----------------------
// Add Attachments to Modules
// -----------------------
export const addAttachmentsToModule = async (req: Request, res: Response) => {
  const { courseId, partId, moduleId } = req.params;
  const { attachments }: AddAttachmentsToModuleInput = req.body;

  if (!attachments || !Array.isArray(attachments)) {
    return res.status(400).json({ error: 'Attachments must be an array.' });
  }

  try {
    // Check if the course, part, and module exist
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    const part = await prisma.part.findUnique({
      where: { id: partId },
    });

    if (!part || part.courseId !== courseId) {
      return res.status(404).json({ error: 'Part not found in the specified course.' });
    }

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!module || module.partId !== partId || module.courseId !== courseId) {
      return res.status(404).json({ error: 'Module not found in the specified part and course.' });
    }

    // Validate each attachment
    for (const attachment of attachments) {
      if (!attachment.fileType || !attachment.fileUrl || !attachment.description) {
        return res.status(400).json({ error: 'Invalid attachment format.' });
      }
    }

    // Create attachments
    const createdAttachments = await prisma.attachment.createMany({
      data: attachments.map((attachment) => ({
        fileType: attachment.fileType,
        fileUrl: attachment.fileUrl,
        description: attachment.description,
        moduleId,
      })),
      skipDuplicates: true, // Optional: Skip duplicate attachments
    });

    res.status(201).json({ count: createdAttachments.count });
  } catch (error) {
    handleError(res, error, 'An error occurred while adding attachments.');
  }
};

// -----------------------
// Update a Specific Attachment in a Module
// -----------------------
export const updateAttachmentsInModule = async (req: Request, res: Response) => {
  const { courseId, partId, moduleId, attachmentId } = req.params;
  const { fileType, fileUrl, description }: Partial<Attachment> = req.body;

  try {
    // Check if the course, part, module, and attachment exist
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    const part = await prisma.part.findUnique({
      where: { id: partId },
    });

    if (!part || part.courseId !== courseId) {
      return res.status(404).json({ error: 'Part not found in the specified course.' });
    }

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!module || module.partId !== partId || module.courseId !== courseId) {
      return res.status(404).json({ error: 'Module not found in the specified part and course.' });
    }

    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment || attachment.moduleId !== moduleId) {
      return res.status(404).json({ error: 'Attachment not found in the specified module.' });
    }

    // Update the attachment
    const updatedAttachment = await prisma.attachment.update({
      where: { id: attachmentId },
      data: {
        fileType: fileType ?? attachment.fileType,
        fileUrl: fileUrl ?? attachment.fileUrl,
        description: description ?? attachment.description,
      },
    });

    res.status(200).json(updatedAttachment);
  } catch (error) {
    handleError(res, error, 'An error occurred while updating the attachment.');
  }
};
