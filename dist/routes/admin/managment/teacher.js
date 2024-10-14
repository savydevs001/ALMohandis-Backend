"use strict";
// Admin Controlling Teachers
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teacher_1 = require("../../../controllers/admin/managment/teacher");
const router = express_1.default.Router();
// Create a new teacher (Admin only)
// full path :  /api/admin/teacher/create
router.post('/teacher/create', teacher_1.createTeacher);
// Get all teachers (Admin only)
router.get('/teacher/getAll', teacher_1.getAllTeachers);
// Get teacher by ID (Admin only)
router.get('/teacher/:id', teacher_1.getTeacherById);
// Update teacher details (Admin only)
router.put('/teacher/:id', teacher_1.updateTeacher);
// Delete teacher (Admin only)
router.delete('/:id', teacher_1.deleteTeacher);
exports.default = router;
