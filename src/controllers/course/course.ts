// src/controllers/courseController.ts

import { Request, Response } from 'express';
import prisma from '../../prisma/client';
import { AuthenticatedRequest } from '../../middlware/auth';
import {
  CreateCourseInput,
  UpdateCourseInput,
  UpdateAccessibilitySettingsInput,
  AddCoursePartInput,
  ModuleType,
} from '../../types/types';

// Helper function for error handling
const handleError = (res: Response, error: any, message: string) => {
  console.error(message, error);
  res.status(500).json({ error: message });
};

// -----------------------
// Create a New Course
// -----------------------
export const createCourse = async (req: AuthenticatedRequest, res: Response) => {
  const { title, description }: CreateCourseInput = req.body;
  const instructorId = req?.user?.id;
  // Basic validation
  if (!title || !description || !instructorId) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const course = await prisma.course.create({
      data: {
        title,
        description,
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
        objectives: Array.isArray(objectives) ? objectives : existingCourse.objectives,
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
  const { studentAccessType, academicStage, canAccessIfPurchased , isFree , broughtFromTeacherId }: UpdateAccessibilitySettingsInput = req.body;

  try {
    // Check if the course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }
    if (isFree) {
      await prisma.course.update({
        where: { id: courseId },
        data: {
          isFree: isFree,
        },
      });
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
          academicStage: Array.isArray(academicStage) ? academicStage : existingSettings.academicStage,
          canAccessIfPurchased: canAccessIfPurchased ?? existingSettings.canAccessIfPurchased,
          broughtFromTeacherId: broughtFromTeacherId ?? existingSettings.broughtFromTeacherId,
        },
      });
      res.status(200).json(updatedSettings);
    } else {
      // Create new settings
      const accessibility = await prisma.accessibilitySettings.create({
        data: {
          courseId,
          studentAccessType,
          academicStage: Array.isArray(academicStage) ? academicStage : [academicStage],
          canAccessIfPurchased,
          broughtFromTeacherId,
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
  const { objectives,whatYouWillLearn } = req.body;

 if(!objectives || !whatYouWillLearn){
    return res.status(400).json({ error: 'All fields are required.' });
 }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    // Update course objectives
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
         objectives,
         whatYouWillLearn
      }
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
  const { courseId } = req.params; 
  const { objectives }: { objectives: string } = req.body;

  if (!objectives) {
    return res.status(400).json({ error: 'Objective is required.' });
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    // Update the objective directly
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        objectives,
        },
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

// addChapterModule
export const addChapterModule = async (req: Request, res: Response) => {
  const { courseId, partId } = req.params;
  const { lesson } = req.body;

  if (!lesson) {
    return res.status(400).json({ error: 'Lesson data is required.' });
  }

  try {
    const part = await prisma.part.findUnique({
      where: { id: partId },
      include: { course: true },
    });

    if (!part || part.courseId !== courseId) {
      return res.status(404).json({ error: 'Part not found in the specified course.' });
    }

    const module = await prisma.module.create({
      data: {
        type: ModuleType.CHAPTER,
        partId,
        courseId,
        lessons: {
          create: {
            title: lesson.title,
            description: lesson.description,
            srcUrl: lesson.srcUrl,
            type: lesson.lessonType,
            clips: {
              create: lesson.clips,
            },
          },
        },
      },
    });

    res.status(201).json(module);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding the chapter module.' });
  }
};

// addExamModule

export const addExamModule = async (req: Request, res: Response) => {
  const { courseId, partId } = req.params;
  const { title, questions } = req.body;

  try {
    const part = await prisma.part.findUnique({
      where: { id: partId },
      include: { course: true },
    });

    if (!part || part.courseId !== courseId) {
      return res.status(404).json({ error: 'Part not found in the specified course.' });
    }

    const module = await prisma.module.create({
      data: {
        type: ModuleType.EXAM,
        partId,
        courseId,
        exams: {
          create: {
            title,
            questions: {
              create: questions,
            },
          },
        },
      },
    });

    res.status(201).json(module);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding the exam module.' });
  }
};

// addAssignmentModule

export const addAssignmentModule = async (req: Request, res: Response) => {
  const { courseId, partId } = req.params;
  const { title, questions } = req.body;

  try {
    const part = await prisma.part.findUnique({
      where: { id: partId },
      include: { course: true },
    });

    if (!part || part.courseId !== courseId) {
      return res.status(404).json({ error: 'Part not found in the specified course.' });
    }

    const module = await prisma.module.create({
      data: {
        type: ModuleType.ASSIGNMENT,
        partId,
        courseId,
        assignments: {
          create: {
            title,
            questions: {
              create: questions,
            },
          },
        },
      },
    });

    res.status(201).json(module);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding the assignment module.' });
  }
};

// addAttachmentModule

export const addAttachmentModule = async (req: Request, res: Response) => {
  const { courseId, partId } = req.params;
  const { fileType, fileUrl, description } = req.body;

  if (!fileType || !fileUrl) {
    return res.status(400).json({ error: 'File type and URL are required.' });
  }

  try {
    const part = await prisma.part.findUnique({
      where: { id: partId },
      include: { course: true },
    });

    if (!part || part.courseId !== courseId) {
      return res.status(404).json({ error: 'Part not found in the specified course.' });
    }

    const module = await prisma.module.create({
      data: {
        type: ModuleType.ATTACHMENT,
        partId,
        courseId,
        attachments: {
          create: {
            fileType,
            fileUrl,
            description,
          },
        },
      },
    });

    res.status(201).json(module);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding the attachment module.' });
  }
};

export const sendforReview= async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { status } = req.body;

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId }, 
      data: {
        waitingForReview: status, 
        isDraft:false
      },
  });

    res.status(200).json(updatedCourse);
  } catch (error) {
    handleError(res, error, 'An error occurred while sending course for review.');
  }
}








