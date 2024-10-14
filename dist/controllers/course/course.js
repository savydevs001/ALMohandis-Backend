"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAttachmentsToModule = exports.addQuestionsToModule = exports.addLessonToModule = exports.addModuleToPart = exports.addCourseParts = exports.addCourseObjectives = exports.updateAccessibilitySettings = exports.createCourse = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create a new course
const createCourse = async (req, res) => {
    const { title, description, isFree, objectives, instructorId } = req.body;
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
    }
    catch (error) {
        res.status(500).json({ error: "An error occurred while creating the course." });
    }
};
exports.createCourse = createCourse;
// Update Accessibility Settings
const updateAccessibilitySettings = async (req, res) => {
    const { courseId } = req.params;
    const { studentAccessType, academicStage, canAccessIfPurchased } = req.body;
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
    }
    catch (error) {
        res.status(500).json({ error: "An error occurred while updating accessibility settings." });
    }
};
exports.updateAccessibilitySettings = updateAccessibilitySettings;
// Add Course Objectives
const addCourseObjectives = async (req, res) => {
    const { courseId } = req.params;
    const { objectives } = req.body;
    try {
        const updatedCourse = await prisma.course.update({
            where: { id: courseId },
            data: { objectives },
        });
        res.json(updatedCourse);
    }
    catch (error) {
        res.status(500).json({ error: "An error occurred while adding course objectives." });
    }
};
exports.addCourseObjectives = addCourseObjectives;
// Add Course Parts
const addCourseParts = async (req, res) => {
    const { courseId } = req.params;
    const { title, price, completionTime, openingDate } = req.body;
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
    }
    catch (error) {
        res.status(500).json({ error: "An error occurred while adding course parts." });
    }
};
exports.addCourseParts = addCourseParts;
// Add Modules to a Part
const addModuleToPart = async (req, res) => {
    const { courseId, partId } = req.params;
    const { type } = req.body; // or use enum
    try {
        const module = await prisma.module.create({
            data: {
                type: type,
                partId,
                courseId,
            },
        });
        res.status(201).json(module);
    }
    catch (error) {
        res.status(500).json({ error: "An error occurred while adding modules." });
    }
};
exports.addModuleToPart = addModuleToPart;
// Add Lessons/Clips
const addLessonToModule = async (req, res) => {
    const { courseId, partId, moduleId } = req.params;
    const { title, videoUrl, audioUrl } = req.body;
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
    }
    catch (error) {
        res.status(500).json({ error: "An error occurred while adding lessons." });
    }
};
exports.addLessonToModule = addLessonToModule;
const addQuestionsToModule = async (req, res) => {
    const { courseId, partId, moduleId } = req.params;
    const { questions } = req.body;
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
    }
    catch (error) {
        res.status(500).json({ error: "An error occurred while adding questions." });
    }
};
exports.addQuestionsToModule = addQuestionsToModule;
// Add Attachments to Modules
const addAttachmentsToModule = async (req, res) => {
    const { courseId, partId, moduleId } = req.params;
    const { attachments } = req.body;
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
    }
    catch (error) {
        res.status(500).json({ error: "An error occurred while adding attachments." });
    }
};
exports.addAttachmentsToModule = addAttachmentsToModule;
