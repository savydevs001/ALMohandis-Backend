
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import prisma from '../../prisma/client';
import { UserRole } from '@prisma/client';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Interface for the login request body
interface LoginRequestBody {
  email: string;
  password: string;
}

// Interface for the JWT payload
interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginRequestBody;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Attempt to find the user in the User (Student) model
    let user = await prisma.user.findUnique({
      where: { email },
    });

    let role: UserRole;
    let userId: string;

    if (user) {
      // User found in User model (Student)
      role = user.role;
      userId = user.id;
    } else {
      // Attempt to find the user in the Teacher model
      const teacher = await prisma.teacher.findUnique({
        where: { email },
      });

      if (!teacher) {
        // User not found in either model
        return res.status(404).json({ error: 'User not found.' });
      }

      // User found in Teacher model
      role = UserRole.TEACHER;
      userId = teacher.id;

      // Build the user object similar to the User model structure
      user = {
        id: teacher.id,
        email: teacher.email,
        password: teacher.password,
        role: UserRole.TEACHER,
      };
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    // Generate JWT token
    const payload: JwtPayload = {
      id: userId,
      email: user?.email,
      role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Optionally, you can include additional user data in the response
    const responseData = {
      message: 'Login successful.',
      token,
      user: {
        id: userId,
        email: user?.email,
        role,
      },
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ error: 'An error occurred during login.' });
  }
};
