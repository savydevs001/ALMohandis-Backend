// Admin Controlling Teachers

import express from 'express';
import {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher
} from '../../../controllers/admin/managment/teacher';

const router = express.Router();

// Create a new teacher (Admin only)
// full path :  /api/admin/teacher/create
router.post('/teacher/create', createTeacher);

// Get all teachers (Admin only)
router.get('/teacher/getAll', getAllTeachers);

// Get teacher by ID (Admin only)
router.get('/teacher/:id', getTeacherById);

// Update teacher details (Admin only)
router.put('/teacher/:id', updateTeacher);

// Delete teacher (Admin only)
router.delete('/:id', deleteTeacher);

export default router;
