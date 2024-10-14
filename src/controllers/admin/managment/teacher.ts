
import { Request, Response } from 'express';
import prisma from '../../../prisma/client';
import { Teacher } from '@prisma/client';
import bcrypt from 'bcrypt';


export const createTeacher = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      gender,
      joiningDate,
      email,
      password,
      dateOfBirth,
      phone,
      department,
      level,
      experience,
    } = req.body;

    if (
      !fullName ||
      !gender ||
      !joiningDate ||
      !email ||
      !password ||
      !dateOfBirth ||
      !phone ||
      !department ||
      level === undefined ||
      experience === undefined
    ) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Check if a teacher with the same email already exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { email },
    });

    if (existingTeacher) {
      return res.status(409).json({ error: 'Teacher with this email already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the teacher
    const teacher : Teacher = await prisma.teacher.create({
      data: {
        fullName,
        gender,
        joiningDate: new Date(joiningDate),
        email,
        password: hashedPassword,
        dateOfBirth: new Date(dateOfBirth),
        phone,
        department,
        level,
        experience,
      },
    });


    return res.status(201).json({
      message: 'Teacher created successfully.',
    });
  } catch (error) {
    console.error('Error creating teacher:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        courses: true, 
      },
    });
    return res.status(200).json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};


export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const teacher = await prisma.teacher.findUnique({
      where: { id: String(id) }, 
      include: {
        courses: true, 
      },
    });

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found.' });
    }

    return res.status(200).json(teacher);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};


export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      gender,
      joiningDate,
      email,
      password,
      dateOfBirth,
      phone,
      department,
      level,
      experience,
    } = req.body;

    const existingTeacher = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!existingTeacher) {
      return res.status(404).json({ error: 'Teacher not found.' });
    }

    const updatedData = {
      fullName,
      gender,
      joiningDate: joiningDate ? new Date(joiningDate) : undefined,
      email,
      password: password ? await bcrypt.hash(password, 10) : undefined,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      phone,
      department,
      level,
      experience,
    };

    const updatedTeacher = await prisma.teacher.update({
      where: { id},
      data: updatedData,
    });

    return res.status(200).json({
      message: 'Teacher updated successfully.',
      updatedTeacher,
    });
  } catch (error) {
    console.error('Error updating teacher:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingTeacher = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!existingTeacher) {
      return res.status(404).json({ error: 'Teacher not found.' });
    }

    await prisma.teacher.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Teacher deleted successfully.' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};



