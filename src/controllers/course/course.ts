// src/controllers/courseController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Course, AccessibilitySettings, Part, Module, Lesson ,StudentAccessType,ModuleType,Question,Attachment } from '../../types/types';

const prisma = new PrismaClient();

// Create a new course
export const createCourse = async (req: Request, res: Response) => {
  const { title, description, isFree, objectives, instructorId }: Course = req.body;
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
    res.status(500).json({ error: "An error occurred while creating the course." });
  }
};

// Update Accessibility Settings
export const updateAccessibilitySettings = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { studentAccessType, academicStage, canAccessIfPurchased }: AccessibilitySettings = req.body;
  
  try {
    const accessibility = await prisma.accessibilitySettings.create({
      data: {
        courseId,
        studentAccessType,
        academicStage,
        canAccessIfPurchased,
      },
    });
    res.status(201).json(accessibility);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating accessibility settings." });
  }
};

// Add Course Objectives
export const addCourseObjectives = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { objectives }: { objectives: string[] } = req.body;

  try {
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: { objectives },
    });
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while adding course objectives." });
  }
};

// Add Course Parts
export const addCourseParts = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { title, price, completionTime, openingDate }: Part = req.body;

  try {
    const part = await prisma.part.create({
      data: {
        title,
        price,
        completionTime,
        openingDate,
        courseId,
      },
    });
    res.status(201).json(part);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while adding course parts." });
  }
};

// Add Modules to a Part
export const addModuleToPart = async (req: Request, res: Response) => {
  const { courseId, partId } = req.params;
  const { type }: { type: string } = req.body; // or use enum

  try {
    const module = await prisma.module.create({
      data: {
        type:type as ModuleType,
        partId,
        courseId,
      },
    });
    res.status(201).json(module);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while adding modules." });
  }
};

// Add Lessons/Clips
export const addLessonToModule = async (req: Request, res: Response) => {
  const { courseId, partId, moduleId } = req.params;
  const { title, videoUrl, audioUrl }: Lesson = req.body;

  try {
    const lesson = await prisma.lesson.create({
      data: {
        title,
        videoUrl,
        audioUrl,
        moduleId,
      },
    });
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while adding lessons." });
  }
};

export const addQuestionsToModule = async (req: Request, res: Response) => {
  const { courseId, partId, moduleId } = req.params;
  const { questions }: { questions: Question[] } = req.body;

  try {
    const createdQuestions = await prisma.question.createMany({
      data: questions.map((question) => ({
        questionText: question.questionText,
        answerType: question.answerType, 
        options: question.options || [], // Default to empty array if not provided
        correctAnswer: question.correctAnswer || "", // Default to empty string if not provided
        moduleId, // Associate the question with the module
      })),
    });
    res.status(201).json(createdQuestions);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while adding questions." });
  }
};

// Add Attachments to Modules
export const addAttachmentsToModule = async (req: Request, res: Response) => {
  const { courseId, partId, moduleId } = req.params;
  const { attachments }: { attachments: Attachment[] } = req.body;

  try {
    const createdAttachments = await prisma.attachment.createMany({
      data: attachments.map((attachment) => ({
        fileUrl: attachment.fileUrl,
        moduleId,
        fileType: attachment.fileType,
        description: attachment.description,
      })),
    });
    res.status(201).json(createdAttachments);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while adding attachments." });
  }
};
